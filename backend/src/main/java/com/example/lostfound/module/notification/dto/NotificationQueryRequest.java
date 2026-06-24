package com.example.lostfound.module.notification.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "通知查询参数")
public class NotificationQueryRequest {
    private Integer readStatus;
    @Min(1)
    private Long page = 1L;
    @Min(1)
    @Max(100)
    private Long pageSize = 10L;
}
