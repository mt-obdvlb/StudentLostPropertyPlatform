package com.example.lostfound.module.claim.controller;

import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.api.Result;
import com.example.lostfound.module.claim.dto.ClaimCreateRequest;
import com.example.lostfound.module.claim.dto.ClaimDTO;
import com.example.lostfound.module.claim.dto.ClaimQueryRequest;
import com.example.lostfound.module.claim.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Claim API", description = "认领申请")
@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @Operation(summary = "提交认领申请")
    @PostMapping
    public Result<ClaimDTO> create(@Valid @RequestBody ClaimCreateRequest request) {
        return Result.success(claimService.create(request));
    }

    @Operation(summary = "我的认领申请")
    @GetMapping("/my")
    public Result<PageResult<ClaimDTO>> my(@Valid ClaimQueryRequest request) {
        return Result.success(claimService.pageMyClaims(request));
    }

    @Operation(summary = "认领申请详情")
    @GetMapping("/{id}")
    public Result<ClaimDTO> detail(@PathVariable Long id) {
        return Result.success(claimService.getClaim(id));
    }

    @Operation(summary = "取消认领申请")
    @PostMapping("/{id}/cancel")
    public Result<ClaimDTO> cancel(@PathVariable Long id) {
        return Result.success(claimService.cancel(id));
    }
}
