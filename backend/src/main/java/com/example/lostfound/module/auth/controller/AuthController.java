package com.example.lostfound.module.auth.controller;

import com.example.lostfound.common.api.Result;
import com.example.lostfound.module.auth.dto.AuthResponse;
import com.example.lostfound.module.auth.dto.LoginRequest;
import com.example.lostfound.module.auth.dto.RegisterRequest;
import com.example.lostfound.module.auth.service.AuthService;
import com.example.lostfound.module.user.dto.UserDTO;
import com.example.lostfound.module.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth API", description = "注册、登录和当前用户")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return Result.success(authService.register(request));
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(authService.login(request));
    }

    @Operation(summary = "获取当前用户")
    @GetMapping("/me")
    public Result<UserDTO> me() {
        return Result.success(userService.currentUser());
    }

    @Operation(summary = "退出登录")
    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
