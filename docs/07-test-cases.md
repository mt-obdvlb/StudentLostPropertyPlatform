# 测试用例

## 测试账号

| 角色 | username | password |
| --- | --- | --- |
| 管理员 | admin | admin123456 |
| 普通用户 | user1 | user123456 |
| 普通用户 | user2 | user123456 |

## 接口测试用例

| 编号 | 场景 | 前置条件 | 操作 | 期望结果 |
| --- | --- | --- | --- | --- |
| T-AUTH-001 | 用户登录成功 | 初始化账号存在 | `POST /api/auth/login` | 返回 token 和用户信息 |
| T-AUTH-002 | 登录失败 | 密码错误 | `POST /api/auth/login` | 返回认证失败错误 |
| T-POST-001 | 游客查看列表 | 无 | `GET /api/posts` | 返回公开列表 |
| T-POST-002 | 用户发布拾物 | user1 已登录 | `POST /api/posts` type=FOUND | 创建 PROCESSING 物品 |
| T-POST-003 | 发布参数校验 | user1 已登录 | title 为空发布 | 返回参数校验错误 |
| T-POST-004 | 重复检测 | 已存在相似物品 | `POST /api/posts/duplicate-check` | 返回 duplicate warning |
| T-CLAIM-001 | 用户申请认领 | user2 已登录，存在 FOUND + PROCESSING | `POST /api/claims` | 创建 PENDING 申请 |
| T-CLAIM-002 | 不能认领本人发布 | user1 已登录，申请本人拾物 | `POST /api/claims` | 返回业务错误 |
| T-CLAIM-003 | 不能重复申请 | user2 已有申请 | 再次申请同一物品 | 返回业务错误 |
| T-ADMIN-001 | 管理员审核通过 | admin 已登录，存在 PENDING 申请 | approve | claim=APPROVED, post=CLAIMED |
| T-ADMIN-002 | 其他申请自动驳回 | 同一 post 多个 PENDING | approve 其中一个 | 其他 claim=REJECTED |
| T-ADMIN-003 | 普通用户不能审核 | user1 已登录 | approve | 返回 403 |
| T-JOB-001 | 自动过期 | 存在过期 PROCESSING post | 执行定时任务 | post=EXPIRED |

## 前端流程测试

| 编号 | 流程 | 验收点 |
| --- | --- | --- |
| E2E-001 | user1 登录并发布 FOUND | 表单校验、重复提示、发布成功、列表出现 |
| E2E-002 | user2 申请认领 | 详情页按钮可见、Dialog 提交、状态待审核 |
| E2E-003 | admin 审核通过 | 后台可见申请、通过后 Timeline 更新 |
| E2E-004 | 过期物品不可认领 | 过期状态展示、申请按钮禁用 |
| E2E-005 | 游客访问 | 能浏览列表和详情，申请时跳转登录 |

## 质量检查

- TypeScript 禁止 `any`。
- Java Controller 不写复杂业务。
- DTO 与 Entity 分离。
- 所有核心 API 有参数校验。
- 核心状态流转有事务。
- 列表页面有 loading、empty、error 状态。
- README、docs、SQL、测试账号完整。

