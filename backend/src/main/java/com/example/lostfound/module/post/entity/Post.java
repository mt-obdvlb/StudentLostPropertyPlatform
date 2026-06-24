package com.example.lostfound.module.post.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import com.example.lostfound.module.post.enums.PostStatus;
import com.example.lostfound.module.post.enums.PostType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("posts")
public class Post {

    @TableId(type = IdType.AUTO)
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
    private BigDecimal duplicateScore;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Version
    private Integer version;
    @TableLogic
    private Integer deleted;
}
