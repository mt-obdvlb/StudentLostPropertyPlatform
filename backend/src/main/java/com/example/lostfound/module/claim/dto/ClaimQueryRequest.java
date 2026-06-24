package com.example.lostfound.module.claim.dto;

import com.example.lostfound.module.claim.enums.ClaimStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "认领申请查询参数")
public class ClaimQueryRequest {
    private ClaimStatus status;
    private Long postId;
    @Min(1)
    private Long page = 1L;
    @Min(1)
    @Max(100)
    private Long pageSize = 10L;
}
