package com.example.lostfound.module.admin.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.example.lostfound.module.admin.dto.AdminStatsDTO;
import com.example.lostfound.module.claim.enums.ClaimStatus;
import com.example.lostfound.module.claim.mapper.ClaimMapper;
import com.example.lostfound.module.notification.entity.Notification;
import com.example.lostfound.module.notification.mapper.NotificationMapper;
import com.example.lostfound.module.post.enums.PostStatus;
import com.example.lostfound.module.post.enums.PostType;
import com.example.lostfound.module.post.mapper.PostMapper;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.enums.UserStatus;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserMapper userMapper;
    private final PostMapper postMapper;
    private final ClaimMapper claimMapper;
    private final NotificationMapper notificationMapper;

    public AdminService(
        UserMapper userMapper,
        PostMapper postMapper,
        ClaimMapper claimMapper,
        NotificationMapper notificationMapper
    ) {
        this.userMapper = userMapper;
        this.postMapper = postMapper;
        this.claimMapper = claimMapper;
        this.notificationMapper = notificationMapper;
    }

    public AdminStatsDTO stats() {
        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setUserCount(userMapper.selectCount(Wrappers.<User>lambdaQuery().eq(User::getDeleted, 0)));
        stats.setActiveUserCount(userMapper.selectCount(Wrappers.<User>lambdaQuery()
            .eq(User::getDeleted, 0)
            .eq(User::getStatus, UserStatus.ACTIVE)));
        stats.setLostPostCount(postMapper.selectCount(Wrappers.<com.example.lostfound.module.post.entity.Post>lambdaQuery()
            .eq(com.example.lostfound.module.post.entity.Post::getType, PostType.LOST)));
        stats.setFoundPostCount(postMapper.selectCount(Wrappers.<com.example.lostfound.module.post.entity.Post>lambdaQuery()
            .eq(com.example.lostfound.module.post.entity.Post::getType, PostType.FOUND)));
        stats.setProcessingPostCount(countPosts(PostStatus.PROCESSING));
        stats.setClaimedPostCount(countPosts(PostStatus.CLAIMED));
        stats.setExpiredPostCount(countPosts(PostStatus.EXPIRED));
        stats.setRemovedPostCount(countPosts(PostStatus.REMOVED));
        stats.setPendingClaimCount(countClaims(ClaimStatus.PENDING));
        stats.setApprovedClaimCount(countClaims(ClaimStatus.APPROVED));
        stats.setRejectedClaimCount(countClaims(ClaimStatus.REJECTED));
        stats.setUnreadNotificationCount(notificationMapper.selectCount(Wrappers.<Notification>lambdaQuery()
            .eq(Notification::getReadStatus, 0)));
        return stats;
    }

    private Long countPosts(PostStatus status) {
        return postMapper.selectCount(Wrappers.<com.example.lostfound.module.post.entity.Post>lambdaQuery()
            .eq(com.example.lostfound.module.post.entity.Post::getStatus, status));
    }

    private Long countClaims(ClaimStatus status) {
        return claimMapper.selectCount(Wrappers.<com.example.lostfound.module.claim.entity.Claim>lambdaQuery()
            .eq(com.example.lostfound.module.claim.entity.Claim::getStatus, status));
    }
}
