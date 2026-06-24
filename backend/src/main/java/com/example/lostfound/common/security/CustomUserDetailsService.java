package com.example.lostfound.common.security;

import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    public CustomUserDetailsService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.selectOne(
            com.baomidou.mybatisplus.core.toolkit.Wrappers.<User>lambdaQuery()
                .eq(User::getUsername, username)
                .eq(User::getDeleted, 0)
        );
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new LoginUser(user);
    }

    public LoginUser loadUserById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new UsernameNotFoundException(String.valueOf(userId));
        }
        return new LoginUser(user);
    }
}
