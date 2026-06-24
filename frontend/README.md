# 校园失物招领管理系统 · 前端

Web 应用开发课程期末项目 —— 校园失物招领管理系统的前端实现。

技术栈：Next.js 16 (App Router) + React 19 + TypeScript 5.9 + Tailwind CSS 4 + shadcn/ui (base-nova) + Framer Motion + TanStack Query + Zustand + React Hook Form + Zod + Axios。

## 目录

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router 路由
│   │   ├── (app)/                # 受保护路由组（需登录）
│   │   │   ├── layout.tsx        # AppShell + AuthSync
│   │   │   ├── page.tsx          # 首页 Dashboard
│   │   │   ├── posts/            # 列表 / 发布 / 详情
│   │   │   ├── claims/           # 我的认领
│   │   │   └── admin/            # 管理员后台
│   │   ├── (auth)/               # 登录 / 注册
│   │   ├── layout.tsx            # 根 layout
│   │   ├── page.tsx              # 占位（自动跳转 /login）
│   │   └── globals.css           # Tailwind 主题
│   ├── components/
│   │   ├── layout/               # AppShell / Sidebar / Header / AuthSync
│   │   ├── posts/                # PostCard / PostForm / PostDetail 等
│   │   ├── claims/               # ClaimDialog / ClaimTable / Timeline 等
│   │   ├── admin/                # AdminGuard / 统计 / 审核
│   │   ├── home/                 # DashboardHome
│   │   └── common/               # FilterBar / Pagination / DataTable 等
│   └── lib/
│       ├── api/                  # axios 实例 + 各资源 API 模块
│       ├── hooks/                # TanStack Query 封装
│       ├── store/                # Zustand auth-store
│       ├── types/                # 全部领域类型
│       └── utils/                # cn / format
├── components.json               # shadcn/ui 配置
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 环境要求

- Node.js 20+
- pnpm 10+
- 后端服务（Spring Boot，默认 `http://localhost:8080/api`）

## 安装

```bash
cd frontend
pnpm install
```

## 环境变量

复制 `.env.example` 为 `.env.local` 并按需修改：

```bash
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

若后端部署在其他地址，修改 `NEXT_PUBLIC_API_BASE_URL` 即可，所有请求会走该 baseURL。

## 启动开发服务器

```bash
pnpm dev
# http://localhost:3000
```

未登录访问受保护路由会自动跳转 `/login?from=...`，登录成功后回跳原页面。

## 类型检查 / Lint

```bash
pnpm exec tsc --noEmit   # 严格模式，无 any
pnpm lint                # 0 errors（少量 RHF watch 提示性 warning 可忽略）
```

## 测试账号

后端就绪后可用以下账号登录（密码由后端种子数据决定，默认约定如下）：

| 角色         | 用户名  | 密码         |
| ------------ | ------- | ------------ |
| 管理员       | admin   | admin123456  |
| 普通用户 1   | user1   | user123456   |
| 普通用户 2   | user2   | user123456   |

> 若后端种子账号不一致，请以后端 `README` 为准。

## 路由清单

| 路径              | 说明                   | 权限       |
| ----------------- | ---------------------- | ---------- |
| `/login`          | 登录                   | 公开       |
| `/register`       | 注册                   | 公开       |
| `/`               | 首页 Dashboard         | 登录       |
| `/posts`          | 失物 / 拾物列表        | 登录       |
| `/posts/create`   | 发布信息               | 登录       |
| `/posts/[id]`     | 物品详情 + 申请认领    | 登录       |
| `/claims`         | 我的认领申请           | 登录       |
| `/admin`          | 管理员控制台           | ADMIN      |
| `/admin/posts`    | 物品管理（下架）       | ADMIN      |
| `/admin/claims`   | 认领审核               | ADMIN      |
| `/admin/users`    | 用户管理（改角色）     | ADMIN      |

## 功能概览

- **认证**：登录 / 注册 / 退出；登录态持久化（Zustand + localStorage），启动时通过 `GET /auth/me` 校验 token，401 自动登出并跳登录。
- **首页**：按角色切换 Dashboard。管理员看统计 + 待审核；普通用户看进行中数量 + 最新失物 / 拾物。
- **列表页**：搜索 / 类型 / 状态 / 地点 / 排序筛选，卡片 / 表格视图切换，URL query 同步，分页。
- **发布页**：完整表单 + Zod 校验；提交前调用 `POST /posts/duplicate-check`，疑似重复时弹出候选列表，用户确认后带 `confirmDuplicate: true` 提交。
- **详情页**：完整字段展示 + 过期倒计时；FOUND + 进行中 + 非本人可申请认领（RHF + Zod 弹窗）。
- **我的认领**：状态筛选 + 取消待审核申请。
- **管理员后台**：统计总览、状态分布、待审核面板、物品下架（带理由）、认领审核（通过 / 驳回 + 备注）、用户角色变更。
- **UI**：Apple / Linear / Notion 风格，圆角 16px、浅边框、低饱和状态色；Framer Motion 进入动画 + 卡片 hover lift。

## 与后端联调说明

前端按默认契约开发，所有请求统一走 `http` axios 实例：

- 请求自动注入 `Authorization: Bearer <token>`
- 响应自动解包 `ApiResponse<T> = { code, message, data }`，`code !== 0` 抛 `ApiError`
- 401 清登录态并跳 `/login?from=...`
- 分页响应约定 `PageResult<T> = { records, total, page, pageSize }`

### 后端契约对齐情况

联调后已与后端真实字段对齐，以下为最终确认的契约：

1. **`AdminStatsDTO`**：`{ userCount, activeUserCount, lostPostCount, foundPostCount, processingPostCount, claimedPostCount, expiredPostCount, removedPostCount, pendingClaimCount, approvedClaimCount, rejectedClaimCount, unreadNotificationCount }`。前端「总发布」= `lostPostCount + foundPostCount`，状态分布直接用 4 个计数字段。
2. **`DuplicateCheckResult`**：`{ duplicateScore: number, level: "HIGH"|"MEDIUM"|"NORMAL", duplicate: boolean, matchedPost: Post | null }`。后端只返回单条最高分匹配，不是候选数组。
3. **`Post.ownerName`**：后端在 `PostDTO` 中冗余返回，详情页直接使用。
4. **`Claim.postTitle` / `Claim.claimerName`**：后端在 `ClaimDTO` 中冗余返回。
5. **用户禁用 / 启用**：`PUT /admin/users/{id}/status` + `{ status: "ACTIVE"|"DISABLED" }`。用户管理页已接入，禁止禁用当前登录账号自身。
6. **`GET /posts` 查询参数**：`keyword` / `type` / `status` / `location` / `sortBy` / `page` / `pageSize`，`sortBy` 取值 `createdAtDesc` / `updatedAtDesc` / `expiredAtAsc`。
7. **`POST /posts` 的 `confirmDuplicate`**：用户在重复提示框确认后携带 `true`。
8. **下架物品**：管理员走 `POST /admin/posts/{id}/remove` + `{ reason }`；用户侧 `DELETE /posts/{id}` 仅后端用，前端用户无下架入口。
9. **`ClaimCreateRequest.proofDescription`**：后端 `@NotBlank`，前端 zod 已改为必填（最少 5 字）。
10. **`Notification.readStatus`**：后端返回 `0`（未读）/ `1`（已读），类型为 `number`。Header 未读计数走 `GET /notifications?readStatus=0&page=1&pageSize=1` 取 `total`。
11. **通知**：`GET /notifications` 返回 `PageResult<Notification>`；`POST /notifications/{id}/read`、`POST /notifications/read-all`。无单独 `/unread-count` 端点。

联调时如字段再次变动，优先改 `src/lib/types/index.ts` 与对应 `src/lib/api/*.ts`，组件层一般无需改动。

## 截图

> 截图需在后端启动后逐页捕获，存放至 `docs/screenshots/`（Phase 11 待补）。

## 构建

```bash
pnpm build
pnpm start
```
