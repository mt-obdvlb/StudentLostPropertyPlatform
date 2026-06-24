# 校园失物招领管理系统后端

Spring Boot 3 后端服务，提供校园失物招领管理系统的 REST API、JWT 认证、角色权限、失物/拾物发布、认领审核、通知、操作日志、定时过期和 Swagger 文档。

## 技术栈

- Java 17
- Spring Boot 3.x
- Spring Web / Validation / Security
- JWT
- MyBatis-Plus
- MySQL 8
- Redis
- Lombok
- MapStruct
- SpringDoc OpenAPI
- Maven

## 目录结构

```text
backend/
├── src/main/java/com/example/lostfound/
│   ├── LostFoundApplication.java
│   ├── common/
│   │   ├── api/
│   │   ├── exception/
│   │   ├── security/
│   │   ├── config/
│   │   └── util/
│   ├── module/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── post/
│   │   ├── claim/
│   │   ├── admin/
│   │   ├── notification/
│   │   └── log/
│   └── job/
├── src/main/resources/
│   ├── application.yml
│   └── db/
│       ├── schema.sql
│       └── data.sql
├── pom.xml
└── README.md
```

## 数据库初始化

后端主配置文件位于：

```text
backend/src/main/resources/application.yml
```

默认连接本机 MySQL 和 Redis，密码均为 `68562520`。如果你的本机 MySQL / Redis 不想改成这个密码，需要修改 `application.yml` 中的默认值，或启动时用环境变量覆盖：

```bash
MYSQL_PASSWORD="你的 MySQL 密码" REDIS_PASSWORD="你的 Redis 密码" mvn spring-boot:run
```

对应配置项：

```yaml
spring:
  datasource:
    url: ${MYSQL_URL:jdbc:mysql://localhost:3306/lost_found?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false}
    username: ${MYSQL_USERNAME:root}
    password: ${MYSQL_PASSWORD:68562520}
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:68562520}
      database: ${REDIS_DATABASE:0}
```

使用本机 MySQL：

```bash
mysql -uroot -p < /Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/sql/schema.sql
mysql -uroot -p < /Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/sql/data.sql
```

默认数据库名：`lost_found`。后端连接配置位于 `src/main/resources/application.yml`，可用 `MYSQL_URL`、`MYSQL_USERNAME`、`MYSQL_PASSWORD` 覆盖。

## Redis 启动

使用本机 Redis，默认连接：`localhost:6379`。可用 `REDIS_HOST`、`REDIS_PORT`、`REDIS_PASSWORD` 覆盖。

## 后端启动

```bash
cd /Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/backend
JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn spring-boot:run
```

如果 Maven Central TLS 连接失败，可临时使用 wagon 传输：

```bash
JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn -Dmaven.resolver.transport=wagon spring-boot:run
```

## Swagger 地址

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 测试账号

| 角色 | username | password |
| --- | --- | --- |
| 管理员 | admin | admin123456 |
| 普通用户 | user1 | user123456 |
| 普通用户 | user2 | user123456 |

## 核心业务流程

1. 用户注册或登录，后端返回 JWT。
2. 前端请求携带 `Authorization: Bearer <token>`。
3. 用户发布 LOST / FOUND 信息，后端执行基础重复检测并保存 `duplicate_score`。
4. 用户只能对 `FOUND + PROCESSING` 的非本人拾物提交认领申请。
5. 认领申请用 Redis `SETNX` 防止重复点击。
6. 管理员审核通过时使用事务、Redis 锁、乐观锁和状态二次校验。
7. 审核通过后 claim 变为 `APPROVED`，post 变为 `CLAIMED`，同 post 其他 `PENDING` 申请自动 `REJECTED`。
8. 管理员下架 post 时状态变为 `REMOVED` 并写入 `operation_logs`。
9. 定时任务每小时将过期 `PROCESSING` post 更新为 `EXPIRED`。
10. 申请创建和审核结果会写入 `notifications`。

## 常见问题

- 依赖下载失败：优先确认代理或使用 `-Dmaven.resolver.transport=wagon`。
- 数据库连接失败：确认 `lost_found` 已创建，MySQL 端口为 `3306`，账号密码与环境变量一致。
- Redis 连接失败：确认 `redis-cli ping` 返回 `PONG`。
- Swagger 访问 401：确认访问路径是 `/swagger-ui/index.html`，该路径已放行。
- 403：确认登录账号角色为 `ADMIN` 或 `SUPER_ADMIN`。
