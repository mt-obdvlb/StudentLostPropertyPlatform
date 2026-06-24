package com.example.lostfound.module.post.converter;

import com.example.lostfound.module.post.dto.PostDTO;
import com.example.lostfound.module.post.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostConverter {
    @Mapping(target = "ownerName", ignore = true)
    PostDTO toDto(Post post);
}
