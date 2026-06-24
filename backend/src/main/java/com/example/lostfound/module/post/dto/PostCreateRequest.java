package com.example.lostfound.module.post.dto;

import com.example.lostfound.module.post.enums.PostType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "发布失物/拾物请求")
public class PostCreateRequest {
    @NotBlank
    @Size(max = 100)
    private String title;
    @NotNull
    private PostType type;
    @NotBlank
    @Size(max = 64)
    private String category;
    @NotBlank
    @Size(max = 3000)
    private String description;
    @Size(max = 15_000_000, message = "图片数据过大，请压缩后上传（最大 15MB）")
    private String imageUrl;
    @NotBlank
    @Size(max = 128)
    private String location;
    @NotNull
    private LocalDateTime occurredAt;
    @Size(max = 128)
    @NotBlank
    private String contact;
    private LocalDateTime expiredAt;
    private Boolean confirmDuplicate = false;
}
