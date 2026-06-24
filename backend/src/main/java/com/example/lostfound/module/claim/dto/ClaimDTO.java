package com.example.lostfound.module.claim.dto;

import com.example.lostfound.module.claim.enums.ClaimStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "认领申请信息")
public class ClaimDTO {
    private Long id;
    private Long postId;
    private String postTitle;
    private Long claimerId;
    private String claimerName;
    private String reason;
    private String proofDescription;
    private ClaimStatus status;
    private String reviewComment;
    private Long reviewerId;
    private String reviewerName;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer version;
}
