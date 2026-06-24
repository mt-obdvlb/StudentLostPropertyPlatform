package com.example.lostfound.module.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "注册请求")
public class RegisterRequest {
    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,64}$", message = "用户名只能包含字母、数字和下划线，长度 3-64")
    private String username;
    @NotBlank
    @Size(min = 6, max = 72)
    private String password;
    @NotBlank
    @Size(max = 64)
    private String nickname;
    @NotBlank
    @Email
    @Size(max = 128)
    private String email;
    @Size(max = 32)
    private String phone;
}
