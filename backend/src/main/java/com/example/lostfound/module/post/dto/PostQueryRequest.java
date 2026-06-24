package com.example.lostfound.module.post.dto;

import com.example.lostfound.module.post.enums.PostStatus;
import com.example.lostfound.module.post.enums.PostType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "物品查询参数")
public class PostQueryRequest {
    @Size(max = 100)
    private String keyword;
    private PostType type;
    private PostStatus status;
    @Size(max = 128)
    private String location;
    @Min(1)
    private Long page = 1L;
    @Min(1)
    @Max(100)
    private Long pageSize = 10L;
    private String sortBy = "createdAtDesc";
}
