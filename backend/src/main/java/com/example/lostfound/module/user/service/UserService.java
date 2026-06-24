package com.example.lostfound.module.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.exception.BusinessException;
import com.example.lostfound.common.exception.ErrorCode;
import com.example.lostfound.common.security.SecurityUtils;
import com.example.lostfound.module.log.service.OperationLogService;
import com.example.lostfound.module.user.converter.UserConverter;
import com.example.lostfound.module.user.dto.UserDTO;
import com.example.lostfound.module.user.dto.UserQueryRequest;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.enums.UserRole;
import com.example.lostfound.module.user.enums.UserStatus;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final UserConverter userConverter;
    private final OperationLogService operationLogService;

    public UserService(UserMapper userMapper, UserConverter userConverter, OperationLogService operationLogService) {
        this.userMapper = userMapper;
        this.userConverter = userConverter;
        this.operationLogService = operationLogService;
    }

    public User getRequired(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "用户不存在");
        }
        return user;
    }

    public UserDTO currentUser() {
        return userConverter.toDto(getRequired(SecurityUtils.currentUserId()));
    }

    public PageResult<UserDTO> pageUsers(UserQueryRequest request) {
        LambdaQueryWrapper<User> wrapper = Wrappers.<User>lambdaQuery()
            .eq(User::getDeleted, 0)
            .eq(request.getRole() != null, User::getRole, request.getRole())
            .eq(request.getStatus() != null, User::getStatus, request.getStatus())
            .and(StringUtils.hasText(request.getKeyword()), query -> query
                .like(User::getUsername, request.getKeyword())
                .or()
                .like(User::getNickname, request.getKeyword())
                .or()
                .like(User::getEmail, request.getKeyword()))
            .orderByDesc(User::getCreatedAt);
        IPage<User> page = userMapper.selectPage(Page.of(request.getPage(), request.getPageSize()), wrapper);
        return new PageResult<>(
            page.getRecords().stream().map(userConverter::toDto).toList(),
            page.getTotal(),
            request.getPage(),
            request.getPageSize()
        );
    }

    public UserDTO updateRole(Long userId, UserRole role) {
        if (!SecurityUtils.isSuperAdmin()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有超级管理员可以修改用户角色");
        }
        User user = getRequired(userId);
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);
        operationLogService.log(SecurityUtils.currentUserId(), "UPDATE_USER_ROLE", "USER", userId, "role=" + role);
        return userConverter.toDto(user);
    }

    public UserDTO updateStatus(Long userId, UserStatus status) {
        User user = getRequired(userId);
        user.setStatus(status);
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);
        operationLogService.log(SecurityUtils.currentUserId(), "UPDATE_USER_STATUS", "USER", userId, "status=" + status);
        return userConverter.toDto(user);
    }
}
