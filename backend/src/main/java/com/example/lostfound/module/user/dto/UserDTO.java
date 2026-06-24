package com.example.lostfound.module.user.dto;

import com.example.lostfound.module.user.enums.UserRole;
import com.example.lostfound.module.user.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "用户信息")
public class UserDTO {
    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
