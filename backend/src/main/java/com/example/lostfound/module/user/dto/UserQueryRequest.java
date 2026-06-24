package com.example.lostfound.module.user.dto;

import com.example.lostfound.module.user.enums.UserRole;
import com.example.lostfound.module.user.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "用户查询参数")
public class UserQueryRequest {
    private String keyword;
    private UserRole role;
    private UserStatus status;
    @Min(1)
    private Long page = 1L;
    @Min(1)
    @Max(100)
    private Long pageSize = 10L;
}
