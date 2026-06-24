package com.example.lostfound.module.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "登录请求")
public class LoginRequest {
    @NotBlank
    @Size(max = 64)
    private String username;
    @NotBlank
    @Size(min = 6, max = 72)
    private String password;
}
