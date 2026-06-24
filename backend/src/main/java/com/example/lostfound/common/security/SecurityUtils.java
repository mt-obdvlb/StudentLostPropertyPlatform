package com.example.lostfound.common.security;

import com.example.lostfound.common.exception.BusinessException;
import com.example.lostfound.common.exception.ErrorCode;
import com.example.lostfound.module.user.enums.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static LoginUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof LoginUser loginUser)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return loginUser;
    }

    public static Long currentUserId() {
        return currentUser().getId();
    }

    public static boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof LoginUser loginUser)) {
            return false;
        }
        UserRole role = loginUser.getUser().getRole();
        return role == UserRole.ADMIN || role == UserRole.SUPER_ADMIN;
    }

    public static boolean isSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
            && authentication.getPrincipal() instanceof LoginUser loginUser
            && loginUser.getUser().getRole() == UserRole.SUPER_ADMIN;
    }
}
