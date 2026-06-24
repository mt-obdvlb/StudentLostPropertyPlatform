# REST API 设计

所有接口返回：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

分页数据：

```json
{
  "records": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

## Auth API

| Method | Path | 权限 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | 注册 |
| POST | `/api/auth/login` | Public | 登录并返回 JWT |
| GET | `/api/auth/me` | USER | 当前用户 |
| POST | `/api/auth/logout` | USER | 无状态登出 |

## Post API

| Method | Path | 权限 | 说明 |
| --- | --- | --- | --- |
| GET | `/api/posts` | Public | 公开列表，默认不返回 REMOVED |
| GET | `/api/posts/{id}` | Public | 详情，返回 ownerName |
| POST | `/api/posts` | USER | 发布 |
| PUT | `/api/posts/{id}` | USER | 更新本人发布 |
| DELETE | `/api/posts/{id}` | USER | 删除本人发布 |
| POST | `/api/posts/duplicate-check` | USER | 重复检测 |
| POST | `/api/posts/{id}/remove` | ADMIN | 下架 |

## Claim API

| Method | Path | 权限 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/claims` | USER | 提交认领申请 |
| GET | `/api/claims/my` | USER | 我的申请 |
| GET | `/api/claims/{id}` | USER | 申请详情 |
| POST | `/api/claims/{id}/cancel` | USER | 取消 PENDING 申请 |

## Admin API

| Method | Path | 权限 | 说明 |
| --- | --- | --- | --- |
| GET | `/api/admin/stats` | ADMIN | 后台统计 |
| GET | `/api/admin/posts` | ADMIN | 全部物品 |
| GET | `/api/admin/claims` | ADMIN | 全部申请 |
| POST | `/api/admin/claims/{id}/approve` | ADMIN | 审核通过 |
| POST | `/api/admin/claims/{id}/reject` | ADMIN | 审核驳回 |
| POST | `/api/admin/posts/{id}/remove` | ADMIN | 下架物品 |
| GET | `/api/admin/users` | ADMIN | 用户列表 |
| PUT | `/api/admin/users/{id}/role` | SUPER_ADMIN | 修改角色 |
| PUT | `/api/admin/users/{id}/status` | ADMIN | 修改状态 |

## Notification API

| Method | Path | 权限 | 说明 |
| --- | --- | --- | --- |
| GET | `/api/notifications` | USER | 我的通知 |
| POST | `/api/notifications/{id}/read` | USER | 标记已读 |
| POST | `/api/notifications/read-all` | USER | 全部已读 |
