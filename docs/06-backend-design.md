# 后端设计

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
│   ├── mapper/
│   └── db/
└── pom.xml
```

## 分层职责

| 层 | 职责 |
| --- | --- |
| Controller | HTTP 入口、参数校验、权限声明、调用 Service |
| Service | 应用流程、事务边界、DTO 转换、组合 Domain Service |
| Domain Service | 核心业务规则和状态流转 |
| Mapper | 数据库访问 |
| Entity | 表结构映射 |
| DTO | 请求和响应模型 |
| Security | JWT、过滤器、鉴权、当前用户 |
| Job | 定时任务 |

## 主要模块

| 模块 | 关键类 |
| --- | --- |
| auth | `AuthController`, `AuthService`, `LoginRequest`, `RegisterRequest`, `AuthResponse` |
| user | `UserController`, `UserService`, `User`, `UserMapper`, `UserDTO`, `UserRole` |
| post | `PostController`, `PostService`, `PostDomainService`, `Post`, `PostMapper` |
| claim | `ClaimController`, `ClaimService`, `ClaimDomainService`, `Claim`, `ClaimMapper` |
| admin | `AdminController`, `AdminService`, `AdminStatsDTO` |
| notification | `NotificationController`, `NotificationService`, `Notification` |
| log | `OperationLogService`, `OperationLogMapper`, `OperationLog` |

## 核心业务规则

### 发布信息

```text
校验登录状态
校验请求参数
执行重复检测
保存 post
返回 post 详情
```

### 重复检测

```text
similarity = titleSimilarity * 0.5
           + descriptionSimilarity * 0.3
           + locationMatch * 0.2
```

- `similarity >= 0.75`: 高度疑似重复。
- `0.45 <= similarity < 0.75`: 可能重复。
- `similarity < 0.45`: 正常。

### 申请认领

```text
校验用户登录
查询 post
校验 post.type == FOUND
校验 post.status == PROCESSING
校验 claimer_id != post.owner_id
校验该用户没有重复申请该 post
加 Redis 锁 claim:post:{postId}:user:{userId}
创建 claim，状态为 PENDING
发送通知给管理员
释放锁
```

### 审核通过

```text
开启事务
查询 claim
查询 post
校验 claim.status == PENDING
校验 post.status == PROCESSING
更新 claim.status = APPROVED
更新 post.status = CLAIMED
拒绝同一个 post 的其他 PENDING 申请
记录 operation_log
发送通知给申请人
提交事务
```

### 自动过期

```text
每小时执行一次
扫描 status = PROCESSING 且 expired_at < now 的 post
批量更新 status = EXPIRED
记录日志
```

## 安全设计

- BCrypt 存储密码哈希。
- JWT 无状态认证。
- 管理端接口要求 `ADMIN` 或 `SUPER_ADMIN`。
- 用户只能编辑和删除自己发布的物品。
- 用户只能查看自己的申请详情，管理员可以查看全部。
- 全局异常处理统一返回错误码。
- CORS 允许 `http://localhost:3000`。

