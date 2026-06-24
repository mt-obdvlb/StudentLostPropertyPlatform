package com.example.lostfound.module.claim.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "审核认领申请请求")
public class ClaimReviewRequest {
    @Size(max = 512)
    private String reviewComment;
}
