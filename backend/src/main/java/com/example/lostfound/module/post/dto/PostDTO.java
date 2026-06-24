package com.example.lostfound.module.post.dto;

import com.example.lostfound.module.post.enums.PostStatus;
import com.example.lostfound.module.post.enums.PostType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Schema(description = "物品信息")
public class PostDTO {
    private Long id;
    private String title;
    private PostType type;
    private String category;
    private String description;
    private String imageUrl;
    private String location;
    private LocalDateTime occurredAt;
    private String contact;
    private PostStatus status;
    private Long ownerId;
    private String ownerName;
    private BigDecimal duplicateScore;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer version;
}
