# 数据库设计

数据库：MySQL 8，默认库名 `lost_found`。

## 表清单

| 表 | 说明 |
| --- | --- |
| `users` | 用户、密码哈希、角色、状态 |
| `posts` | LOST / FOUND 信息 |
| `claims` | 认领申请和审核结果 |
| `notifications` | 用户通知 |
| `operation_logs` | 管理员操作日志 |

## 关键约束

- `users.username` 唯一，索引名 `idx_user_username`。
- `users.email` 唯一，索引名 `idx_user_email`。
- `posts.deleted`、`claims.deleted` 支持逻辑删除。
- `posts.version`、`claims.version` 支持乐观锁。
- 同一用户对同一 post 只能保留一条未删除 claim。
- `claims.reviewer_id` 关联审核管理员。

## 指定索引

| 索引 | 表 | 字段 |
| --- | --- | --- |
| `idx_post_type_status_created_at` | `posts` | `type, status, created_at` |
| `idx_post_owner_id` | `posts` | `owner_id` |
| `idx_post_expired_at_status` | `posts` | `expired_at, status` |
| `idx_claim_post_id_status` | `claims` | `post_id, status` |
| `idx_claim_claimer_id` | `claims` | `claimer_id` |
| `idx_user_username` | `users` | `username` |
| `idx_user_email` | `users` | `email` |
| `idx_notification_user_read` | `notifications` | `user_id, read_status` |
| `idx_operation_operator_created` | `operation_logs` | `operator_id, created_at` |

## SQL 文件

- 根目录初始化：`/Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/sql/schema.sql`
- 根目录数据：`/Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/sql/data.sql`
- 后端资源副本：`/Users/mtobdvlb/Desktop/Code/Project/StudentLostPropertyPlatform/backend/src/main/resources/db/`
