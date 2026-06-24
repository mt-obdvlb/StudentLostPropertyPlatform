package com.example.lostfound.module.claim.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "认领申请请求")
public class ClaimCreateRequest {
    @NotNull
    private Long postId;
    @NotBlank
    @Size(max = 512)
    private String reason;
    @NotBlank
    @Size(max = 1000)
    private String proofDescription;
}
