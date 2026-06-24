package com.example.lostfound.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI lostFoundOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("校园失物招领管理系统 API")
                .description("Spring Boot 后端 REST API")
                .version("1.0.0"))
            .schemaRequirement("BearerAuth", new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT"))
            .addSecurityItem(new SecurityRequirement().addList("BearerAuth"));
    }
}
