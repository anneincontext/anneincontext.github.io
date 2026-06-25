<p align="right">
  <strong>English</strong> | <a href="https://github.com/anneincontext/anneincontext.github.io/blob/master/README_CN.md">中文</a>
</p>

# Anne in Context

This repository is the source code for a personal GitHub Pages site and blog. It is built with Astro, outputs fully static files, and is deployed to GitHub Pages through GitHub Actions.

Production site: <https://anneincontext.github.io/>

## What This Site Is

- A personal homepage and blog hosted on GitHub Pages.
- A bilingual site with English and Chinese routes.
- A static blog system powered by Markdown/MDX content files.
- A lightweight Astro project with no backend server required after build.

## Tech Stack

- [Astro](https://astro.build/) 7 for static site generation.
- TypeScript for typed project code and Astro content config.
- Astro Content Collections for blog metadata and Markdown/MDX loading.
- GitHub Actions for CI build and GitHub Pages deployment.
- GitHub Pages for hosting.
- Custom domain support through `public/CNAME`.

## Architecture

The site is generated as static HTML, CSS, and assets.

```text
Markdown/MDX posts
  -> Astro Content Collections
  -> Astro pages and layouts
  -> npm run build
  -> dist/
  -> GitHub Pages
```

Important files and folders:

```text
.
├── astro.config.mjs              # Astro config, site URL, static output
├── package.json                  # npm scripts and dependencies
├── public/
│   ├── CNAME                     # Custom domain for GitHub Pages
│   ├── images/                   # Static images
│   └── lib/                      # Static browser libraries
├── src/
│   ├── content/blog/             # Blog posts in Markdown/MDX
│   ├── content.config.ts         # Blog collection schema
│   ├── layouts/                  # Shared page and post layouts
│   ├── components/               # Reusable Astro components
│   ├── lib/                      # Post and locale helpers
│   ├── pages/                    # File-based routes
│   └── styles/global.css         # Global styles
└── .github/workflows/deploy.yml  # GitHub Pages deployment workflow
```

## Features

- Static output via `output: 'static'`.
- English routes under `/`, `/blog/`, `/about/`, `/podcast/`.
- Chinese routes under `/zh/`, `/zh/blog/`, `/zh/about/`, `/zh/podcast/`.
- Blog posts generated from `src/content/blog`.
- Dynamic post routes handled by `src/pages/[...slug].astro`.
- Draft posts excluded from production listings and generated pages.
- RSS feed at `/rss.xml`.
- Sitemap at `/sitemap.xml`.
- Light/dark theme toggle with local browser preference.
- Language preference helper for English/Chinese navigation.
- Custom 404 page.

## Blog Post Format

Create a new `.md` or `.mdx` file in `src/content/blog/`.

Example:

```md
---
title: 'My New Post'
description: 'A short summary for SEO, RSS, and previews.'
date: 2026-06-26
lang: en
category: 'Notes'
tags: ['Astro', 'GitHub Pages']
postType: professional
draft: false
---

Write the post here.
```

Supported frontmatter fields:

- `title`: post title.
- `description`: short description.
- `date`: publish date.
- `lang`: `en` or `zh`.
- `tags`: list of tags.
- `category`: post category, default is `Notes`.
- `postType`: `professional` or `personal`.
- `draft`: set to `true` to hide the post from the built site.
- `legacyPath`: optional custom path, useful when preserving old URLs.

Default post URLs:

- English post: `/blog/<post-id>/`
- Chinese post: `/zh/blog/<post-id>/`

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The build command runs `astro check` first, then writes the static output to `dist/`.

## Deployment

Deployment is handled by `.github/workflows/deploy.yml`.

On every push to the `master` branch, GitHub Actions:

1. Checks out the repository.
2. Uses Node.js 22.
3. Installs dependencies with `npm ci`.
4. Runs `npm run build`.
5. Uploads `dist/` as a GitHub Pages artifact.
6. Deploys the artifact to GitHub Pages.

If you use a custom domain, put that domain in `public/CNAME`. Remove `public/CNAME` if you only want to use the default GitHub Pages domain.

## How To Build A Similar Site

1. Create a GitHub repository.
   - For a user or organization site, name it `<username>.github.io`.
   - For a project site, any repository name works, but you may need to configure Astro `base`.

2. Create an Astro project.

   ```bash
   npm create astro@latest
   ```

3. Add blog content support.
   - Put posts in `src/content/blog/`.
   - Define the collection schema in `src/content.config.ts`.
   - Use `getCollection()` to load posts.

4. Create routes.
   - Add static pages in `src/pages/`.
   - Add a dynamic post route like `src/pages/[...slug].astro`.
   - Add language-specific folders if you want bilingual routes, such as `src/pages/zh/`.

5. Configure Astro for static hosting.

   ```js
   // astro.config.mjs
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://your-domain.example',
     output: 'static',
   });
   ```

6. Add GitHub Pages deployment.
   - Copy or adapt `.github/workflows/deploy.yml`.
   - In GitHub repository settings, set Pages source to GitHub Actions.
   - Push to the configured branch.

7. Optional: add a custom domain.
   - Put the domain in `public/CNAME`.
   - Configure DNS with your domain provider.
   - Set the same custom domain in GitHub Pages settings.

## Notes For Forking

If you fork this repository directly, update these before publishing:

- `astro.config.mjs`: change `site`.
- `public/CNAME`: change or remove the custom domain.
- `src/lib/locales.ts`: update site text, social links, and language labels.
- `src/components/AboutContent.astro`: update personal introduction.
- `src/components/PodcastContent.astro`: update podcast content.
- `src/content/blog/`: replace posts with your own writing.
- `.github/workflows/deploy.yml`: change the deploy branch if you do not use `master`.

## License

- Code: MIT.
- Articles and images: All Rights Reserved.
