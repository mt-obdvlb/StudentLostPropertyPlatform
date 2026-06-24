package com.example.lostfound.module.claim.converter;

import com.example.lostfound.module.claim.dto.ClaimDTO;
import com.example.lostfound.module.claim.entity.Claim;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClaimConverter {
    @Mapping(target = "postTitle", ignore = true)
    @Mapping(target = "claimerName", ignore = true)
    @Mapping(target = "reviewerName", ignore = true)
    ClaimDTO toDto(Claim claim);
}
