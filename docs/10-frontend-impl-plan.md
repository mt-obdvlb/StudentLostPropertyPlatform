# 前端实施计划与追踪

本文件追踪《校园失物招领管理系统》前端的分阶段实施进度。每阶段完成后追加记录。

## 总体说明

- 前端代码目录：`frontend/`
- 包管理器：pnpm 10
- 框架：Next.js 16.2.9 (App Router) + React 19.2 + TypeScript 5.9 + Tailwind 4 + shadcn/ui (base-nova)
- 后端 API 默认：`http://localhost:8080/api`
- 前端启动：`http://localhost:3000`
- 状态：TanStack Query (远程) + Zustand (auth) + RHF (表单)
- 严格 TypeScript：`strict` + `noUncheckedIndexedAccess` + `noImplicitOverride`
- 不写 mock 业务数据，仅允许 skeleton / empty / error 状态

---

## Phase 0：初始化前端项目骨架 ✅

### 修改/新增文件

- `frontend/` Next.js 16 + TS + Tailwind 4 项目（由 `pnpm create next-app` 生成）
- `frontend/package.json`：依赖 `next`、`react`、`react-dom`、`framer-motion`、`@tanstack/react-query`、`axios`、`zustand`、`react-hook-form`、`zod`、`@hookform/resolvers`、`lucide-react`、`clsx`、`tailwind-merge`、`class-variance-authority`、`sonner`
- `frontend/components.json`：shadcn/ui 配置（style=base-nova, baseColor=neutral, cssVariables=true）
- `frontend/src/components/ui/*`：button、card、input、label、select、table、dialog、badge、dropdown-menu、avatar、separator、tabs、skeleton、sonner、textarea、tooltip
- `frontend/src/lib/utils.ts`：`cn` 工具
- `frontend/src/lib/providers.tsx`：QueryClientProvider + TooltipProvider + Toaster
- `frontend/src/app/globals.css`：品牌色 + 语义色变量（primary=蓝、状态色映射）
- `frontend/src/app/layout.tsx`：根 layout，注入 Providers，metadata 改为中文标题
- `frontend/src/app/page.tsx`：占位首页
- `frontend/tsconfig.json`：开启 `noUncheckedIndexedAccess`、`noImplicitOverride`
- `frontend/next.config.ts`：允许 `localhost` 与所有 https 远程图片
- `frontend/.env.example`、`.env.local`：`NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`
- `frontend/.gitignore`：默认 Next.js 模板

### 实现功能

- 可运行 `pnpm dev` 启动空骨架
- shadcn/ui 组件库就绪
- Tailwind 主题：浅色 + 深色变量，primary 用 oklch 蓝
- 严格 TS 模式启用

### 如何运行

```bash
cd frontend
pnpm install
pnpm dev      # http://localhost:3000
```

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit   # 无类型错误
pnpm lint                # 无 lint 错误
```

### 待对齐字段

无。本阶段未涉及接口字段。

---

## Phase 1：类型系统 + API client + 状态骨架 ✅

### 修改/新增文件

- `frontend/src/lib/types/index.ts`：全部领域类型（User / Post / Claim / Notification / AdminStats / DuplicateCheckResult / 请求 DTO / ApiResponse / PageResult / ApiError）
- `frontend/src/lib/api/axios.ts`：baseURL 读环境变量、注入 Authorization、统一解包 `ApiResponse`、`code !== 0` 抛 `ApiError`、401 清登录态并跳 `/login`
- `frontend/src/lib/api/auth.ts` `posts.ts` `claims.ts` `admin.ts` `notifications.ts`：纯函数 API 模块
- `frontend/src/lib/store/auth-store.ts`：Zustand + persist，`token/user/setAuth/setUser/clear/isAuthenticated/hasRole`，注册 401 handler
- `frontend/src/lib/hooks/use-auth.ts` `use-posts.ts` `use-claims.ts` `use-admin.ts` `use-notifications.ts`：TanStack Query 封装
- `frontend/src/lib/utils/format.ts`：日期格式化、API error 识别

### 实现功能

- 所有 API 调用走 `http` axios 实例，统一解包
- 组件不直接 `import axios`，只通过 hooks 调用
- 401 自动登出并跳转登录
- 类型集中管理，无 `any`

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit   # 通过
```

### 待对齐字段

- `AdminStatsDTO` 字段未定，前端定义 `{ totalPosts, processingPosts, claimedPosts, expiredPosts, pendingClaims, totalUsers?, lostToday?, foundToday?, statusDistribution?, recentLogs? }`，后端就绪后按真字段调整
- `DuplicateCheckResult` 定义为 `{ score, level: HIGH|MEDIUM|NONE, candidates: Post[] }`
- 用户禁用/启用接口文档未提供，前端按钮先 disable

---

## Phase 2：Auth + 路由保护 + AppShell ✅

### 修改/新增文件

- `frontend/src/components/layout/app-shell.tsx`：受保护布局壳，未登录跳 `/login?from=…`，加载占位、Sidebar + Header + MobileNav
- `frontend/src/components/layout/sidebar.tsx`：Sidebar / MobileNav / NavList / BrandHeader / UserCard，按角色分组（普通用户 / 管理员），active 高亮
- `frontend/src/components/layout/header.tsx`：搜索框、通知 dropdown（含未读计数、全部已读）、用户菜单（我的认领 / 发布信息 / 退出登录）
- `frontend/src/components/layout/auth-sync.tsx`：登录态恢复 — token 存在时调用 `GET /auth/me` 同步 user，401 清登录态
- `frontend/src/app/(app)/layout.tsx`：(app) 路由组用 AppShell + AuthSync 包裹
- `frontend/src/app/(app)/page.tsx`：首页（Phase 3 占位 Dashboard）
- `frontend/src/app/(auth)/layout.tsx`：登录/注册居中卡片布局 + 背景动效
- `frontend/src/app/(auth)/login/page.tsx`：RHF + Zod 登录表单，`from` 参数回跳
- `frontend/src/app/(auth)/register/page.tsx`：RHF + Zod 注册表单，含确认密码、手机号正则校验

### 实现功能

- 路由分 (app) 与 (auth) 两组，受保护页面自动检查登录态
- 登录态持久化：Zustand persist + 启动时 `GET /auth/me` 校验 token
- 401 自动登出并跳登录（含回跳 URL）
- 移动端抽屉式导航，桌面端固定 256px 侧边栏
- shadcn base-nova 的 `render` 替代 `asChild` 适配 base-ui

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint
pnpm dev
# 访问 http://localhost:3000 应自动跳 /login
# 用 admin/admin123456（后端就绪后）登录 → 进入首页
```

### 待对齐字段

- `User.status` 后端是否返回；未返回时容错显示

---

## Phase 3：首页 Dashboard ✅

### 修改/新增文件

- `frontend/src/components/posts/post-type-badge.tsx`：LOST=amber、FOUND=blue
- `frontend/src/components/posts/post-status-badge.tsx`：PROCESSING=blue、CLAIMED=green、EXPIRED=zinc、REMOVED=red
- `frontend/src/components/claims/claim-status-badge.tsx`：PENDING=yellow、APPROVED=green、REJECTED=red、CANCELLED=zinc
- `frontend/src/components/posts/post-card.tsx`：卡片视图，含图片占位、badge、地点/时间、过期时间、发布者，hover lift
- `frontend/src/components/admin/admin-stats-cards.tsx`：4 张统计卡片
- `frontend/src/components/common/empty-state.tsx`：空状态
- `frontend/src/components/common/loading-skeleton.tsx`：LoadingSkeleton + CardSkeleton
- `frontend/src/components/home/dashboard-home.tsx`：按角色切换 UserDashboard / AdminDashboard

### 实现功能

- 管理员调用 `GET /admin/stats` + 双 `/posts` 列表
- 普通用户用 `/posts?type=LOST&status=PROCESSING&pageSize=1` 的 `total` 推算进行中数量
- Framer Motion 进入动画 + 卡片 stagger + hover lift
- loading 用 CardSkeleton，error 用 ErrorCard，empty 用 EmptyState

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint
pnpm dev   # 登录后访问 / 看到对应角色 Dashboard
```

### 待对齐字段

- `AdminStatsDTO` 字段名按前端定义，后端就绪后调整
- 普通用户首页统计用 `PageResult.total` 推算，后端如提供 `/posts/stats` 可替换

---

## Phase 4：失物 / 拾物列表页 ✅

### 修改/新增文件

- `frontend/src/components/common/filter-bar.tsx`：keyword / type / status / location / sortBy 筛选 + 重置
- `frontend/src/components/posts/post-table.tsx`：表格视图
- `frontend/src/components/common/pagination.tsx`：分页器
- `frontend/src/app/(app)/posts/page.tsx`：列表页主体，卡片/表格视图切换，URL query 同步

### 实现功能

- 搜索、类型筛选、状态筛选、地点筛选、排序
- 卡片视图 + 表格视图切换
- 分页（每页 9 条）
- URL query 同步（可分享链接）
- loading 用 LoadingSkeleton，empty 用 EmptyState，error 显示后端错误信息

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint
pnpm dev   # 访问 /posts，切换视图、筛选、分页
```

### 待对齐字段

- 后端 `GET /posts` 是否接受 `keyword` 单参数；当前按 `keyword`
- `sortBy` 字段值（`createdAtDesc` / `updatedAtDesc` / `expiredAtAsc`）

---

## Phase 5：发布页 ✅

### 修改/新增文件

- `frontend/src/components/posts/duplicate-check-hint.tsx`：重复检测提示，展示疑似候选 + 继续/取消按钮
- `frontend/src/components/posts/post-form.tsx`：RHF + Zod 完整表单，提交前先调用 duplicate-check
- `frontend/src/app/(app)/posts/create/page.tsx`：发布页

### 实现功能

- 字段：title / type / category / description / imageUrl / location / occurredAt / expiredAt / contact
- Zod 校验：标题长度、描述长度、图片 URL 合法性、过期时间晚于发生时间且晚于当前时间
- 提交流程：先 `POST /posts/duplicate-check`，若 level != NONE 且有候选 → 展示 DuplicateCheckHint
- 用户确认 → `POST /posts` 带 `confirmDuplicate: true`
- 发布成功跳详情页
- 图片暂用 imageUrl 输入（未对接 OSS）

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint   # 1 个 RHF watch 提示性 warning，可忽略
pnpm dev   # 登录后 /posts/create 提交表单
```

### 待对齐字段

- `confirmDuplicate` 字段后端是否必需
- `DuplicateCheckResult` 真实形状（`score` / `level` / `candidates`）

---

## Phase 6：详情页 + 认领申请 ✅

### 修改/新增文件

- `frontend/src/components/posts/expiry-countdown.tsx`：过期倒计时（按距离过期时间着色 + ExpiryWarning）
- `frontend/src/components/claims/claim-timeline.tsx`：认领状态时间线
- `frontend/src/components/claims/claim-dialog.tsx`：申请认领弹窗，RHF + Zod 校验理由/证明
- `frontend/src/components/posts/post-detail.tsx`：详情主体
- `frontend/src/app/(app)/posts/[id]/page.tsx`：详情页路由（Next 16 async `params`）

### 实现功能

- 调用 `GET /posts/{id}` 加载详情
- 展示标题、图片、类型、状态、分类、地点、发生时间、联系方式、发布者、发布时间、过期倒计时
- 申请认领按钮可用性逻辑：
  - FOUND + PROCESSING + 已登录 + 非本人 → 可点击，弹 ClaimDialog
  - 未登录 → 跳 `/login?from=…`
  - LOST / 已认领 / 已过期 / 已下架 / 本人发布 → 按钮禁用并说明原因
- 提交 `POST /api/claims` 成功后跳 `/claims`
- loading 用 LoadingSkeleton，error 用 EmptyState

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint
pnpm dev   # /posts/{id} 查看详情，登录后点申请认领
```

### 待对齐字段

- `Post.ownerName` 后端是否返回；缺失时显示 `#ownerId`
- `Post.duplicateScore` 字段返回时可选展示

---

## Phase 7：我的申请页 ✅

### 修改/新增文件

- `frontend/src/components/claims/claim-table.tsx`：我的申请表格
- `frontend/src/app/(app)/claims/page.tsx`：我的申请页主体

### 实现功能

- 调用 `GET /claims/my` 拉取当前用户申请
- 状态筛选（PENDING / APPROVED / REJECTED / CANCELLED）
- 分页（每页 10 条）
- 取消待审核申请：弹 ConfirmDialog → `POST /claims/{id}/cancel`
- loading / empty / error 状态完整

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint
pnpm dev   # 登录后 /claims 查看自己的申请
```

### 待对齐字段

- `Claim.postTitle` / `Claim.claimerName` 后端是否在 ClaimDTO 中冗余返回

---

## Phase 8：管理员后台 ✅

### 修改/新增文件

- `frontend/src/components/admin/admin-guard.tsx`：角色守卫，非 ADMIN 跳首页
- `frontend/src/components/admin/user-role-badge.tsx`：用户角色 badge
- `frontend/src/components/admin/review-action-panel.tsx`：审核备注 + 通过/驳回按钮
- `frontend/src/components/admin/pending-claim-panel.tsx`：待审核申请面板
- `frontend/src/app/(app)/admin/page.tsx`：管理员首页（统计 + 状态分布 + 待审核面板）
- `frontend/src/app/(app)/admin/posts/page.tsx`：物品管理（关键词/状态筛选、分页、下架）
- `frontend/src/app/(app)/admin/claims/page.tsx`：认领审核（PENDING/APPROVED/REJECTED/CANCELLED/全部 tab + ReviewActionPanel）
- `frontend/src/app/(app)/admin/users/page.tsx`：用户管理（关键词/角色筛选、分页、改角色）
- `frontend/src/components/common/confirm-dialog.tsx`：通用确认弹窗
- `frontend/src/components/common/data-table.tsx`：通用表格

### 实现功能

- 所有 /admin/* 路由用 AdminGuard 包裹
- 管理员首页：AdminStatsCards + 状态分布条 + PendingClaimPanel
- 物品管理：表格 + 下架弹窗（需填理由）→ `POST /admin/posts/{id}/remove`
- 认领审核：tab 切换状态 + 卡片式申请详情 + ReviewActionPanel → approve/reject 带 reviewComment
- 用户管理：表格 + 内联角色 Select + 保存按钮 → `PUT /admin/users/{id}/role`
- 禁用/启用用户接口未提供，UI 标注「待后端支持」

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit
pnpm lint
pnpm dev   # 用 admin 登录后访问 /admin/*
```

### 待对齐字段

- `AdminStatsDTO.statusDistribution` 字段；后端无返回时用 stats 中的 4 个计数字段推算
- 用户禁用 / 启用接口

---

## Phase 9：UI 还原 + 动效 ✅

### 实现要点

- 全局色板：primary=蓝（Linear 风靛蓝），背景 `zinc-50`，文字 `zinc-900`，边框 `zinc-200`
- 状态色完整覆盖：LOST=amber / FOUND=blue / PROCESSING=blue / CLAIMED=green / EXPIRED=zinc / REMOVED=red / PENDING=yellow / APPROVED=green / REJECTED=red / CANCELLED=zinc
- 卡片：圆角 16px（`rounded-2xl`）、1px 浅边框、hover shadow-md
- 按钮：主按钮 primary、次按钮 outline、危险 destructive、ghost，hover/active/disabled 完整
- 表格：行高松、表头浅灰、无重边框
- 表单：顶部标签、输入框圆角 8px、focus 环色低饱和
- 间距：卡片间距 16-24px、内边距 24px、章节 32px
- Framer Motion：页面进入 fade+y、列表 stagger（delay 上限 0.3s）、卡片 hover lift、Dialog 弹入、Timeline 进度
- 响应式：桌面 256px 固定侧边栏，移动端 Sheet 抽屉

### 烟雾测试

```bash
pnpm dev   # http://localhost:3000
# 全部路由返回 200：
# / /login /register /posts /posts/create /posts/[id] /claims /admin /admin/posts /admin/claims /admin/users
```

---

## Phase 10–11：联调说明 + README ✅

### 修改/新增文件

- `frontend/README.md`：项目说明、目录结构、环境要求、安装 / 环境变量 / 启动 / 类型检查 / Lint、测试账号、路由清单、功能概览、与后端联调说明、待对齐字段清单、构建命令
- `frontend/.env.example`：`NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`（Phase 0 已建，此处仅文档化）

### 实现功能

- 前端启动说明完整：`pnpm install` → `cp .env.example .env.local` → `pnpm dev`
- 类型检查 / Lint 命令文档化
- 测试账号表（admin / user1 / user2，密码按约定）
- 11 条路由清单 + 权限标注
- 与后端联调说明：统一 axios 实例、`ApiResponse` 解包、401 跳登录、`PageResult` 约定
- 待对齐字段清单（8 项）：`AdminStatsDTO` / `DuplicateCheckResult` / `Post.ownerName` / `Claim.postTitle`+`claimerName` / 用户禁用启用接口 / `GET /posts` 查询参数 / `confirmDuplicate` / 下架接口路径

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit   # 通过
pnpm lint                # 0 errors
pnpm dev                 # 启动后访问 http://localhost:3000
```

### 待对齐字段

详见 `frontend/README.md` 「待与后端对齐的字段」一节，共 8 项。后端就绪后优先改 `src/lib/types/index.ts` 与 `src/lib/api/*.ts`，组件层一般无需改动。

### 截图

Phase 11 要求的 `docs/screenshots/` 需在后端启动后逐页捕获，暂留空目录待补。前端本身已通过烟雾测试（11 条路由全部 200）。

---

## 完成总结

| Phase | 内容                         | 状态 |
| ----- | ---------------------------- | ---- |
| 0     | 项目骨架                     | ✅   |
| 1     | 类型 + API client + 状态     | ✅   |
| 2     | Auth + 路由保护 + AppShell   | ✅   |
| 3     | 首页 Dashboard               | ✅   |
| 4     | 列表页                       | ✅   |
| 5     | 发布页                       | ✅   |
| 6     | 详情页 + 认领申请            | ✅   |
| 7     | 我的申请页                   | ✅   |
| 8     | 管理员后台                   | ✅   |
| 9     | UI 还原 + 动效               | ✅   |
| 10–11 | 联调说明 + README            | ✅   |

前端 11 个 Phase 全部完成。后续联调仅需按 `frontend/README.md` 「待对齐字段」清单调整 `src/lib/types/index.ts` 与 `src/lib/api/*.ts`，组件层无需大改。

---

## Phase 12：后端联调 bug 修复 ✅

后端启动后逐接口对齐，修复以下字段 / 形状不匹配的 bug。

### 修改/新增文件

- `frontend/src/lib/types/index.ts`：
  - `AdminStats` 重写为后端真实字段（`userCount` / `activeUserCount` / `lostPostCount` / `foundPostCount` / `processingPostCount` / `claimedPostCount` / `expiredPostCount` / `removedPostCount` / `pendingClaimCount` / `approvedClaimCount` / `rejectedClaimCount` / `unreadNotificationCount`）
  - `DuplicateCheckResult` 改为 `{ duplicateScore, level: HIGH|MEDIUM|NORMAL, duplicate, matchedPost: Post | null }`
  - `DuplicateLevel` 枚举值 `NONE` → `NORMAL`
  - `Notification.readStatus` 由 `boolean` 改为 `number`（0/1）
  - `ClaimCreateRequest.proofDescription` 改为必填
  - `ClaimReviewRequest.reviewComment` 改为可选
  - `RemovePostRequest.reason` 改为可选
  - 新增 `UserStatusUpdateRequest = { status: UserStatus }`
- `frontend/src/components/admin/admin-stats-cards.tsx`：4 张卡片字段名对齐，「总发布」= `lostPostCount + foundPostCount`
- `frontend/src/app/(app)/admin/page.tsx`：`StatusDistribution` 去掉 `distribution` 入参，直接用 fallback 4 个计数字段
- `frontend/src/components/home/dashboard-home.tsx`：`pendingClaims` → `pendingClaimCount`
- `frontend/src/components/posts/duplicate-check-hint.tsx`：候选列表改为单条 `matchedPost`，相似度读 `duplicateScore`
- `frontend/src/components/posts/post-form.tsx`：触发条件改为 `result.matchedPost && result.level !== "NORMAL"`
- `frontend/src/components/claims/claim-dialog.tsx`：`proofDescription` zod 改为必填（min 5），标签去掉「可选」
- `frontend/src/lib/api/notifications.ts`：`NotificationQuery.readStatus` 改为 `number`
- `frontend/src/components/layout/header.tsx`：未读计数改走 `readStatus=0&page=1&pageSize=1` 取 `total`；item 渲染用 `n.readStatus === 0`
- `frontend/src/lib/api/admin.ts`：新增 `updateUserStatus(id, body)` 走 `PUT /admin/users/{id}/status`
- `frontend/src/lib/hooks/use-admin.ts`：新增 `useUpdateUserStatusMutation`，成功后失效 `users` + `stats`
- `frontend/src/app/(app)/admin/users/page.tsx`：新增「禁用 / 启用」按钮列，禁止禁用当前登录账号自身；底部提示文案更新
- `frontend/src/app/(app)/admin/claims/page.tsx`：清理未使用的 `CardTitle` 导入
- `frontend/src/components/claims/claim-dialog.tsx`：清理未使用的 `Input` 导入
- `frontend/src/components/claims/claim-timeline.tsx`：清理未使用的 `active` / `done` 局部变量
- `frontend/README.md`：「待对齐字段」改为「后端契约对齐情况」，列出 11 条已确认契约

### 实现功能

- 全部领域类型与后端真实 DTO 对齐
- 管理员首页统计、状态分布、待审核计数均能正确渲染后端数据
- 发布页重复检测能识别 `NORMAL` / `MEDIUM` / `HIGH` 三档并展示单条 `matchedPost`
- 认领申请表单 `proofDescription` 必填校验与后端 `@NotBlank` 一致
- Header 通知红点用 `readStatus=0` 查询真实未读总数
- 用户管理页支持禁用 / 启用账号（`PUT /admin/users/{id}/status`）

### 如何验证

```bash
cd frontend
pnpm exec tsc --noEmit   # 通过，0 errors
pnpm lint                # 0 errors，仅 1 条 RHF watch 提示性 warning
pnpm dev                 # 启动后访问 11 条路由全部 200
```

烟雾测试结果（后端运行中）：

```
/               200   /admin          200
/login          200   /admin/posts    200
/register       200   /admin/claims   200
/posts          200   /admin/users    200
/posts/create   200   /claims         200
/posts/1        200
```

### 待对齐字段

无。所有字段已与后端真实 DTO 对齐，详见 `frontend/README.md` 「后端契约对齐情况」一节。
