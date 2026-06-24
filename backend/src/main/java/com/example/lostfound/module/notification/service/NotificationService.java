package com.example.lostfound.module.notification.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.exception.BusinessException;
import com.example.lostfound.common.exception.ErrorCode;
import com.example.lostfound.common.security.SecurityUtils;
import com.example.lostfound.module.notification.converter.NotificationConverter;
import com.example.lostfound.module.notification.dto.NotificationDTO;
import com.example.lostfound.module.notification.dto.NotificationQueryRequest;
import com.example.lostfound.module.notification.entity.Notification;
import com.example.lostfound.module.notification.enums.NotificationType;
import com.example.lostfound.module.notification.mapper.NotificationMapper;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.enums.UserRole;
import com.example.lostfound.module.user.enums.UserStatus;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationMapper notificationMapper;
    private final NotificationConverter notificationConverter;
    private final UserMapper userMapper;

    public NotificationService(
        NotificationMapper notificationMapper,
        NotificationConverter notificationConverter,
        UserMapper userMapper
    ) {
        this.notificationMapper = notificationMapper;
        this.notificationConverter = notificationConverter;
        this.userMapper = userMapper;
    }

    public void create(Long userId, String title, String content, NotificationType type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setReadStatus(0);
        notification.setCreatedAt(LocalDateTime.now());
        notificationMapper.insert(notification);
    }

    public void notifyAdmins(String title, String content, NotificationType type) {
        List<User> admins = userMapper.selectList(Wrappers.<User>lambdaQuery()
            .eq(User::getStatus, UserStatus.ACTIVE)
            .in(User::getRole, List.of(UserRole.ADMIN, UserRole.SUPER_ADMIN))
            .eq(User::getDeleted, 0));
        admins.forEach(admin -> create(admin.getId(), title, content, type));
    }

    public void notifyUsers(Collection<Long> userIds, String title, String content, NotificationType type) {
        userIds.stream().distinct().forEach(userId -> create(userId, title, content, type));
    }

    public PageResult<NotificationDTO> pageMyNotifications(NotificationQueryRequest request) {
        Long userId = SecurityUtils.currentUserId();
        LambdaQueryWrapper<Notification> wrapper = Wrappers.<Notification>lambdaQuery()
            .eq(Notification::getUserId, userId)
            .eq(request.getReadStatus() != null, Notification::getReadStatus, request.getReadStatus())
            .orderByDesc(Notification::getCreatedAt);
        IPage<Notification> page = notificationMapper.selectPage(Page.of(request.getPage(), request.getPageSize()), wrapper);
        return new PageResult<>(
            page.getRecords().stream().map(notificationConverter::toDto).toList(),
            page.getTotal(),
            request.getPage(),
            request.getPageSize()
        );
    }

    public void markRead(Long id) {
        Long userId = SecurityUtils.currentUserId();
        Notification notification = notificationMapper.selectById(id);
        if (notification == null || !notification.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOTIFICATION_NOT_FOUND);
        }
        notification.setReadStatus(1);
        notificationMapper.updateById(notification);
    }

    public void markAllRead() {
        Long userId = SecurityUtils.currentUserId();
        notificationMapper.update(null, Wrappers.<Notification>lambdaUpdate()
            .eq(Notification::getUserId, userId)
            .eq(Notification::getReadStatus, 0)
            .set(Notification::getReadStatus, 1));
    }

    public Long countUnread(Long userId) {
        return notificationMapper.selectCount(Wrappers.<Notification>lambdaQuery()
            .eq(Notification::getUserId, userId)
            .eq(Notification::getReadStatus, 0));
    }
}
