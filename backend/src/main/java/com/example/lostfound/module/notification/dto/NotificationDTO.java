package com.example.lostfound.module.notification.dto;

import com.example.lostfound.module.notification.enums.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "通知信息")
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private NotificationType type;
    private Integer readStatus;
    private LocalDateTime createdAt;
}
