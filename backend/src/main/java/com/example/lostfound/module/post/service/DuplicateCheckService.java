package com.example.lostfound.module.post.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.example.lostfound.common.util.TextSimilarityUtils;
import com.example.lostfound.module.post.converter.PostConverter;
import com.example.lostfound.module.post.dto.DuplicateCheckRequest;
import com.example.lostfound.module.post.dto.DuplicateCheckResponse;
import com.example.lostfound.module.post.dto.PostDTO;
import com.example.lostfound.module.post.entity.Post;
import com.example.lostfound.module.post.mapper.PostMapper;
import com.example.lostfound.module.user.entity.User;
import com.example.lostfound.module.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class DuplicateCheckService {

    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final PostConverter postConverter;

    public DuplicateCheckService(PostMapper postMapper, UserMapper userMapper, PostConverter postConverter) {
        this.postMapper = postMapper;
        this.userMapper = userMapper;
        this.postConverter = postConverter;
    }

    public DuplicateCheckResponse check(DuplicateCheckRequest request) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Post> candidates = postMapper.selectList(Wrappers.<Post>lambdaQuery()
            .eq(Post::getType, request.getType())
            .eq(Post::getDeleted, 0)
            .ge(Post::getCreatedAt, since));

        return candidates.stream()
            .map(post -> new ScoredPost(post, score(request, post)))
            .max(Comparator.comparing(ScoredPost::score))
            .map(scored -> buildResponse(scored.post(), scored.score()))
            .orElseGet(() -> new DuplicateCheckResponse(BigDecimal.ZERO.setScale(4), "NORMAL", false, null));
    }

    public BigDecimal scoreValue(DuplicateCheckRequest request) {
        return check(request).getDuplicateScore();
    }

    private DuplicateCheckResponse buildResponse(Post post, BigDecimal score) {
        String level;
        boolean duplicate = false;
        if (score.compareTo(BigDecimal.valueOf(0.75)) >= 0) {
            level = "HIGH";
            duplicate = true;
        } else if (score.compareTo(BigDecimal.valueOf(0.45)) >= 0) {
            level = "MEDIUM";
        } else {
            level = "NORMAL";
        }
        return new DuplicateCheckResponse(score, level, duplicate, toDto(post));
    }

    private BigDecimal score(DuplicateCheckRequest request, Post post) {
        double score = TextSimilarityUtils.weightedPostSimilarity(
            request.getTitle(),
            request.getDescription(),
            request.getLocation(),
            post.getTitle(),
            post.getDescription(),
            post.getLocation()
        );
        return BigDecimal.valueOf(score).setScale(4, RoundingMode.HALF_UP);
    }

    private PostDTO toDto(Post post) {
        PostDTO dto = postConverter.toDto(post);
        User owner = userMapper.selectById(post.getOwnerId());
        dto.setOwnerName(owner == null ? null : owner.getNickname());
        return dto;
    }

    private record ScoredPost(Post post, BigDecimal score) {
    }
}
