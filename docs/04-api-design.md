# 接口设计

## 统一返回

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 分页返回

```json
{
  "records": [],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

## Auth API

| Method | Path | Auth | Description | Request DTO | Response DTO |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | 注册 | `RegisterRequest` | `AuthResponse` |
| POST | `/api/auth/login` | Public | 登录 | `LoginRequest` | `AuthResponse` |
| GET | `/api/auth/me` | USER | 当前用户 | - | `UserDTO` |
| POST | `/api/auth/logout` | USER | 登出 | - | `Void` |

## Post API

| Method | Path | Auth | Description | Request DTO | Response DTO |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/posts` | Public | 公开列表 | `PostQueryRequest` | `PageResult<PostDTO>` |
| GET | `/api/posts/{id}` | Public | 详情 | - | `PostDTO` |
| POST | `/api/posts` | USER | 发布 | `PostCreateRequest` | `PostDTO` |
| PUT | `/api/posts/{id}` | USER | 更新本人发布 | `PostUpdateRequest` | `PostDTO` |
| DELETE | `/api/posts/{id}` | USER | 删除本人发布 | - | `Void` |
| POST | `/api/posts/duplicate-check` | USER | 重复检测 | `PostCreateRequest` | `DuplicateCheckResponse` |
| POST | `/api/posts/{id}/remove` | ADMIN | 下架 | `RemovePostRequest` | `Void` |

查询参数：

| 参数 | 说明 |
| --- | --- |
| `keyword` | 标题和描述关键词 |
| `type` | LOST / FOUND |
| `status` | PROCESSING / CLAIMED / EXPIRED |
| `location` | 地点 |
| `page` | 页码 |
| `pageSize` | 每页数量 |
| `sortBy` | `createdAtDesc`, `expiredAtAsc`, `updatedAtDesc` |

## Claim API

| Method | Path | Auth | Description | Request DTO | Response DTO |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/claims` | USER | 提交认领申请 | `ClaimCreateRequest` | `ClaimDTO` |
| GET | `/api/claims/my` | USER | 我的申请 | `ClaimQueryRequest` | `PageResult<ClaimDTO>` |
| GET | `/api/claims/{id}` | USER | 申请详情 | - | `ClaimDTO` |
| POST | `/api/claims/{id}/cancel` | USER | 取消申请 | - | `ClaimDTO` |

## Admin API

| Method | Path | Auth | Description | Request DTO | Response DTO |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/admin/stats` | ADMIN | 后台统计 | - | `AdminStatsDTO` |
| GET | `/api/admin/posts` | ADMIN | 全部物品 | `PostQueryRequest` | `PageResult<PostDTO>` |
| GET | `/api/admin/claims` | ADMIN | 全部申请 | `ClaimQueryRequest` | `PageResult<ClaimDTO>` |
| POST | `/api/admin/claims/{id}/approve` | ADMIN | 审核通过 | `ClaimReviewRequest` | `ClaimDTO` |
| POST | `/api/admin/claims/{id}/reject` | ADMIN | 审核驳回 | `ClaimReviewRequest` | `ClaimDTO` |
| POST | `/api/admin/posts/{id}/remove` | ADMIN | 下架物品 | `RemovePostRequest` | `Void` |
| GET | `/api/admin/users` | ADMIN | 用户列表 | `UserQueryRequest` | `PageResult<UserDTO>` |
| PUT | `/api/admin/users/{id}/role` | ADMIN | 修改角色 | `UserRoleUpdateRequest` | `UserDTO` |

## Notification API

| Method | Path | Auth | Description | Request DTO | Response DTO |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/notifications` | USER | 通知列表 | `NotificationQueryRequest` | `PageResult<NotificationDTO>` |
| POST | `/api/notifications/{id}/read` | USER | 标记已读 | - | `Void` |
| POST | `/api/notifications/read-all` | USER | 全部已读 | - | `Void` |

## 关键 DTO

`PostCreateRequest`：

- `title`
- `type`
- `category`
- `description`
- `imageUrl`
- `location`
- `occurredAt`
- `expiredAt`
- `contact`
- `confirmDuplicate`

`ClaimCreateRequest`：

- `postId`
- `reason`
- `proofDescription`

`ClaimReviewRequest`：

- `reviewComment`

