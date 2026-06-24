package com.example.lostfound;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@MapperScan({
        "com.example.lostfound.module.user.mapper",
        "com.example.lostfound.module.post.mapper",
        "com.example.lostfound.module.claim.mapper",
        "com.example.lostfound.module.notification.mapper",
        "com.example.lostfound.module.log.mapper"
})
public class LostFoundApplication {

    public static void main(String[] args) {
        SpringApplication.run(LostFoundApplication.class, args);
    }
}
