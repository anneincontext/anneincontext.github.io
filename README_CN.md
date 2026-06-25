<p align="right">
  <strong>中文</strong> | <a href="https://github.com/anneincontext/anneincontext.github.io/blob/master/README.md">English</a>
</p>

# Anne in Context

这个仓库是一个个人 GitHub Pages 主页和博客系统的源码。它使用 Astro 构建，最终产物是完全静态的 HTML、CSS 和资源文件，通过 GitHub Actions 自动部署到 GitHub Pages。

线上站点：<https://anneincontext.github.io/>

## 这是什么

- 一个托管在 GitHub Pages 上的个人主页和博客。
- 一个中英文双语站点。
- 一个用 Markdown/MDX 写文章的静态博客系统。
- 一个轻量 Astro 项目，构建完成后不需要后端服务。

## 技术栈

- [Astro](https://astro.build/) 7：静态站点生成。
- TypeScript：项目代码和内容配置的类型支持。
- Astro Content Collections：管理博客文章和 frontmatter 元数据。
- GitHub Actions：自动构建和部署。
- GitHub Pages：静态站点托管。
- `public/CNAME`：自定义域名配置。

## 架构说明

这个项目的核心链路是：写 Markdown/MDX，Astro 读取内容并生成页面，构建出 `dist/`，最后由 GitHub Pages 托管。

```text
Markdown/MDX 文章
  -> Astro Content Collections
  -> Astro 页面和布局
  -> npm run build
  -> dist/
  -> GitHub Pages
```

主要目录：

```text
.
├── astro.config.mjs              # Astro 配置，包含站点地址和静态输出
├── package.json                  # npm 脚本和依赖
├── public/
│   ├── CNAME                     # GitHub Pages 自定义域名
│   ├── images/                   # 静态图片
│   └── lib/                      # 静态浏览器库
├── src/
│   ├── content/blog/             # Markdown/MDX 博客文章
│   ├── content.config.ts         # 博客内容集合 schema
│   ├── layouts/                  # 页面和文章布局
│   ├── components/               # 可复用 Astro 组件
│   ├── lib/                      # 文章、语言等辅助函数
│   ├── pages/                    # 文件路由
│   └── styles/global.css         # 全局样式
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署流程
```

## 当前功能

- 使用 `output: 'static'` 生成纯静态站点。
- 英文页面：`/`、`/blog/`、`/about/`、`/podcast/`。
- 中文页面：`/zh/`、`/zh/blog/`、`/zh/about/`、`/zh/podcast/`。
- 博客文章来自 `src/content/blog`。
- 文章详情页由 `src/pages/[...slug].astro` 动态生成。
- `draft: true` 的文章不会出现在生产构建中。
- RSS：`/rss.xml`。
- Sitemap：`/sitemap.xml`。
- 支持浅色/深色主题切换，并保存到浏览器本地。
- 支持中英文语言切换和浏览器语言偏好辅助跳转。
- 自定义 404 页面。

## 如何写文章

在 `src/content/blog/` 下新增 `.md` 或 `.mdx` 文件。

示例：

```md
---
title: '我的新文章'
description: '用于 SEO、RSS 和列表展示的简短摘要。'
date: 2026-06-26
lang: zh
category: '前端工程'
tags: ['Astro', 'GitHub Pages']
postType: professional
draft: false
---

这里开始写正文。
```

支持的 frontmatter 字段：

- `title`：文章标题。
- `description`：文章摘要。
- `date`：发布日期。
- `lang`：`en` 或 `zh`。
- `tags`：标签列表。
- `category`：文章分类，默认是 `Notes`。
- `postType`：`professional` 或 `personal`。
- `draft`：设为 `true` 时不发布。
- `legacyPath`：可选自定义路径，适合保留旧链接。

默认文章路径：

- 英文文章：`/blog/<post-id>/`
- 中文文章：`/zh/blog/<post-id>/`

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建静态站点：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

`npm run build` 会先执行 `astro check`，再生成 `dist/` 静态产物。

## 部署方式

部署流程在 `.github/workflows/deploy.yml`。

每次 push 到 `master` 分支时，GitHub Actions 会：

1. 拉取仓库代码。
2. 使用 Node.js 22。
3. 通过 `npm ci` 安装依赖。
4. 执行 `npm run build`。
5. 上传 `dist/` 作为 GitHub Pages artifact。
6. 部署到 GitHub Pages。

如果使用自定义域名，把域名写入 `public/CNAME`。如果只使用 GitHub Pages 默认域名，可以删除 `public/CNAME`。

## 如果你也想搭一个一样的

1. 创建 GitHub 仓库。
   - 如果是用户或组织主页，仓库名建议使用 `<username>.github.io`。
   - 如果是项目站点，仓库名可以自定义，但可能需要配置 Astro 的 `base`。

2. 创建 Astro 项目。

   ```bash
   npm create astro@latest
   ```

3. 加入博客内容系统。
   - 把文章放到 `src/content/blog/`。
   - 在 `src/content.config.ts` 定义文章 frontmatter schema。
   - 用 `getCollection()` 读取文章列表。

4. 创建页面路由。
   - 普通页面放在 `src/pages/`。
   - 文章详情可以用类似 `src/pages/[...slug].astro` 的动态路由生成。
   - 如果要做双语，可以添加 `src/pages/zh/` 这样的语言目录。

5. 配置 Astro 静态输出。

   ```js
   // astro.config.mjs
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://your-domain.example',
     output: 'static',
   });
   ```

6. 配置 GitHub Pages 自动部署。
   - 复制或参考本项目的 `.github/workflows/deploy.yml`。
   - 在 GitHub 仓库设置里，把 Pages 的 source 设置为 GitHub Actions。
   - push 到配置好的分支后自动部署。

7. 可选：配置自定义域名。
   - 在 `public/CNAME` 写入你的域名。
   - 到域名服务商那里配置 DNS。
   - 在 GitHub Pages 设置里填写同一个自定义域名。

## 如果直接 fork 这个仓库

发布前建议先改这些地方：

- `astro.config.mjs`：把 `site` 改成你的域名。
- `public/CNAME`：改成你的自定义域名；如果不用自定义域名，就删除它。
- `src/lib/locales.ts`：改站点文案、社交链接、语言标签。
- `src/components/AboutContent.astro`：改个人介绍。
- `src/components/PodcastContent.astro`：改播客内容。
- `src/content/blog/`：替换成你自己的文章。
- `.github/workflows/deploy.yml`：如果不用 `master` 分支，修改触发分支。

## 许可证

- 代码：MIT。
- 文章和图片：版权所有（All Rights Reserved）。
