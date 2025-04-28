# 部署与启动指南

本文档介绍如何设置、运行和部署基于 Nuxt.js 和 Supabase 的点子记录网站。

## 1. 环境准备

*   **Node.js:** 确保已安装 Node.js (推荐 LTS 版本)。
*   **pnpm:** 本项目使用 pnpm 作为包管理器。如果未安装，请运行 `npm install -g pnpm`。
*   **Supabase 账户:** 需要一个 Supabase 项目来获取 API URL 和 Key。
    *   访问 [supabase.com](https://supabase.com/) 并创建一个新项目。
    *   在项目中设置数据库表 (例如 `ideas`, `comments`, `likes`)。
    *   启用 GitHub (或其他) 认证提供商，并配置回调 URL (通常是 `http://localhost:3000/confirm` 用于本地开发，以及部署后的 URL)。
    *   创建一个名为 `idea-images` 的存储桶 (Bucket) 用于存放图片，并设置相应的访问策略 (例如，允许登录用户上传，允许公共读取)。

## 2. 本地开发

1.  **克隆仓库 (如果需要):**
    ```bash
    git clone <your-repo-url>
    cd Idea/src
    ```

2.  **安装依赖:**
    ```bash
    cd /Users/nsaviour/Project/WebProject/Idea/src
    pnpm install
    ```

3.  **配置环境变量:**
    *   复制 `.env.example` 文件并重命名为 `.env`:
      ```bash
      cp .env.example .env
      ```
    *   编辑 `.env` 文件，填入你的 Supabase 项目 URL 和 Anon Key:
      ```dotenv
      SUPABASE_URL="YOUR_SUPABASE_URL"
      SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
      ```
      你可以在 Supabase 项目的 `Settings` -> `API` 中找到这些值。

4.  **运行开发服务器:**
    ```bash
    pnpm run dev
    ```
    应用将在 `http://localhost:3000` (或指定的端口) 上运行。

## 3. 构建生产版本

```bash
cd /Users/nsaviour/Project/WebProject/Idea/src
pnpm run build
```

这将生成优化后的静态文件或服务器构建产物到 `.output` 目录。

## 4. 部署

部署 Nuxt.js 应用有多种方式，取决于你的渲染模式 (SSR, SSG, Hybrid)。

*   **推荐平台:** Vercel, Netlify, Cloudflare Pages 对 Nuxt.js 支持良好。

*   **通用步骤:**
    1.  将代码推送到 Git 仓库 (GitHub, GitLab, Bitbucket)。
    2.  在部署平台连接你的 Git 仓库。
    3.  配置构建命令: `pnpm run build`。
    4.  配置输出目录: `.output/public` (对于静态托管) 或让平台自动检测。
    5.  **配置环境变量:** 在部署平台的设置中添加 `SUPABASE_URL` 和 `SUPABASE_KEY`。
    6.  **配置 Supabase 回调 URL:** 确保 Supabase Auth 设置中包含了你部署后的域名下的 `/confirm` 回调 URL。

*   **示例 (Vercel):**
    *   导入 Git 仓库。
    *   Vercel 通常会自动检测 Nuxt.js 并配置正确的构建设置。
    *   在 Vercel 项目设置中添加环境变量。
    *   部署。

## 5. Supabase 数据库和存储设置 (提醒)

*   **数据库表:**
    *   `ideas`: `id` (uuid, primary key), `user_id` (uuid, foreign key to auth.users), `title` (text), `description` (text), `image_urls` (text[] or jsonb), `created_at` (timestampz)
    *   `comments`: `id`, `user_id`, `idea_id` (foreign key to ideas), `content` (text), `created_at`
    *   `likes`: `user_id`, `idea_id` (composite primary key), `created_at`
    *   确保为 `user_id` 和 `idea_id` 设置了外键约束。
    *   根据需要为表启用 RLS (Row Level Security) 策略，以控制数据访问权限。
*   **存储桶 (`idea-images`):**
    *   设置为公开 (Public) 或根据需要配置访问策略。
    *   例如，允许已认证用户上传 (`insert`)，允许任何人读取 (`select`)。

