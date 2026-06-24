package com.example.lostfound.module.post.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "重复检测响应")
public class DuplicateCheckResponse {
    private BigDecimal duplicateScore;
    private String level;
    private Boolean duplicate;
    private PostDTO matchedPost;
}
