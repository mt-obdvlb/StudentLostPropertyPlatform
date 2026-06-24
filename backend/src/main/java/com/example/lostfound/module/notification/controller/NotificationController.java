package com.example.lostfound.module.notification.controller;

import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.api.Result;
import com.example.lostfound.module.notification.dto.NotificationDTO;
import com.example.lostfound.module.notification.dto.NotificationQueryRequest;
import com.example.lostfound.module.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Notification API", description = "通知消息")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Operation(summary = "我的通知")
    @GetMapping
    public Result<PageResult<NotificationDTO>> list(@Valid NotificationQueryRequest request) {
        return Result.success(notificationService.pageMyNotifications(request));
    }

    @Operation(summary = "标记通知已读")
    @PostMapping("/{id}/read")
    public Result<Void> read(@PathVariable Long id) {
        notificationService.markRead(id);
        return Result.success();
    }

    @Operation(summary = "全部通知已读")
    @PostMapping("/read-all")
    public Result<Void> readAll() {
        notificationService.markAllRead();
        return Result.success();
    }
}
