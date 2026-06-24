package com.example.lostfound.module.admin.controller;

import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.api.Result;
import com.example.lostfound.module.admin.dto.AdminStatsDTO;
import com.example.lostfound.module.admin.service.AdminService;
import com.example.lostfound.module.claim.dto.ClaimDTO;
import com.example.lostfound.module.claim.dto.ClaimQueryRequest;
import com.example.lostfound.module.claim.dto.ClaimReviewRequest;
import com.example.lostfound.module.claim.service.ClaimService;
import com.example.lostfound.module.post.dto.PostDTO;
import com.example.lostfound.module.post.dto.PostQueryRequest;
import com.example.lostfound.module.post.dto.RemovePostRequest;
import com.example.lostfound.module.post.service.PostService;
import com.example.lostfound.module.user.dto.UserDTO;
import com.example.lostfound.module.user.dto.UserQueryRequest;
import com.example.lostfound.module.user.dto.UserRoleUpdateRequest;
import com.example.lostfound.module.user.dto.UserStatusUpdateRequest;
import com.example.lostfound.module.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin API", description = "管理员后台")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final PostService postService;
    private final ClaimService claimService;
    private final UserService userService;

    public AdminController(
        AdminService adminService,
        PostService postService,
        ClaimService claimService,
        UserService userService
    ) {
        this.adminService = adminService;
        this.postService = postService;
        this.claimService = claimService;
        this.userService = userService;
    }

    @Operation(summary = "管理员统计")
    @GetMapping("/stats")
    public Result<AdminStatsDTO> stats() {
        return Result.success(adminService.stats());
    }

    @Operation(summary = "全部物品列表")
    @GetMapping("/posts")
    public Result<PageResult<PostDTO>> posts(@Valid PostQueryRequest request) {
        return Result.success(postService.pagePosts(request, true));
    }

    @Operation(summary = "全部认领申请")
    @GetMapping("/claims")
    public Result<PageResult<ClaimDTO>> claims(@Valid ClaimQueryRequest request) {
        return Result.success(claimService.pageAdminClaims(request));
    }

    @Operation(summary = "审核通过认领申请")
    @PostMapping("/claims/{id}/approve")
    public Result<ClaimDTO> approve(@PathVariable Long id, @Valid @RequestBody ClaimReviewRequest request) {
        return Result.success(claimService.approve(id, request));
    }

    @Operation(summary = "审核驳回认领申请")
    @PostMapping("/claims/{id}/reject")
    public Result<ClaimDTO> reject(@PathVariable Long id, @Valid @RequestBody ClaimReviewRequest request) {
        return Result.success(claimService.reject(id, request));
    }

    @Operation(summary = "管理员下架物品")
    @PostMapping("/posts/{id}/remove")
    public Result<Void> removePost(@PathVariable Long id, @Valid @RequestBody RemovePostRequest request) {
        postService.remove(id, request);
        return Result.success();
    }

    @Operation(summary = "用户列表")
    @GetMapping("/users")
    public Result<PageResult<UserDTO>> users(@Valid UserQueryRequest request) {
        return Result.success(userService.pageUsers(request));
    }

    @Operation(summary = "修改用户角色")
    @PutMapping("/users/{id}/role")
    public Result<UserDTO> updateRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateRequest request) {
        return Result.success(userService.updateRole(id, request.getRole()));
    }

    @Operation(summary = "修改用户状态")
    @PutMapping("/users/{id}/status")
    public Result<UserDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody UserStatusUpdateRequest request) {
        return Result.success(userService.updateStatus(id, request.getStatus()));
    }
}
