package com.example.lostfound.common.util;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Objects;
import java.util.UUID;

@Component
public class RedisLockHelper {

    private final StringRedisTemplate redisTemplate;

    public RedisLockHelper(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String tryLock(String key, Duration ttl) {
        String token = UUID.randomUUID().toString();
        Boolean locked = redisTemplate.opsForValue().setIfAbsent(key, token, ttl);
        return Boolean.TRUE.equals(locked) ? token : null;
    }

    public void unlock(String key, String token) {
        if (token == null) {
            return;
        }
        String current = redisTemplate.opsForValue().get(key);
        if (Objects.equals(current, token)) {
            redisTemplate.delete(key);
        }
    }
}
