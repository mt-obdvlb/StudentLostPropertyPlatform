# 部署与运行说明

## 当前状态

当前后端已实现可运行的 Spring Boot 服务，包含 REST API、JWT、MySQL、Redis、Swagger、初始化 SQL 和后端 README。

主要交付物：

- `README.md`
- `backend/`
- `backend/README.md`
- `docs/*`
- `sql/schema.sql`
- `sql/data.sql`
- `docker-compose.yml`

## 本地基础服务

使用本机 MySQL 和本机 Redis。确认 `mysqladmin ping` 和 `redis-cli ping` 可用后再启动后端。

## 数据库初始化

进入 MySQL 后执行：

```bash
mysql -h 127.0.0.1 -P 3306 -uroot -p < sql/schema.sql
mysql -h 127.0.0.1 -P 3306 -uroot -p < sql/data.sql
```

后端数据库配置位于：

```text
backend/src/main/resources/application.yml
```

## 端口规划

| 服务 | 地址 |
| --- | --- |
| frontend | `http://localhost:3000` |
| backend | `http://localhost:8080` |
| mysql | `localhost:3306` |
| redis | `localhost:6379` |
| swagger | `http://localhost:8080/swagger-ui/index.html` |

## 启动命令

后端：

```bash
cd backend
JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn -Dmaven.resolver.transport=wagon spring-boot:run
```

前端：

```bash
cd frontend
pnpm install
pnpm dev
```

## 提交材料清单

- 可运行源码。
- 数据库 SQL。
- README。
- 接口文档地址或导出的 OpenAPI 文档。
- 系统功能截图。
- AI 辅助开发说明。
- 测试账号。
