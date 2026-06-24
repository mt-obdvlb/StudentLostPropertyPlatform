package com.example.lostfound.module.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

class SeedPasswordHashTest {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void seedPasswordHashesMatchDocumentedTestAccounts() {
        assertThat(passwordEncoder.matches("admin123456",
            "$2y$10$3qt5StKf8FsU6Gx42BvdieRRTCfN6gtKheO984TPP3FqCMWP/gjOq")).isTrue();
        assertThat(passwordEncoder.matches("user123456",
            "$2y$10$u8niYT5ftOkWYWHXLLzwMe4jYRde5WmsQO3mOvP8n9Fzg4uYOAGEi")).isTrue();
    }
}
