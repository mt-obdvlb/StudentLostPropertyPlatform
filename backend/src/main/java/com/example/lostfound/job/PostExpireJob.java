package com.example.lostfound.job;

import com.example.lostfound.module.post.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PostExpireJob {

    private static final Logger log = LoggerFactory.getLogger(PostExpireJob.class);

    private final PostService postService;

    public PostExpireJob(PostService postService) {
        this.postService = postService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void expirePosts() {
        int updated = postService.expireProcessingPosts();
        log.info("PostExpireJob completed, expired {} posts", updated);
    }
}
