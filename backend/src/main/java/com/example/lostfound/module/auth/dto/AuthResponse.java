package com.example.lostfound.module.auth.dto;

import com.example.lostfound.module.user.dto.UserDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录注册响应")
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long expiresIn;
    private UserDTO user;
}
