package com.example.lostfound.module.user.converter;

import com.example.lostfound.module.user.dto.UserDTO;
import com.example.lostfound.module.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserConverter {
    UserDTO toDto(User user);
}
