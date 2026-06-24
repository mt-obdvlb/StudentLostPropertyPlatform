# 校园失物招领管理系统

Web 应用开发课程大作业 —— 校园失物招领管理平台，提供失物/拾物发布、认领申请、管理员审核、通知推送等功能。

## 技术栈

| 层级 | 技术 | 版本 |
| --- | --- | --- |
| 后端框架 | Spring Boot | 3.3.5 |
| 语言 | Java | 17 |
| 安全 | Spring Security + JWT | jjwt 0.12.6 |
| ORM | MyBatis-Plus | 3.5.9 |
| 数据库 | MySQL | 8.4 |
| 缓存 | Redis | 7.2 |
| 前端框架 | Next.js (App Router) | 16 |
| UI 库 | React + shadcn/ui + Tailwind CSS | 19 / 4 |
| 包管理 | pnpm | 10+ |

## 跨平台开发环境配置

### 前置依赖

无论使用什么操作系统，你都需要安装以下工具：

| 工具 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Docker Desktop** | [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/) | [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) | [Docker Engine](https://docs.docker.com/engine/install/) + Docker Compose |
| **JDK 17** | `brew install openjdk@17` | [Adoptium JDK 17](https://adoptium.net/download/) 或 [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) | `apt install openjdk-17-jdk` / `yum install java-17-openjdk-devel` |
| **Maven** | `brew install maven` 或使用 IntelliJ IDEA 内置 Maven | 下载 [Maven](https://maven.apache.org/download.cgi) 解压并配置 PATH，或使用 IntelliJ IDEA 内置 | `apt install maven` / `yum install maven` |
| **Node.js 20+** | `brew install node@20` 或 [nvm](https://github.com/nvm-sh/nvm) | [Node.js 官网](https://nodejs.org/) 下载 LTS 安装包 | [nvm](https://github.com/nvm-sh/nvm) 或 `apt install nodejs` |
| **pnpm 10+** | `npm install -g pnpm` | `npm install -g pnpm` | `npm install -g pnpm` |
| **Git** | `brew install git` 或 Xcode CLI | [Git for Windows](https://git-scm.com/download/win) | `apt install git` / `yum install git` |

> **Windows 用户注意**：Docker Desktop for Windows 需要启用 WSL2 或 Hyper-V，建议使用 **WSL2**（性能更好）。安装 Docker Desktop 时勾选 "Use WSL 2 instead of Hyper-V"。

### 快速启动（所有平台通用）

以下步骤在 macOS、Windows（PowerShell / Git Bash）、Linux 下均可执行。

#### 1. 克隆项目

```bash
git clone https://github.com/mt-obdvlb/StudentLostPropertyPlatform.git
cd StudentLostPropertyPlatform
```

#### 2. 启动 MySQL + Redis（Docker）

```bash
docker compose up -d
```

首次启动会自动：
- 拉取 MySQL 8.4 和 Redis 7.2 镜像
- 创建数据库 `lost_found`
- 执行 `sql/schema.sql` 建表
- 执行 `sql/data.sql` 插入种子数据

验证服务是否就绪：

```bash
docker compose ps
# 两个服务都显示 "healthy" 即可
```

> **Windows 用户**：如果遇到 `docker: command not found`，确保 Docker Desktop 已启动并在系统托盘中显示 "Engine running"。如果遇到换行符问题（`exec /usr/local/bin/docker-entrypoint.sh: no such file or directory`），执行 `git config --global core.autocrlf input` 后重新 clone。

#### 3. 启动后端

**macOS / Linux**：

```bash
cd backend
mvn spring-boot:run
```

**Windows（PowerShell）**：

```powershell
cd backend
mvn spring-boot:run
```

**使用 IntelliJ IDEA**（推荐，无需手动配置 Maven）：
1. 用 IntelliJ IDEA 打开 `backend/` 目录
2. 等待 Maven 依赖自动下载完成
3. 运行 `LostFoundApplication` 主类

后端启动后访问：http://localhost:8080/swagger-ui/index.html

#### 4. 启动前端

```bash
cd frontend
pnpm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
pnpm dev
```

前端启动后访问：http://localhost:3000

### 环境变量参考

所有配置都有默认值，无需修改即可本地运行。如需自定义，可通过环境变量覆盖：

**后端**（`application.yml` 中的默认值）：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `MYSQL_URL` | `jdbc:mysql://localhost:3306/lost_found` | 数据库连接 |
| `MYSQL_USERNAME` | `root` | 数据库用户名 |
| `MYSQL_PASSWORD` | `68562520` | 数据库密码 |
| `REDIS_HOST` | `localhost` | Redis 地址 |
| `REDIS_PORT` | `6379` | Redis 端口 |
| `REDIS_PASSWORD` | `68562520` | Redis 密码 |
| `JWT_SECRET` | （内置默认值） | JWT 签名密钥 |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | 允许的前端来源 |

**前端**（`frontend/.env.local`）：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api` | 后端 API 地址 |

### 端口占用

| 服务 | 端口 |
| --- | --- |
| 前端 (Next.js) | 3000 |
| 后端 (Spring Boot) | 8080 |
| MySQL | 3306 |
| Redis | 6379 |

## 测试账号

| 角色 | 用户名 | 密码 |
| --- | --- | --- |
| 管理员 | admin | admin123456 |
| 普通用户 | user1 | user123456 |
| 普通用户 | user2 | user123456 |

## 项目结构

```text
StudentLostPropertyPlatform/
├── backend/                        # Spring Boot 后端
│   ├── src/main/java/.../          # 源码（common/module/job）
│   ├── src/main/resources/         # 配置 + SQL
│   └── pom.xml                     # Maven 依赖
├── frontend/                       # Next.js 前端
│   ├── src/app/                    # 路由页面
│   ├── src/components/             # UI 组件
│   ├── src/lib/                    # API / Hooks / Store / Types
│   └── package.json
├── sql/                            # 数据库初始化脚本
│   ├── schema.sql                  # 建表
│   └── data.sql                    # 种子数据
├── docs/                           # 设计文档
│   ├── 01-requirements.md          # 需求分析
│   ├── 02-architecture.md          # 系统架构
│   ├── 03-database-design.md       # 数据库设计
│   ├── 04-api-design.md            # API 设计
│   ├── 05-frontend-design.md       # 前端设计
│   ├── 06-backend-design.md        # 后端设计
│   ├── 07-test-cases.md            # 测试用例
│   ├── 08-deployment.md            # 部署说明
│   ├── 09-ai-usage.md              # AI 使用说明
│   └── 10-frontend-impl-plan.md    # 前端实现计划
├── docker-compose.yml              # MySQL + Redis 容器编排
└── README.md
```

## 核心功能

- 用户注册 / 登录 / JWT 认证
- 发布失物招领 / 拾物招领信息
- 搜索、筛选、分页、排序
- 对拾物信息提交认领申请
- 发布前重复信息检测
- 管理员审核认领（通过 / 驳回）
- 物品状态自动流转（进行中 → 已认领 / 已过期）
- 管理员下架物品、用户管理、操作日志
- 通知推送（认领创建 / 审核结果 / 物品过期）
- 定时任务每小时自动过期处理

## 常见问题

### macOS

- **Maven 依赖下载失败**：配置阿里云 Maven 镜像，编辑 `~/.m2/settings.xml`，添加 `https://maven.aliyun.com/repository/public` 镜像源。
- **Lombok 编译报错**：确保使用 JDK 17，不要使用更高版本的 JDK（Lombok 1.18.x 不兼容 JDK 26+）。
- **端口冲突**：macOS 可能自带 Apache 占用 8080，执行 `sudo lsof -i :8080` 查看并关闭。

### Windows

- **Docker 启动失败**：确保在 BIOS 中启用了虚拟化（VT-x/AMD-V），WSL2 已正确安装。在 PowerShell 中运行 `wsl --install` 安装 WSL2。
- **Maven 找不到命令**：将 Maven 的 `bin` 目录添加到系统 PATH 环境变量。或直接使用 IntelliJ IDEA 打开项目，IDE 内置 Maven 无需额外配置。
- **`pnpm dev` 报错**：确保在 `frontend/` 目录下执行，且已运行 `pnpm install`。
- **Git 换行符问题**：Windows 默认 CRLF 可能导致 Shell 脚本执行失败。Clone 前执行 `git config --global core.autocrlf input`。
- **端口 3306 冲突**：如果本机已安装 MySQL，需先停止本地 MySQL 服务再启动 Docker 容器。

### Linux

- **Docker 权限不足**：将当前用户加入 `docker` 组：`sudo usermod -aG docker $USER`，然后注销重新登录。
- **Maven 内存不足**：`export MAVEN_OPTS="-Xmx512m"` 限制 Maven 堆内存。

## 文档入口

- 后端运行说明：[backend/README.md](backend/README.md)
- 前端运行说明：[frontend/README.md](frontend/README.md)
- 需求分析：[docs/01-requirements.md](docs/01-requirements.md)
- 系统架构：[docs/02-architecture.md](docs/02-architecture.md)
- 数据库设计：[docs/03-database-design.md](docs/03-database-design.md)
- API 设计：[docs/04-api-design.md](docs/04-api-design.md)
- 前端设计：[docs/05-frontend-design.md](docs/05-frontend-design.md)
- 后端设计：[docs/06-backend-design.md](docs/06-backend-design.md)
- 测试用例：[docs/07-test-cases.md](docs/07-test-cases.md)
- 部署说明：[docs/08-deployment.md](docs/08-deployment.md)
- AI 使用说明：[docs/09-ai-usage.md](docs/09-ai-usage.md)