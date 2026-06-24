# 测试用例

## 自动化验证

```bash
cd /Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/backend
JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn -Dmaven.resolver.transport=wagon test
```

当前自动化测试覆盖：

- 中文短文本相似度归一化和加权分数。
- 初始化账号 BCrypt hash 与文档明文账号匹配。

## 手动接口验收

1. 登录管理员：

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123456"}'
```

2. 登录普通用户：

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"user1","password":"user123456"}'
```

3. 公开查询 post：

```bash
curl -s 'http://localhost:8080/api/posts?page=1&pageSize=10'
```

4. 发布 FOUND 信息：使用普通用户 JWT 请求 `POST /api/posts`。

5. 重复检测：使用普通用户 JWT 请求 `POST /api/posts/duplicate-check`，相似数据应返回 `HIGH` 或 `MEDIUM`。

6. 提交认领：使用另一个普通用户 JWT 请求 `POST /api/claims`，只能认领 `FOUND + PROCESSING` 且不能认领自己发布的 post。

7. 审核通过：使用管理员 JWT 请求 `POST /api/admin/claims/{id}/approve`，验证 claim 变 `APPROVED`，post 变 `CLAIMED`，其他 pending claim 变 `REJECTED`。

8. 管理员下架：使用管理员 JWT 请求 `POST /api/admin/posts/{id}/remove`，验证 post 状态为 `REMOVED` 且写入 operation log。

9. 通知：用户请求 `GET /api/notifications`，审核结果应有通知记录。

10. 过期任务：初始化数据中有过期 PROCESSING post；等待整点任务或临时调用 `PostService.expireProcessingPosts()` 后应变为 `EXPIRED`。
