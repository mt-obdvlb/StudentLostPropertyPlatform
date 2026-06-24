package com.example.lostfound.module.notification.converter;

import com.example.lostfound.module.notification.dto.NotificationDTO;
import com.example.lostfound.module.notification.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationConverter {
    NotificationDTO toDto(Notification notification);
}
