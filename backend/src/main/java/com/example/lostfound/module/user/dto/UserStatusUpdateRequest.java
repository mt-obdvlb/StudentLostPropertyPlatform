package com.example.lostfound.module.user.dto;

import com.example.lostfound.module.user.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "修改用户状态请求")
public class UserStatusUpdateRequest {
    @NotNull
    private UserStatus status;
}
