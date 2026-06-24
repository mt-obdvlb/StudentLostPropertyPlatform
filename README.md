# 校园失物招领管理系统

Web 应用开发课程大作业 —— 校园失物招领管理平台，提供失物/拾物发布、认领申请、管理员审核、通知推送等功能。

## 技术栈

| 层级 | 技术 | 版本 |
| --- | --- | --- |
| 后端框架 | Spring Boot | 3.3.5 |
| 语言 | Java | 17 |
| 安全 | Spring Security + JWT | jjwt 0.12.6 |
| ORM | MyBatis-Plus | 3.5.9 |
| 数据库 | MySQL | 8.0+ |
| 缓存 | Redis | 7.0+ |
| 前端框架 | Next.js (App Router) | 16 |
| UI 库 | React + shadcn/ui + Tailwind CSS | 19 / 4 |
| 包管理 | pnpm | 10+ |

## 跨平台开发环境配置

### 前置依赖

无论使用什么操作系统，你都需要安装以下工具：

| 工具 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **JDK 17** | `brew install openjdk@17` | [Adoptium JDK 17](https://adoptium.net/download/) 或 [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) | `apt install openjdk-17-jdk` |
| **Maven** | `brew install maven` 或 IntelliJ IDEA 内置 | 下载 [Maven](https://maven.apache.org/download.cgi) 解压并配置 PATH，或 IntelliJ IDEA 内置 | `apt install maven` |
| **MySQL 8.0+** | `brew install mysql` | [MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/) | `apt install mysql-server` |
| **Redis 7.0+** | `brew install redis` | [Memurai](https://www.memurai.com/get-memurai) 或 WSL2 内安装 | `apt install redis-server` |
| **Node.js 20+** | `brew install node@20` 或 [nvm](https://github.com/nvm-sh/nvm) | [Node.js 官网](https://nodejs.org/) 下载 LTS | [nvm](https://github.com/nvm-sh/nvm) |
| **pnpm 10+** | `npm install -g pnpm` | `npm install -g pnpm` | `npm install -g pnpm` |
| **Git** | `brew install git` | [Git for Windows](https://git-scm.com/download/win) | `apt install git` |

### Windows 本地环境详细配置

#### 1. 安装 JDK 17

从 [Adoptium](https://adoptium.net/download/) 下载 JDK 17 的 `.msi` 安装包，安装时勾选 **"Set JAVA_HOME variable"**。

验证安装：

```powershell
java -version
# 应显示: openjdk version "17.0.x" ...
```

#### 2. 安装 MySQL

从 [MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/) 下载安装包，选择 "Developer Default" 安装类型。

关键配置步骤：
- 选择 **MySQL Server 8.0**（不是 8.4）
- Authentication Method: 选择 **"Use Legacy Authentication Method"**
- 设置 root 密码为：**`68562520`**（与项目默认配置一致）
- 确保端口为 **`3306`**

安装完成后，MySQL 会作为 Windows 服务自动运行。

#### 3. 安装 Redis（Memurai）

Redis 官方不支持 Windows，推荐使用 **Memurai**（与 Redis 完全兼容的 Windows 原生替代品，免费用于开发）：

1. 从 [Memurai 官网](https://www.memurai.com/get-memurai) 下载安装包
2. 安装时设置密码为：**`68562520`**
3. 默认端口 **`6379`**，安装完成后自动作为 Windows 服务运行

> 备选方案：如果你已安装 WSL2，也可在 WSL 内 `sudo apt install redis-server` 然后修改 `/etc/redis/redis.conf` 设置 `requirepass 68562520`。

#### 4. 安装 Node.js + pnpm

从 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本（20.x 或更高），安装后打开 PowerShell：

```powershell
npm install -g pnpm
```

#### 5. 安装 Git

从 [Git for Windows](https://git-scm.com/download/win) 下载安装。安装时注意：
- 选择 **"Checkout as-is, commit Unix-style line endings"**（避免换行符问题）
- 其他选项保持默认即可

### 快速启动（所有平台通用）

以下步骤在 macOS、Windows（PowerShell / Git Bash）、Linux 下均可执行。

#### 1. 克隆项目

```bash
git clone https://github.com/mt-obdvlb/StudentLostPropertyPlatform.git
cd StudentLostPropertyPlatform
```

#### 2. 初始化数据库

确保 MySQL 服务已启动，然后执行 SQL 初始化脚本：

**macOS / Linux**：

```bash
mysql -uroot -p68562520 < sql/schema.sql
mysql -uroot -p68562520 < sql/data.sql
```

**Windows（PowerShell）**：

```powershell
Get-Content sql/schema.sql | mysql -uroot -p68562520
Get-Content sql/data.sql | mysql -uroot -p68562520
```

**Windows（Git Bash）**：

```bash
mysql -uroot -p68562520 < sql/schema.sql
mysql -uroot -p68562520 < sql/data.sql
```

> 如果 `mysql` 命令找不到，需要将 MySQL 的 `bin` 目录（通常是 `C:\Program Files\MySQL\MySQL Server 8.0\bin`）添加到系统 PATH 环境变量。

#### 3. 启动 Redis

**macOS**：

```bash
brew services start redis
```

**Windows**：Memurai 安装后自动以服务运行，无需手动启动。如果使用 WSL 内的 Redis，在 WSL 终端中执行 `sudo service redis-server start`。

**Linux**：

```bash
sudo systemctl start redis-server
```

#### 4. 启动后端

```bash
cd backend
mvn spring-boot:run
```

> **Windows 用户推荐**：用 IntelliJ IDEA 打开 `backend/` 目录，等待 Maven 依赖下载完成后直接运行 `LostFoundApplication` 主类，无需手动配置 Maven。

后端启动后访问：http://localhost:8080/swagger-ui/index.html

#### 5. 启动前端

```bash
cd frontend
pnpm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
pnpm dev
```

前端启动后访问：http://localhost:3000

### 环境变量参考

所有配置都有默认值，无需修改即可本地运行。**前提是你的 MySQL 和 Redis 密码与默认值一致**。

如需自定义，可通过环境变量覆盖：

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

> 如果你的 MySQL / Redis 密码与默认值 `68562520` 不同，请在启动后端时设置环境变量：
> ```bash
> # Windows PowerShell 示例
> $env:MYSQL_PASSWORD="你的密码"
> $env:REDIS_PASSWORD="你的密码"
> mvn spring-boot:run
> ```

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
├── docker-compose.yml              # Docker 方式（可选，用于快速搭建 MySQL + Redis）
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
- **Homebrew MySQL 启动**：`brew services start mysql`，首次启动后需设置 root 密码：`mysqladmin -u root password '68562520'`。

### Windows

- **`mysql` 命令找不到**：将 MySQL 的 `bin` 目录（默认 `C:\Program Files\MySQL\MySQL Server 8.0\bin`）添加到系统 PATH 环境变量。右键"此电脑"→ 属性 → 高级系统设置 → 环境变量 → Path → 新建。
- **Maven 找不到命令**：将 Maven 的 `bin` 目录添加到系统 PATH 环境变量。或直接使用 IntelliJ IDEA 打开项目，IDE 内置 Maven 无需额外配置。
- **PowerShell 执行策略限制 `mvn` 命令**：以管理员身份运行 PowerShell，执行 `Set-ExecutionPolicy RemoteSigned`。
- **`pnpm dev` 报错**：确保在 `frontend/` 目录下执行，且已运行 `pnpm install`。如果 `pnpm` 命令找不到，先执行 `npm install -g pnpm`。
- **MySQL 连接失败 (Access denied)**：检查 MySQL 安装时设置的 root 密码是否为 `68562520`。如果密码不同，通过环境变量 `MYSQL_PASSWORD` 覆盖。
- **Redis 连接失败**：Memurai 默认应自动运行。检查任务管理器 → 服务 → 确认 "Memurai" 状态为"正在运行"。
- **Git 换行符问题**：安装 Git for Windows 时选择 "Checkout as-is, commit Unix-style line endings" 即可避免。

### Linux

- **MySQL root 密码**：Ubuntu/Debian 默认通过 `auth_socket` 认证，需先修改密码：`sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '68562520';"`。
- **Redis 密码**：编辑 `/etc/redis/redis.conf`，找到 `# requirepass foobared`，改为 `requirepass 68562520`，然后 `sudo systemctl restart redis-server`。
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