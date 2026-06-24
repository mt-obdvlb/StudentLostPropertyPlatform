# 校园失物招领管理系统 E2E 测试报告

## 1. 测试环境

| 项目 | 结果 |
| --- | --- |
| 测试时间 | 2026-06-25 00:13 CST |
| 前端地址 | http://localhost:3000 |
| 后端地址 | http://localhost:8080 |
| Swagger / OpenAPI | `/swagger-ui/index.html` 返回 302 跳转，`/v3/api-docs` 返回 200 |
| 浏览器 | Chrome，使用 Codex Chrome 插件进行真实页面点击、输入、刷新、跳转测试 |
| 前端启动 | `./node_modules/.bin/next dev`，端口 3000 |
| 后端启动 | `JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn -Dmaven.resolver.transport=wagon spring-boot:run`，端口 8080 |
| MySQL | 本地 `lost_found` 库，`mysqladmin ping` 正常 |
| Redis | 本地 Redis，认证后 `PING` 返回 `PONG` |
| 说明 | 本机 `pnpm dev` 受 pnpm minimum release age 策略影响，E2E 启动阶段改用项目本地 Next 可执行文件，不影响应用代码验证。 |

## 2. 测试账号

| 角色 | 用户名 | 用途 |
| --- | --- | --- |
| 管理员 | `admin` | 后台、审核、下架、用户状态管理、通知验证 |
| 普通用户 | `user1` | 发布 LOST / FOUND、物品所有者权限验证 |
| 普通用户 | `user2` | 认领申请、我的认领、取消申请、重复申请验证 |
| E2E 注册用户 | `e2e_15864468` | 注册、重复用户名、用户管理禁用/启用验证 |

用户管理角色变更需要 `SUPER_ADMIN` 权限。测试期间临时将本地测试库中的 `admin` 角色提升为 `SUPER_ADMIN`，通过 UI 完成角色修改验证后已恢复为 `ADMIN`。

## 3. 测试覆盖清单

| 模块 | 测试点 | 结果 | 问题 | 修复情况 |
| --- | --- | --- | --- | --- |
| 启动与健康检查 | 前端首页、OpenAPI、Swagger、MySQL、Redis | 通过 | Redis 未认证时返回 NOAUTH，认证后正常 | 无需修复 |
| 首页 Dashboard | 未登录/普通用户/管理员入口、统计卡片、最新失物/拾物、刷新 | 通过 | Link Button 控制台错误 | 已修复 E2E-001 |
| 注册 | 空表单、用户名/邮箱/密码/确认校验、正常注册、重复用户名 | 通过 | 无 | 无 |
| 登录 | 空表单、错误密码、user1/user2/admin 登录、刷新保持登录态、退出 | 通过 | 头像菜单打开时报 Base UI 上下文错误 | 已修复 E2E-002 |
| 权限控制 | 未登录访问受保护页、普通用户访问后台、管理员访问后台和普通页面 | 通过 | 无 | 无 |
| 失物/拾物列表 | 卡片/表格视图、类型/状态/关键词/地点筛选、分页、排序、empty/error 状态 | 通过 | 768px 平板宽度出现横向溢出 | 已修复 E2E-005 |
| 发布信息 | 空表单、短标题/短描述、时间校验、联系方式校验、发布 LOST 和 FOUND | 通过 | 表单 `watch()` 触发 lint warning | 已修复 E2E-007 |
| 重复发布检测 | duplicate-check 请求、重复提示、取消发布、确认继续发布、duplicateScore 展示 | 通过 | 无 | 无 |
| 物品详情 | 标题、图片占位、类型/状态 badge、分类、地点、时间、联系方式、发布者、Timeline、刷新、不存在 ID | 通过 | 返回按钮 Link Button 控制台错误 | 已修复 E2E-001 |
| 申请认领 | user2 认领 user1 的 FOUND、空表单校验、提交后 `/claims` 展示 PENDING | 通过 | 重复申请前端仍显示申请按钮 | 已修复 E2E-004 |
| 认领限制 | 所有人不能认领自己发布的 FOUND、LOST/CLAIMED/EXPIRED 不可认领、重复申请不可认领 | 通过 | 过期但状态仍 PROCESSING 的物品前端仍可点申请 | 已修复 E2E-003 |
| 我的认领 | 列表、标题、理由、状态、审核备注、PENDING 取消、刷新保持 CANCELLED | 通过 | EmptyState Link Button 潜在控制台错误 | 已修复 E2E-001 |
| 管理员首页 | 统计、待审核数量、最近操作、状态分布、刷新、普通用户拦截 | 通过 | 待审核面板 Link Button 潜在控制台错误 | 已修复 E2E-001 |
| 管理员物品管理 | 全部物品、REMOVED 管理员可见、筛选、搜索、分页、下架、普通列表不显示 REMOVED | 通过 | 无 | 无 |
| 管理员认领审核 | PENDING 列表、申请人/理由/物品信息、驳回、通过、备注保存、列表刷新 | 通过 | 无 | 无 |
| 审核事务一致性 | APPROVED claim 对应 post 变 CLAIMED；同 post 无多个 APPROVED | 通过 | 无 | 数据库复查通过 |
| 用户管理 | 用户列表、角色修改、禁用、禁用后登录失败、启用恢复 | 通过 | 普通 ADMIN 无法改角色符合后端权限；需要 SUPER_ADMIN 测试前置 | 已按权限模型验证并恢复数据 |
| 通知 | 认领创建通知、审核通知、通知入口、未读状态、全部已读 | 通过 | 无 | 无 |
| 自动过期 | 定时任务、EXPIRED 状态、详情页过期提示、认领按钮禁用、EXPIRED 筛选 | 通过 | 无手动触发接口 | 00:00 定时任务已真实执行；建议保留测试/管理触发入口 |
| 浏览器 UI | 1440x900、1280x800、768x1024、390x844 视口；导航、表格滚动、表单、按钮 | 通过 | 768px 列表溢出 | 已修复并复测 |
| Console / Network | 干净标签页核心页面 console error、核心网络 404/500/CORS/failed | 通过 | 修复前有 Base UI error | 修复后干净标签页无 error，网络异常为空 |

## 4. 发现的问题

### E2E-001：多处 `Button` 渲染 `Link` 时未关闭 native button 语义

| 字段 | 内容 |
| --- | --- |
| 页面路径 | `/`、`/posts`、`/posts/5`、`/claims`、`/admin` |
| 复现步骤 | 打开相关页面，点击或渲染带 `render={<Link .../>}` 的 Button |
| 实际结果 | 控制台出现 Base UI error：组件期望原生 `<button>`，但 render 结果不是 button |
| 期望结果 | Link 型 Button 不产生控制台错误，并保留正确可访问性语义 |
| 原因分析 | Base UI Button 默认 `nativeButton=true`，当 render 为 Next Link 时需要显式设置 `nativeButton={false}` |
| 修复文件 | `frontend/src/components/home/dashboard-home.tsx`、`frontend/src/app/(app)/posts/page.tsx`、`frontend/src/components/posts/post-detail.tsx`、`frontend/src/components/admin/pending-claim-panel.tsx`、`frontend/src/app/(app)/claims/page.tsx` |
| 修复说明 | 所有 Link 型 Button 添加 `nativeButton={false}` |
| 复测结果 | 干净 Chrome 标签页访问首页、列表、发布、详情、后台用户页，console error 为空 |

### E2E-002：头像菜单打开时报 `MenuGroupContext is missing`

| 字段 | 内容 |
| --- | --- |
| 页面路径 | 全局 Header，头像用户菜单 |
| 复现步骤 | 登录后点击头像菜单 |
| 实际结果 | 控制台报 Base UI `MenuGroupContext is missing`，菜单交互异常 |
| 期望结果 | 头像菜单可打开，展示用户信息、我的认领、发布信息、退出登录 |
| 原因分析 | `DropdownMenuLabel` 使用了需要 Group 上下文的 `MenuPrimitive.GroupLabel` |
| 修复文件 | `frontend/src/components/ui/dropdown-menu.tsx`、`frontend/src/components/layout/header.tsx` |
| 修复说明 | `DropdownMenuLabel` 改为普通 `div`；头像触发按钮增加 `aria-label="用户菜单"` |
| 复测结果 | user1/user2/admin 均可打开头像菜单并退出登录 |

### E2E-003：过期时间已过但状态仍为 PROCESSING 时，详情页仍允许申请认领

| 字段 | 内容 |
| --- | --- |
| 页面路径 | `/posts/5` |
| 复现步骤 | 打开 expiredAt 早于当前时间但尚未被定时任务更新的 FOUND 详情页 |
| 实际结果 | 页面倒计时显示已过期，但操作区仍可能显示“申请认领” |
| 期望结果 | 只要当前时间超过 expiredAt，就禁止申请认领 |
| 原因分析 | 认领按钮只看 `post.status`，没有结合 `expiredAt` 判断 |
| 修复文件 | `frontend/src/components/posts/post-detail.tsx` |
| 修复说明 | 增加 `isExpired`，同时用于 `canClaim`、`needLogin` 和操作区提示；当前时间改为 state/effect 管理以满足 React purity lint |
| 复测结果 | `/posts/5` 显示“该物品已过期，无法申请认领。”，申请按钮数量为 0；00:00 定时任务后数据库状态为 `EXPIRED` |

### E2E-004：重复认领仅靠后端拒绝，前端仍展示申请入口

| 字段 | 内容 |
| --- | --- |
| 页面路径 | `/posts/8` |
| 复现步骤 | user2 已对同一 FOUND 提交认领后，再次打开详情页 |
| 实际结果 | 前端仍展示申请入口，提交后后端返回不能重复申请 |
| 期望结果 | 前端直接展示已有申请状态，不再提供重复提交入口 |
| 原因分析 | 详情页没有查询当前用户已有认领申请 |
| 修复文件 | `frontend/src/components/posts/post-detail.tsx` |
| 修复说明 | 引入 `useMyClaimsQuery`，查找同 post 且未取消的申请；存在时显示“你已提交认领申请，当前状态：...” |
| 复测结果 | user2 再次进入详情页不显示申请按钮，展示已有申请状态；后端重复申请约束仍有效 |

### E2E-005：768px 平板宽度 `/posts` 出现横向溢出

| 字段 | 内容 |
| --- | --- |
| 页面路径 | `/posts?type=FOUND&status=PROCESSING&sortBy=expiredAtAsc` |
| 复现步骤 | Chrome 视口设为 768x1024，打开列表页 |
| 实际结果 | `documentElement.scrollWidth=807`，大于 `clientWidth=768` |
| 期望结果 | 页面根节点不横向溢出；需要横滚的表格只在表格容器内滚动 |
| 原因分析 | 筛选栏在 Tailwind `md` 临界点切到横排，固定宽度控件加间距超过内容宽度 |
| 修复文件 | `frontend/src/components/common/filter-bar.tsx` |
| 修复说明 | 筛选栏横排断点从 `md` 调整为 `lg`，平板保持纵向/网格布局 |
| 复测结果 | 768x1024、390x844、1280x800 下 `/posts` 根节点均无横向溢出 |

### E2E-006：`Date.now()` 在详情页 render 阶段触发 React purity lint

| 字段 | 内容 |
| --- | --- |
| 页面路径 | 静态验证，`frontend/src/components/posts/post-detail.tsx` |
| 复现步骤 | 运行 `./node_modules/.bin/eslint` |
| 实际结果 | `react-hooks/purity` 报错：不能在 render 阶段调用 impure function `Date.now()` |
| 期望结果 | lint 无错误 |
| 原因分析 | 为修复过期判断时直接在 render 中调用了 `Date.now()` |
| 修复文件 | `frontend/src/components/posts/post-detail.tsx` |
| 修复说明 | 使用 `useState(() => Date.now())` 保存当前时间，并在 `useEffect` 中每分钟更新 |
| 复测结果 | `eslint` 和 `tsc --noEmit` 均通过 |

### E2E-007：发布表单使用 `watch()` 触发 React Compiler warning

| 字段 | 内容 |
| --- | --- |
| 页面路径 | 静态验证，`frontend/src/components/posts/post-form.tsx` |
| 复现步骤 | 运行 `./node_modules/.bin/eslint` |
| 实际结果 | `react-hooks/incompatible-library` warning |
| 期望结果 | lint 无 warning |
| 原因分析 | `react-hook-form` 的 `watch()` 不适合作为渲染订阅 API |
| 修复文件 | `frontend/src/components/posts/post-form.tsx` |
| 修复说明 | 改用 `useWatch({ control, name })` 订阅 `type` 和 `category` |
| 复测结果 | `eslint` 无输出；发布页浏览器复测正常 |

## 5. 数据库一致性复核

| 检查项 | 结果 |
| --- | --- |
| E2E 用户最终状态 | `e2e_15864468` 为 `USER / ACTIVE` |
| admin 最终状态 | 已恢复为 `ADMIN / ACTIVE` |
| 审核通过的 E2E claim | claim `id=5` 为 `APPROVED`，post `id=8` 为 `CLAIMED` |
| 取消申请 | claim `id=6` 为 `CANCELLED` |
| 下架物品 | post `id=10` 为 `REMOVED`，普通列表不展示 |
| 自动过期 | post `id=5` 为 `EXPIRED`，`updated_at=2026-06-25 00:00:00` |
| 多个 APPROVED 检查 | 未发现同一 post 下多个 `APPROVED` claim |
| 管理员通知未读 | 全部已读后 admin 未读数为 0 |

## 6. 执行过的验证命令

```bash
curl -s -o /dev/null -w 'frontend:%{http_code}\n' http://localhost:3000/
curl -s -o /dev/null -w 'api-docs:%{http_code}\n' http://localhost:8080/v3/api-docs
curl -s -o /dev/null -w 'swagger:%{http_code}\n' http://localhost:8080/swagger-ui/index.html
redis-cli -a <redacted> ping
mysqladmin ping -uroot -p<redacted> --silent

cd frontend
./node_modules/.bin/eslint
./node_modules/.bin/tsc --noEmit

cd backend
JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn test
```

验证结果：

- `frontend:200`
- `api-docs:200`
- `swagger:302`
- Redis：`PONG`
- MySQL：`mysqld is alive`
- `eslint`：通过，无输出
- `tsc --noEmit`：通过，无输出
- `mvn test`：3 个测试全部通过，`BUILD SUCCESS`

## 7. 最终结论

系统已达到课程大作业提交标准。前端、后端、MySQL、Redis 均可正常启动和联调；登录注册、权限控制、发布、重复检测、列表筛选分页、详情页、认领申请、我的申请、管理员审核、下架、用户管理、通知和自动过期均已通过真实浏览器 E2E 验证。

尚需人工确认或后续优化：

- 自动过期目前只有整点定时任务，没有测试/管理端手动触发入口；本轮已等到 00:00 真实任务执行并验证通过，但建议增加受控的测试或管理触发接口，方便演示和回归测试。
- `pnpm dev` 在本机受 pnpm minimum release age 策略影响，本轮通过项目本地 `next dev` 启动前端。若提交环境仍使用 pnpm，需要调整 pnpm 配置或等待策略窗口结束。

修复后干净 Chrome 标签页核心页面 console error 为空，核心网络巡检未发现 404、500、CORS 或 failed 请求。
