package com.example.lostfound.module.post.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.exception.BusinessException;
import com.example.lostfound.common.exception.ErrorCode;
import com.example.lostfound.common.security.SecurityUtils;
import com.example.lostfound.module.log.service.OperationLogService;
import com.example.lostfound.module.post.converter.PostConverter;
import com.example.lostfound.module.post.dto.DuplicateCheckRequest;
import com.example.lostfound.module.post.dto.DuplicateCheckResponse;
import com.example.lostfound.module.post.dto.PostCreateRequest;
import com.example.lostfound.module.post.dto.PostDTO;
import com.example.lostfound.module.post.dto.PostQueryRequest;
import com.example.lostfound.module.post.dto.PostUpdateRequest;
import com.example.lostfound.module.post.dto.RemovePostRequest;
import com.example.lostfound.module.post.entity.Post;
import com.example.lostfound.module.post.enums.PostStatus;
import com.example.lostfound.module.post.mapper.PostMapper;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final PostConverter postConverter;
    private final DuplicateCheckService duplicateCheckService;
    private final OperationLogService operationLogService;

    public PostService(
        PostMapper postMapper,
        UserMapper userMapper,
        PostConverter postConverter,
        DuplicateCheckService duplicateCheckService,
        OperationLogService operationLogService
    ) {
        this.postMapper = postMapper;
        this.userMapper = userMapper;
        this.postConverter = postConverter;
        this.duplicateCheckService = duplicateCheckService;
        this.operationLogService = operationLogService;
    }

    public PageResult<PostDTO> pagePosts(PostQueryRequest request, boolean adminView) {
        LambdaQueryWrapper<Post> wrapper = baseQuery(request)
            .ne(!adminView, Post::getStatus, PostStatus.REMOVED);
        applySort(wrapper, request.getSortBy());
        IPage<Post> page = postMapper.selectPage(Page.of(request.getPage(), request.getPageSize()), wrapper);
        return new PageResult<>(
            page.getRecords().stream().map(this::toDto).toList(),
            page.getTotal(),
            request.getPage(),
            request.getPageSize()
        );
    }

    public PostDTO getPost(Long id) {
        Post post = getRequired(id);
        if (post.getStatus() == PostStatus.REMOVED && !canManage(post)) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return toDto(post);
    }

    @Transactional
    public PostDTO create(PostCreateRequest request) {
        Long userId = SecurityUtils.currentUserId();
        DuplicateCheckRequest checkRequest = new DuplicateCheckRequest();
        copyCreateRequest(request, checkRequest);
        BigDecimal duplicateScore = duplicateCheckService.scoreValue(checkRequest);
        LocalDateTime now = LocalDateTime.now();

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setType(request.getType());
        post.setCategory(request.getCategory());
        post.setDescription(request.getDescription());
        post.setImageUrl(request.getImageUrl());
        post.setLocation(request.getLocation());
        post.setOccurredAt(request.getOccurredAt());
        post.setContact(request.getContact());
        post.setStatus(PostStatus.PROCESSING);
        post.setOwnerId(userId);
        post.setDuplicateScore(duplicateScore);
        post.setExpiredAt(request.getExpiredAt() == null ? now.plusDays(30) : request.getExpiredAt());
        post.setCreatedAt(now);
        post.setUpdatedAt(now);
        post.setVersion(0);
        post.setDeleted(0);
        postMapper.insert(post);
        return toDto(post);
    }

    @Transactional
    public PostDTO update(Long id, PostUpdateRequest request) {
        Post post = getRequired(id);
        if (!canManage(post)) {
            throw new BusinessException(ErrorCode.POST_FORBIDDEN);
        }
        if (post.getStatus() != PostStatus.PROCESSING) {
            throw new BusinessException(ErrorCode.POST_NOT_PROCESSING);
        }
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getCategory() != null) {
            post.setCategory(request.getCategory());
        }
        if (request.getDescription() != null) {
            post.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            post.setImageUrl(request.getImageUrl());
        }
        if (request.getLocation() != null) {
            post.setLocation(request.getLocation());
        }
        if (request.getOccurredAt() != null) {
            post.setOccurredAt(request.getOccurredAt());
        }
        if (request.getContact() != null) {
            post.setContact(request.getContact());
        }
        if (request.getExpiredAt() != null) {
            post.setExpiredAt(request.getExpiredAt());
        }
        post.setUpdatedAt(LocalDateTime.now());
        ensureUpdated(postMapper.updateById(post));
        return toDto(post);
    }

    @Transactional
    public void delete(Long id) {
        Post post = getRequired(id);
        if (!post.getOwnerId().equals(SecurityUtils.currentUserId()) && !SecurityUtils.isAdmin()) {
            throw new BusinessException(ErrorCode.POST_FORBIDDEN);
        }
        postMapper.deleteById(id);
    }

    @Transactional
    public void remove(Long id, RemovePostRequest request) {
        Post post = getRequired(id);
        post.setStatus(PostStatus.REMOVED);
        post.setUpdatedAt(LocalDateTime.now());
        ensureUpdated(postMapper.updateById(post));
        operationLogService.log(SecurityUtils.currentUserId(), "REMOVE_POST", "POST", id, request.getReason());
    }

    @Transactional
    public int expireProcessingPosts() {
        return postMapper.update(null, Wrappers.<Post>lambdaUpdate()
            .eq(Post::getStatus, PostStatus.PROCESSING)
            .lt(Post::getExpiredAt, LocalDateTime.now())
            .set(Post::getStatus, PostStatus.EXPIRED)
            .set(Post::getUpdatedAt, LocalDateTime.now()));
    }

    public DuplicateCheckResponse duplicateCheck(DuplicateCheckRequest request) {
        return duplicateCheckService.check(request);
    }

    public Post getRequired(Long id) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return post;
    }

    public PostDTO toDto(Post post) {
        PostDTO dto = postConverter.toDto(post);
        User owner = userMapper.selectById(post.getOwnerId());
        dto.setOwnerName(owner == null ? null : owner.getNickname());
        return dto;
    }

    private LambdaQueryWrapper<Post> baseQuery(PostQueryRequest request) {
        return Wrappers.<Post>lambdaQuery()
            .eq(Post::getDeleted, 0)
            .eq(request.getType() != null, Post::getType, request.getType())
            .eq(request.getStatus() != null, Post::getStatus, request.getStatus())
            .like(StringUtils.hasText(request.getLocation()), Post::getLocation, request.getLocation())
            .and(StringUtils.hasText(request.getKeyword()), query -> query
                .like(Post::getTitle, request.getKeyword())
                .or()
                .like(Post::getDescription, request.getKeyword()));
    }

    private void applySort(LambdaQueryWrapper<Post> wrapper, String sortBy) {
        if ("expiredAtAsc".equals(sortBy)) {
            wrapper.orderByAsc(Post::getExpiredAt);
        } else if ("updatedAtDesc".equals(sortBy)) {
            wrapper.orderByDesc(Post::getUpdatedAt);
        } else {
            wrapper.orderByDesc(Post::getCreatedAt);
        }
    }

    private boolean canManage(Post post) {
        if (SecurityUtils.isAdmin()) {
            return true;
        }
        try {
            return post.getOwnerId().equals(SecurityUtils.currentUserId());
        } catch (BusinessException ignored) {
            return false;
        }
    }

    private void ensureUpdated(int updated) {
        if (updated == 0) {
            throw new BusinessException(ErrorCode.CONFLICT, "数据已被其他操作修改，请刷新后重试");
        }
    }

    private void copyCreateRequest(PostCreateRequest source, DuplicateCheckRequest target) {
        target.setTitle(source.getTitle());
        target.setType(source.getType());
        target.setCategory(source.getCategory());
        target.setDescription(source.getDescription());
        target.setImageUrl(source.getImageUrl());
        target.setLocation(source.getLocation());
        target.setOccurredAt(source.getOccurredAt());
        target.setContact(source.getContact());
        target.setExpiredAt(source.getExpiredAt());
        target.setConfirmDuplicate(source.getConfirmDuplicate());
    }
}
