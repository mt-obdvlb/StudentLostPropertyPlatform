# 校园失物招领管理系统

Web 应用开发课程大作业。系统提供用户注册登录、失物/拾物发布、认领申请、管理员审核、通知推送、过期处理等功能。

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 后端 | Java 17, Spring Boot 3.3.5, Spring Security, JWT, MyBatis-Plus, Maven |
| 前端 | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, pnpm |
| 数据 | MySQL 8.x, Redis 7.x |
| 文档 | Swagger UI / OpenAPI |

## 项目结构

```text
StudentLostPropertyPlatform/
├── backend/                    # Spring Boot 后端服务
│   ├── src/main/resources/
│   │   └── application.yml      # 后端主配置，可用环境变量覆盖
│   ├── pom.xml
│   └── README.md
├── frontend/                   # Next.js 前端应用
│   ├── .env.example             # 前端环境变量样例
│   ├── package.json
│   └── src/
├── sql/
│   ├── schema.sql               # 建库建表脚本
│   └── data.sql                 # 初始化测试数据
├── docs/                        # 需求、设计、测试、部署文档
├── docker-compose.yml           # Docker 方式启动 MySQL + Redis
└── README.md
```

## 启动方式选择

| 方式 | 适用场景 | 启动内容 |
| --- | --- | --- |
| Docker 依赖服务 + 本地前后端 | 推荐开发方式，不污染本机 MySQL / Redis | Docker 启动 MySQL 和 Redis，本机启动后端和前端 |
| 完全本地启动 | 已安装本机 MySQL / Redis | 本机启动 MySQL、Redis、后端、前端 |

> 当前 `docker-compose.yml` 只编排 MySQL 和 Redis，前端、后端仍按开发模式在本机启动。

## 前置依赖

| 工具 | 推荐版本 | macOS | Windows | Linux |
| --- | --- | --- | --- | --- |
| JDK | 17 | `brew install openjdk@17` | 安装 [Adoptium Temurin 17](https://adoptium.net/) 或 Oracle JDK 17 | `sudo apt install openjdk-17-jdk` |
| Maven | 3.9+ | `brew install maven` | 安装 [Maven](https://maven.apache.org/download.cgi) 并配置 `PATH`，或使用 IntelliJ IDEA 内置 Maven | `sudo apt install maven` |
| Node.js | 20+ | `brew install node` 或 `nvm` | 安装 Node.js LTS，或使用 `nvm-windows` | `nvm` 或系统包管理器 |
| pnpm | 10+ | `corepack enable` 或 `npm install -g pnpm` | `corepack enable` 或 `npm install -g pnpm` | `corepack enable` 或 `npm install -g pnpm` |
| Docker Desktop | 最新稳定版 | 安装 Docker Desktop for Mac | 安装 Docker Desktop for Windows，并启用 WSL2 后端 | 安装 Docker Engine / Docker Desktop |
| MySQL | 8.x | `brew install mysql` | MySQL Installer for Windows | `sudo apt install mysql-server` |
| Redis | 7.x | `brew install redis` | 推荐 Docker / WSL2 / Memurai | `sudo apt install redis-server` |

macOS 常用安装命令：

```bash
brew install openjdk@17 maven node pnpm
```

Windows 建议：

- 使用 PowerShell 或 Git Bash 执行项目命令。
- 安装 JDK 时确认 `JAVA_HOME` 已配置到 JDK 17。
- 安装 Maven、Node.js 后重新打开终端，确认 `java -version`、`mvn -version`、`node -v`、`pnpm -v` 可用。
- Docker 方式开发时，优先用 Docker Desktop 启动 MySQL / Redis，避免单独安装 Windows 原生 Redis。

Linux 可按发行版选择包管理器，Ubuntu / Debian 示例：

```bash
sudo apt update
sudo apt install openjdk-17-jdk maven nodejs npm mysql-server redis-server
npm install -g pnpm
```

如果采用 Docker 依赖服务，还需要安装并启动 Docker Desktop。

## 配置文件说明

### 后端配置

后端主配置文件：

```text
backend/src/main/resources/application.yml
```

如果你不想把本机 MySQL / Redis 密码改成项目默认的 `68562520`，需要修改这个文件中的连接配置，或在启动后端时用环境变量覆盖。需要关注的配置位置是：

```yaml
spring:
  datasource:
    url: ${MYSQL_URL:jdbc:mysql://localhost:3306/lost_found?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false}
    username: ${MYSQL_USERNAME:root}
    password: ${MYSQL_PASSWORD:68562520}
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:68562520}
      database: ${REDIS_DATABASE:0}
```

推荐优先用环境变量覆盖，避免把个人本机密码写进仓库文件：

```bash
cd backend
MYSQL_PASSWORD="你的 MySQL 密码" REDIS_PASSWORD="你的 Redis 密码" mvn spring-boot:run
```

如果是课程作业或本机单人开发，也可以直接修改 `backend/src/main/resources/application.yml` 里的默认值。

常用环境变量如下，未设置时使用默认值：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `SERVER_PORT` | `8080` | 后端服务端口 |
| `MYSQL_URL` | `jdbc:mysql://localhost:3306/lost_found?...` | MySQL JDBC 地址 |
| `MYSQL_USERNAME` | `root` | MySQL 用户名 |
| `MYSQL_PASSWORD` | `68562520` | MySQL 密码 |
| `REDIS_HOST` | `localhost` | Redis 主机 |
| `REDIS_PORT` | `6379` | Redis 端口 |
| `REDIS_PASSWORD` | `68562520` | Redis 密码 |
| `REDIS_DATABASE` | `0` | Redis 数据库编号 |
| `JWT_SECRET` | `lost-found-platform-jwt-secret-at-least-32-bytes-long` | JWT 签名密钥 |
| `JWT_EXPIRATION` | `86400000` | JWT 过期时间，单位毫秒 |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | 允许访问后端的前端地址 |

### 前端配置

前端配置样例文件：

```text
frontend/.env.example
```

本地开发时复制为：

```bash
cp frontend/.env.example frontend/.env.local
```

可配置项：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api` | 浏览器访问后端 API 的地址 |

### 数据库脚本

| 文件 | 说明 |
| --- | --- |
| `sql/schema.sql` | 创建 `lost_found` 数据库和业务表 |
| `sql/data.sql` | 初始化测试用户和演示数据 |

Docker 首次启动 MySQL 容器时会自动执行这两个脚本。若 MySQL 数据卷已经存在，脚本不会重复执行；需要重新初始化时先删除数据卷。

## 方式一：Docker 依赖服务 + 本地前后端开发

这是推荐的开发启动方式。

### 1. 启动 MySQL 和 Redis

在项目根目录执行：

```bash
docker compose up -d
```

确认容器状态：

```bash
docker compose ps
```

默认会启动：

| 服务 | 容器名 | 端口 | 账号 / 密码 |
| --- | --- | --- | --- |
| MySQL | `lost-found-mysql` | `3306` | `root` / `68562520` |
| Redis | `lost-found-redis` | `6379` | 密码 `68562520` |

如果需要重置数据库：

```bash
docker compose down -v
docker compose up -d
```

### 2. 启动后端

```bash
cd backend
mvn spring-boot:run
```

macOS 如需强制使用 JDK 17：

```bash
cd backend
JAVA_HOME=$(/usr/libexec/java_home -v 17) mvn spring-boot:run
```

后端启动成功后访问：

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### 3. 启动前端

另开一个终端：

```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

Windows PowerShell 中复制 env 文件可用：

```powershell
cd frontend
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

前端访问地址：

```text
http://localhost:3000
```

## 方式二：完全本地启动

如果不使用 Docker，需要本机自行启动 MySQL 和 Redis，并保证账号、密码、端口与后端配置一致。

### 1. 初始化 MySQL

确保 MySQL 正在运行后，在项目根目录执行：

```bash
mysql -uroot -p68562520 < sql/schema.sql
mysql -uroot -p68562520 < sql/data.sql
```

Windows PowerShell 不推荐使用 `<` 重定向，可用：

```powershell
Get-Content sql/schema.sql | mysql -uroot -p68562520
Get-Content sql/data.sql | mysql -uroot -p68562520
```

如果你的 MySQL 密码不是 `68562520`，可以初始化时使用自己的密码，并在启动后端时覆盖环境变量，或直接修改 `backend/src/main/resources/application.yml` 中的 `spring.datasource.password` 默认值：

```bash
MYSQL_PASSWORD="你的密码" mvn spring-boot:run
```

Windows PowerShell 对应写法：

```powershell
$env:MYSQL_PASSWORD="你的密码"
mvn spring-boot:run
```

### 2. 启动 Redis

macOS：

```bash
brew services start redis
```

Linux：

```bash
sudo systemctl start redis-server
```

Windows 原生 Redis 可使用 Memurai，或在 WSL2 中启动 Redis。

如果 Redis 没有设置密码，需要启动后端时覆盖为空值，或直接修改 `backend/src/main/resources/application.yml` 中的 `spring.data.redis.password` 默认值：

```bash
REDIS_PASSWORD="" mvn spring-boot:run
```

Windows PowerShell 对应写法：

```powershell
$env:REDIS_PASSWORD=""
mvn spring-boot:run
```

### 3. 启动后端和前端

后端：

```bash
cd backend
mvn spring-boot:run
```

前端：

```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

Windows PowerShell：

```powershell
cd frontend
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

## 跨端访问配置

默认配置适合本机浏览器访问：

```text
前端: http://localhost:3000
后端: http://localhost:8080
API:  http://localhost:8080/api
```

如果要从手机、平板或局域网其他电脑访问，需要把 `localhost` 改成开发机局域网 IP。

假设开发机 IP 是 `192.168.1.10`：

前端 `frontend/.env.local`：

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.10:8080/api
```

后端启动时允许该前端来源：

```bash
cd backend
CORS_ALLOWED_ORIGINS="http://192.168.1.10:3000,http://localhost:3000,http://127.0.0.1:3000" mvn spring-boot:run
```

Windows PowerShell：

```powershell
cd backend
$env:CORS_ALLOWED_ORIGINS="http://192.168.1.10:3000,http://localhost:3000,http://127.0.0.1:3000"
mvn spring-boot:run
```

然后在其他设备访问：

```text
http://192.168.1.10:3000
```

## 常用开发命令

### Docker

```bash
docker compose up -d      # 启动 MySQL + Redis
docker compose ps         # 查看服务状态
docker compose logs -f    # 查看日志
docker compose down       # 停止服务，保留数据卷
docker compose down -v    # 停止服务并删除数据卷
```

### 后端

```bash
cd backend
mvn spring-boot:run       # 启动开发服务
mvn test                  # 运行测试
mvn package               # 打包 jar
```

### 前端

```bash
cd frontend
pnpm install              # 安装依赖
pnpm dev                  # 启动开发服务
pnpm lint                 # ESLint 检查
pnpm build                # 生产构建
pnpm start                # 启动生产构建
```

## 测试账号

| 角色 | 用户名 | 密码 |
| --- | --- | --- |
| 管理员 | `admin` | `admin123456` |
| 普通用户 | `user1` | `user123456` |
| 普通用户 | `user2` | `user123456` |

## 核心功能

- 用户注册、登录、JWT 认证
- 发布失物 / 拾物信息
- 信息搜索、筛选、分页、排序
- 拾物认领申请
- 发布前重复信息检测
- 管理员审核认领申请
- 管理员下架物品、用户管理、操作日志
- 通知推送
- 定时任务自动处理过期物品

## 验证入口

启动完成后按顺序检查：

1. `docker compose ps` 中 MySQL 和 Redis 为健康或运行状态。
2. `http://localhost:8080/swagger-ui/index.html` 能打开 Swagger UI。
3. `http://localhost:3000` 能打开前端页面。
4. 使用测试账号 `admin / admin123456` 或 `user1 / user123456` 登录。

## 常见问题

### MySQL 连接失败

检查 `MYSQL_URL`、`MYSQL_USERNAME`、`MYSQL_PASSWORD` 是否与实际 MySQL 一致。Docker 方式默认是：

```text
jdbc:mysql://localhost:3306/lost_found
root / 68562520
```

### Redis 连接失败

检查 Redis 是否运行，密码是否为 `68562520`。Docker 方式可用：

```bash
docker compose logs redis
```

### 数据没有初始化

Docker 只会在 MySQL 数据卷第一次创建时执行 `sql/schema.sql` 和 `sql/data.sql`。如需重建：

```bash
docker compose down -v
docker compose up -d
```

### 前端请求后端失败

检查 `frontend/.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL` 是否指向真实后端地址。如果是手机或局域网设备访问，不能使用 `localhost`，需要改为开发机 IP。

### 端口被占用

默认端口如下：

| 服务 | 端口 |
| --- | --- |
| 前端 | `3000` |
| 后端 | `8080` |
| MySQL | `3306` |
| Redis | `6379` |

macOS / Linux 可用以下命令查看占用：

```bash
lsof -i :3000
lsof -i :8080
lsof -i :3306
lsof -i :6379
```

Windows PowerShell 可用：

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306
netstat -ano | findstr :6379
```

### Windows 常见问题

- `mysql` 命令找不到：把 MySQL 的 `bin` 目录加入系统 `Path`，常见路径是 `C:\Program Files\MySQL\MySQL Server 8.0\bin`。
- `mvn` 命令找不到：把 Maven 的 `bin` 目录加入系统 `Path`，或用 IntelliJ IDEA 打开 `backend/` 后直接运行 `LostFoundApplication`。
- `JAVA_HOME` 不正确：确认 `JAVA_HOME` 指向 JDK 17，而不是 JRE 或其它 JDK 版本。
- PowerShell 不能使用 `< sql/schema.sql`：改用 `Get-Content sql/schema.sql | mysql -uroot -p68562520`。
- Redis 原生安装麻烦：优先用本项目 Docker Compose 启动 Redis，或使用 WSL2 / Memurai。

## 更多文档

- [后端运行说明](backend/README.md)
- [前端运行说明](frontend/README.md)
- [需求分析](docs/01-requirements.md)
- [系统架构](docs/02-architecture.md)
- [数据库设计](docs/03-database-design.md)
- [API 设计](docs/04-api-design.md)
- [前端设计](docs/05-frontend-design.md)
- [后端设计](docs/06-backend-design.md)
- [测试用例](docs/07-test-cases.md)
- [部署说明](docs/08-deployment.md)
- [AI 使用说明](docs/09-ai-usage.md)
