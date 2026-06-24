package com.example.lostfound.module.claim.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import com.example.lostfound.module.claim.enums.ClaimStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("claims")
public class Claim {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long postId;
    private Long claimerId;
    private String reason;
    private String proofDescription;
    private ClaimStatus status;
    private String reviewComment;
    private Long reviewerId;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Version
    private Integer version;
    @TableLogic
    private Integer deleted;
}
