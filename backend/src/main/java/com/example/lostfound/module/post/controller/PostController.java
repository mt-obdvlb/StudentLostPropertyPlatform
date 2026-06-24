package com.example.lostfound.module.post.controller;

import com.example.lostfound.common.api.PageResult;
import com.example.lostfound.common.api.Result;
import com.example.lostfound.module.post.dto.DuplicateCheckRequest;
import com.example.lostfound.module.post.dto.DuplicateCheckResponse;
import com.example.lostfound.module.post.dto.PostCreateRequest;
import com.example.lostfound.module.post.dto.PostDTO;
import com.example.lostfound.module.post.dto.PostQueryRequest;
import com.example.lostfound.module.post.dto.PostUpdateRequest;
import com.example.lostfound.module.post.dto.RemovePostRequest;
import com.example.lostfound.module.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Post API", description = "失物/拾物信息")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @Operation(summary = "公开物品列表")
    @GetMapping
    public Result<PageResult<PostDTO>> list(@Valid PostQueryRequest request) {
        return Result.success(postService.pagePosts(request, false));
    }

    @Operation(summary = "物品详情")
    @GetMapping("/{id}")
    public Result<PostDTO> detail(@PathVariable Long id) {
        return Result.success(postService.getPost(id));
    }

    @Operation(summary = "发布物品")
    @PostMapping
    public Result<PostDTO> create(@Valid @RequestBody PostCreateRequest request) {
        return Result.success(postService.create(request));
    }

    @Operation(summary = "更新本人发布物品")
    @PutMapping("/{id}")
    public Result<PostDTO> update(@PathVariable Long id, @Valid @RequestBody PostUpdateRequest request) {
        return Result.success(postService.update(id, request));
    }

    @Operation(summary = "删除本人发布物品")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return Result.success();
    }

    @Operation(summary = "重复发布检测")
    @PostMapping("/duplicate-check")
    public Result<DuplicateCheckResponse> duplicateCheck(@Valid @RequestBody DuplicateCheckRequest request) {
        return Result.success(postService.duplicateCheck(request));
    }

    @Operation(summary = "管理员下架物品")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PostMapping("/{id}/remove")
    public Result<Void> remove(@PathVariable Long id, @Valid @RequestBody RemovePostRequest request) {
        postService.remove(id, request);
        return Result.success();
    }
}
