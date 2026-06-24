# 后端架构设计

## 总体架构

后端采用 Spring Boot 3 分层架构：

- Controller：HTTP 参数校验、权限注解、统一响应。
- Service：应用流程、事务边界、DTO 转换。
- Domain 逻辑：重复检测、认领申请、审核状态流转、过期任务。
- Mapper：MyBatis-Plus 数据访问。
- Security：JWT 认证、角色鉴权、CORS、无状态会话。
- Job：Spring Scheduler 自动过期任务。

## 模块拆分

| 模块 | 职责 |
| --- | --- |
| `auth` | 注册、登录、JWT 返回、当前用户 |
| `user` | 用户 DTO、角色、状态、管理员用户管理 |
| `post` | LOST/FOUND 发布、列表、详情、重复检测、下架 |
| `claim` | 认领申请、取消、审核通过、审核驳回 |
| `admin` | 后台统计和聚合管理接口 |
| `notification` | 用户通知、已读状态 |
| `log` | 管理员操作日志 |
| `job` | 每小时自动过期 post |

## 权限设计

- Public：注册、登录、公开 post 列表和详情、Swagger。
- USER：发布/更新/删除本人 post、重复检测、提交/取消/查看本人 claim、通知。
- ADMIN：后台统计、全部 post、全部 claim、审核、下架、用户状态管理。
- SUPER_ADMIN：额外允许修改用户角色。

## 状态机

Post：

```text
PROCESSING -> CLAIMED  管理员通过认领申请
PROCESSING -> EXPIRED  定时任务扫描过期
PROCESSING -> REMOVED  管理员下架
```

Claim：

```text
PENDING -> APPROVED   管理员通过
PENDING -> REJECTED   管理员驳回或同物品其他申请通过
PENDING -> CANCELLED  用户取消
```

## 并发控制

- 用户申请认领：Redis lock `claim:post:{postId}:user:{userId}`。
- 管理员审核：Redis lock `review:post:{postId}`。
- 数据库事务：审核通过同时更新 claim、post、其他 pending claims、通知和日志。
- 乐观锁：`posts.version`、`claims.version`。
- 状态二次校验：审核时重新读取 claim/post 并确认 `PENDING + PROCESSING`。
