package com.example.lostfound.module.auth.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.example.lostfound.common.exception.BusinessException;
import com.example.lostfound.common.exception.ErrorCode;
import com.example.lostfound.common.security.JwtTokenProvider;
import com.example.lostfound.common.security.LoginUser;
import com.example.lostfound.module.auth.dto.AuthResponse;
import com.example.lostfound.module.auth.dto.LoginRequest;
import com.example.lostfound.module.auth.dto.RegisterRequest;
import com.example.lostfound.module.user.converter.UserConverter;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.enums.UserRole;
import com.example.lostfound.module.user.enums.UserStatus;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserMapper userMapper;
    private final UserConverter userConverter;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
        UserMapper userMapper,
        UserConverter userConverter,
        PasswordEncoder passwordEncoder,
        JwtTokenProvider jwtTokenProvider
    ) {
        this.userMapper = userMapper;
        this.userConverter = userConverter;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorCode.USERNAME_EXISTS);
        }
        if (existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_EXISTS);
        }
        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user.setDeleted(0);
        userMapper.insert(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userMapper.selectOne(Wrappers.<User>lambdaQuery()
            .eq(User::getUsername, request.getUsername())
            .eq(User::getDeleted, 0));
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (user.getStatus() == UserStatus.DISABLED) {
            throw new BusinessException(ErrorCode.USER_DISABLED);
        }
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        LoginUser loginUser = new LoginUser(user);
        String token = jwtTokenProvider.generateToken(loginUser);
        return new AuthResponse(token, "Bearer", jwtTokenProvider.getExpirationMillis() / 1000, userConverter.toDto(user));
    }

    private boolean existsByUsername(String username) {
        return userMapper.selectCount(Wrappers.<User>lambdaQuery()
            .eq(User::getUsername, username)
            .eq(User::getDeleted, 0)) > 0;
    }

    private boolean existsByEmail(String email) {
        return userMapper.selectCount(Wrappers.<User>lambdaQuery()
            .eq(User::getEmail, email)
            .eq(User::getDeleted, 0)) > 0;
    }
}
