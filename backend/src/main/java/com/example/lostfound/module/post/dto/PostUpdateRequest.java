package com.example.lostfound.module.post.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "更新物品信息请求")
public class PostUpdateRequest {
    @Size(max = 100)
    private String title;
    @Size(max = 64)
    private String category;
    @Size(max = 3000)
    private String description;
    @Size(max = 15_000_000, message = "图片数据过大，请压缩后上传（最大 15MB）")
    private String imageUrl;
    @Size(max = 128)
    private String location;
    private LocalDateTime occurredAt;
    @Size(max = 128)
    private String contact;
    private LocalDateTime expiredAt;
}
