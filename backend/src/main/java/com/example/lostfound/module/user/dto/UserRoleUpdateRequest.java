package com.example.lostfound.module.user.dto;

import com.example.lostfound.module.user.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "修改用户角色请求")
public class UserRoleUpdateRequest {
    @NotNull
    private UserRole role;
}
