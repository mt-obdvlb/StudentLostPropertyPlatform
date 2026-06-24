package com.example.lostfound.module.post.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "下架物品请求")
public class RemovePostRequest {
    @Size(max = 512)
    private String reason;
}
