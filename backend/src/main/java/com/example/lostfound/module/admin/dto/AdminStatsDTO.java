package com.example.lostfound.module.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "后台统计")
public class AdminStatsDTO {
    private Long userCount;
    private Long activeUserCount;
    private Long lostPostCount;
    private Long foundPostCount;
    private Long processingPostCount;
    private Long claimedPostCount;
    private Long expiredPostCount;
    private Long removedPostCount;
    private Long pendingClaimCount;
    private Long approvedClaimCount;
    private Long rejectedClaimCount;
    private Long unreadNotificationCount;
}
