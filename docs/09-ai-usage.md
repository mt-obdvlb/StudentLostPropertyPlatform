# AI 辅助开发说明

## 使用范围

本项目允许使用 AI 辅助进行：

- 需求拆分。
- 架构规划。
- 数据库设计。
- REST API 设计。
- 前后端目录结构规划。
- 测试用例设计。
- 后端编码、错误排查、SQL 初始化和文档整理。

## 当前使用情况

Codex 根据课程大作业要求和固定技术栈生成或维护了以下交付物：

- `README.md`
- `backend/`
- `backend/README.md`
- `docs/00-phase-1-plan.md`
- `docs/01-requirements.md`
- `docs/02-architecture.md`
- `docs/03-database-design.md`
- `docs/04-api-design.md`
- `docs/backend-architecture.md`
- `docs/database-design.md`
- `docs/api-design.md`
- `docs/test-cases.md`
- `docs/05-frontend-design.md`
- `docs/06-backend-design.md`
- `docs/07-test-cases.md`
- `docs/08-deployment.md`
- `sql/schema.sql`
- `sql/data.sql`
- `docker-compose.yml`

## 人工确认点

提交前需要人工确认：

1. 课程题目确认为“校园失物招领管理系统”。
2. 技术栈确认为 Next.js + Spring Boot。
3. 核心业务流程确认为发布、认领申请、管理员审核、自动过期、重复检测。
4. 当前数据库表和接口是否满足课程要求。
5. 页面、接口和演示流程是否适合课程验收。

## 使用边界

- AI 生成内容必须经过运行、测试和人工确认。
- 编码不能只停留在伪代码。
- 不得泄露真实账号、密钥、隐私数据。
- 课程提交时应保留本说明，说明 AI 主要用于辅助规划和开发。
