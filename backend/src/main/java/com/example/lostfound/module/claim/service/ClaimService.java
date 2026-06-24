package com.example.lostfound.module.claim.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.exception.BusinessException;
import com.example.lostfound.common.exception.ErrorCode;
import com.example.lostfound.common.security.SecurityUtils;
import com.example.lostfound.common.util.RedisLockHelper;
import com.example.lostfound.module.claim.converter.ClaimConverter;
import com.example.lostfound.module.claim.dto.ClaimCreateRequest;
import com.example.lostfound.module.claim.dto.ClaimDTO;
import com.example.lostfound.module.claim.dto.ClaimQueryRequest;
import com.example.lostfound.module.claim.dto.ClaimReviewRequest;
import com.example.lostfound.module.claim.entity.Claim;
import com.example.lostfound.module.claim.enums.ClaimStatus;
import com.example.lostfound.module.claim.mapper.ClaimMapper;
import com.example.lostfound.module.log.service.OperationLogService;
import com.example.lostfound.module.notification.enums.NotificationType;
import com.example.lostfound.module.notification.service.NotificationService;
import com.example.lostfound.module.post.entity.Post;
import com.example.lostfound.module.post.enums.PostStatus;
import com.example.lostfound.module.post.enums.PostType;
import com.example.lostfound.module.post.mapper.PostMapper;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    private final ClaimMapper claimMapper;
    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final ClaimConverter claimConverter;
    private final RedisLockHelper redisLockHelper;
    private final NotificationService notificationService;
    private final OperationLogService operationLogService;

    public ClaimService(
        ClaimMapper claimMapper,
        PostMapper postMapper,
        UserMapper userMapper,
        ClaimConverter claimConverter,
        RedisLockHelper redisLockHelper,
        NotificationService notificationService,
        OperationLogService operationLogService
    ) {
        this.claimMapper = claimMapper;
        this.postMapper = postMapper;
        this.userMapper = userMapper;
        this.claimConverter = claimConverter;
        this.redisLockHelper = redisLockHelper;
        this.notificationService = notificationService;
        this.operationLogService = operationLogService;
    }

    @Transactional
    public ClaimDTO create(ClaimCreateRequest request) {
        Long userId = SecurityUtils.currentUserId();
        String lockKey = "claim:post:" + request.getPostId() + ":user:" + userId;
        String token = redisLockHelper.tryLock(lockKey, Duration.ofSeconds(10));
        if (token == null) {
            throw new BusinessException(ErrorCode.CONFLICT, "申请正在处理中，请勿重复提交");
        }
        try {
            Post post = postMapper.selectById(request.getPostId());
            validateClaimable(post, userId);
            assertNoDuplicate(request.getPostId(), userId);

            LocalDateTime now = LocalDateTime.now();
            Claim claim = new Claim();
            claim.setPostId(request.getPostId());
            claim.setClaimerId(userId);
            claim.setReason(request.getReason());
            claim.setProofDescription(request.getProofDescription());
            claim.setStatus(ClaimStatus.PENDING);
            claim.setCreatedAt(now);
            claim.setUpdatedAt(now);
            claim.setVersion(0);
            claim.setDeleted(0);
            claimMapper.insert(claim);

            User claimer = userMapper.selectById(userId);
            notificationService.notifyAdmins(
                "新的认领申请",
                "用户 " + displayName(claimer) + " 对“" + post.getTitle() + "”提交了认领申请。",
                NotificationType.CLAIM_CREATED
            );
            notificationService.create(userId, "认领申请已提交", "你的认领申请已提交，请等待管理员审核。", NotificationType.CLAIM_CREATED);
            return toDto(claim);
        } finally {
            redisLockHelper.unlock(lockKey, token);
        }
    }

    public PageResult<ClaimDTO> pageMyClaims(ClaimQueryRequest request) {
        Long userId = SecurityUtils.currentUserId();
        LambdaQueryWrapper<Claim> wrapper = baseQuery(request)
            .eq(Claim::getClaimerId, userId)
            .orderByDesc(Claim::getCreatedAt);
        return pageClaims(request, wrapper);
    }

    public PageResult<ClaimDTO> pageAdminClaims(ClaimQueryRequest request) {
        LambdaQueryWrapper<Claim> wrapper = baseQuery(request).orderByDesc(Claim::getCreatedAt);
        return pageClaims(request, wrapper);
    }

    public ClaimDTO getClaim(Long id) {
        Claim claim = getRequired(id);
        if (!SecurityUtils.isAdmin() && !claim.getClaimerId().equals(SecurityUtils.currentUserId())) {
            throw new BusinessException(ErrorCode.CLAIM_FORBIDDEN);
        }
        return toDto(claim);
    }

    @Transactional
    public ClaimDTO cancel(Long id) {
        Claim claim = getRequired(id);
        if (!claim.getClaimerId().equals(SecurityUtils.currentUserId())) {
            throw new BusinessException(ErrorCode.CLAIM_FORBIDDEN);
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BusinessException(ErrorCode.CLAIM_INVALID_STATUS);
        }
        claim.setStatus(ClaimStatus.CANCELLED);
        claim.setUpdatedAt(LocalDateTime.now());
        ensureUpdated(claimMapper.updateById(claim));
        return toDto(claim);
    }

    @Transactional
    public ClaimDTO approve(Long id, ClaimReviewRequest request) {
        Claim claim = getRequired(id);
        String lockKey = "review:post:" + claim.getPostId();
        String token = redisLockHelper.tryLock(lockKey, Duration.ofSeconds(20));
        if (token == null) {
            throw new BusinessException(ErrorCode.CONFLICT, "该物品正在审核中，请稍后重试");
        }
        try {
            claim = getRequired(id);
            Post post = postMapper.selectById(claim.getPostId());
            if (claim.getStatus() != ClaimStatus.PENDING) {
                throw new BusinessException(ErrorCode.CLAIM_INVALID_STATUS);
            }
            if (post == null || post.getStatus() != PostStatus.PROCESSING) {
                throw new BusinessException(ErrorCode.POST_NOT_PROCESSING);
            }
            Long reviewerId = SecurityUtils.currentUserId();
            LocalDateTime now = LocalDateTime.now();

            claim.setStatus(ClaimStatus.APPROVED);
            claim.setReviewComment(request.getReviewComment());
            claim.setReviewerId(reviewerId);
            claim.setReviewedAt(now);
            claim.setUpdatedAt(now);
            ensureUpdated(claimMapper.updateById(claim));

            post.setStatus(PostStatus.CLAIMED);
            post.setUpdatedAt(now);
            ensureUpdated(postMapper.updateById(post));

            List<Claim> otherPendingClaims = claimMapper.selectList(Wrappers.<Claim>lambdaQuery()
                .eq(Claim::getPostId, post.getId())
                .eq(Claim::getStatus, ClaimStatus.PENDING)
                .ne(Claim::getId, claim.getId())
                .eq(Claim::getDeleted, 0));
            claimMapper.update(null, Wrappers.<Claim>lambdaUpdate()
                .eq(Claim::getPostId, post.getId())
                .eq(Claim::getStatus, ClaimStatus.PENDING)
                .ne(Claim::getId, claim.getId())
                .set(Claim::getStatus, ClaimStatus.REJECTED)
                .set(Claim::getReviewComment, "同一物品已有其他申请通过")
                .set(Claim::getReviewerId, reviewerId)
                .set(Claim::getReviewedAt, now)
                .set(Claim::getUpdatedAt, now));

            operationLogService.log(reviewerId, "APPROVE_CLAIM", "CLAIM", claim.getId(), request.getReviewComment());
            notificationService.create(claim.getClaimerId(), "认领申请已通过", "你对“" + post.getTitle() + "”的认领申请已通过。", NotificationType.CLAIM_APPROVED);
            notificationService.notifyUsers(
                otherPendingClaims.stream().map(Claim::getClaimerId).toList(),
                "认领申请已驳回",
                "你提交的认领申请已被自动驳回：同一物品已有其他申请通过。",
                NotificationType.CLAIM_REJECTED
            );
            return toDto(claim);
        } finally {
            redisLockHelper.unlock(lockKey, token);
        }
    }

    @Transactional
    public ClaimDTO reject(Long id, ClaimReviewRequest request) {
        Claim claim = getRequired(id);
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BusinessException(ErrorCode.CLAIM_INVALID_STATUS);
        }
        Long reviewerId = SecurityUtils.currentUserId();
        LocalDateTime now = LocalDateTime.now();
        claim.setStatus(ClaimStatus.REJECTED);
        claim.setReviewComment(request.getReviewComment());
        claim.setReviewerId(reviewerId);
        claim.setReviewedAt(now);
        claim.setUpdatedAt(now);
        ensureUpdated(claimMapper.updateById(claim));

        Post post = postMapper.selectById(claim.getPostId());
        operationLogService.log(reviewerId, "REJECT_CLAIM", "CLAIM", claim.getId(), request.getReviewComment());
        notificationService.create(
            claim.getClaimerId(),
            "认领申请已驳回",
            "你对“" + (post == null ? "物品" : post.getTitle()) + "”的认领申请已驳回。",
            NotificationType.CLAIM_REJECTED
        );
        return toDto(claim);
    }

    private void validateClaimable(Post post, Long userId) {
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        if (post.getType() != PostType.FOUND || post.getStatus() != PostStatus.PROCESSING) {
            throw new BusinessException(ErrorCode.CLAIM_INVALID_POST);
        }
        if (post.getOwnerId().equals(userId)) {
            throw new BusinessException(ErrorCode.CLAIM_SELF_POST);
        }
    }

    private void assertNoDuplicate(Long postId, Long userId) {
        Long count = claimMapper.selectCount(Wrappers.<Claim>lambdaQuery()
            .eq(Claim::getPostId, postId)
            .eq(Claim::getClaimerId, userId)
            .eq(Claim::getDeleted, 0));
        if (count > 0) {
            throw new BusinessException(ErrorCode.CLAIM_DUPLICATED);
        }
    }

    private LambdaQueryWrapper<Claim> baseQuery(ClaimQueryRequest request) {
        return Wrappers.<Claim>lambdaQuery()
            .eq(Claim::getDeleted, 0)
            .eq(request.getStatus() != null, Claim::getStatus, request.getStatus())
            .eq(request.getPostId() != null, Claim::getPostId, request.getPostId());
    }

    private PageResult<ClaimDTO> pageClaims(ClaimQueryRequest request, LambdaQueryWrapper<Claim> wrapper) {
        IPage<Claim> page = claimMapper.selectPage(Page.of(request.getPage(), request.getPageSize()), wrapper);
        return new PageResult<>(
            page.getRecords().stream().map(this::toDto).toList(),
            page.getTotal(),
            request.getPage(),
            request.getPageSize()
        );
    }

    private Claim getRequired(Long id) {
        Claim claim = claimMapper.selectById(id);
        if (claim == null) {
            throw new BusinessException(ErrorCode.CLAIM_NOT_FOUND);
        }
        return claim;
    }

    private ClaimDTO toDto(Claim claim) {
        ClaimDTO dto = claimConverter.toDto(claim);
        Post post = postMapper.selectById(claim.getPostId());
        User claimer = userMapper.selectById(claim.getClaimerId());
        User reviewer = claim.getReviewerId() == null ? null : userMapper.selectById(claim.getReviewerId());
        dto.setPostTitle(post == null ? null : post.getTitle());
        dto.setClaimerName(displayName(claimer));
        dto.setReviewerName(displayName(reviewer));
        return dto;
    }

    private String displayName(User user) {
        if (user == null) {
            return null;
        }
        return user.getNickname() == null ? user.getUsername() : user.getNickname();
    }

    private void ensureUpdated(int updated) {
        if (updated == 0) {
            throw new BusinessException(ErrorCode.CONFLICT, "数据已被其他操作修改，请刷新后重试");
        }
    }
}
