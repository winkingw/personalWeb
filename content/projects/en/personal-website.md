---
title: Personal Website
slug: personal-website
summary: A responsive multi-language personal website built with Nuxt 4, Nuxt Content v3, and deployed to Cloudflare Pages.
date: 2026-05-20
techStack:
  - Nuxt
  - Vue.js
  - TypeScript
  - TailwindCSS
  - Cloudflare Pages
links:
  github: https://github.com
  demo: https://example.com
image: /images/projects/personal-web.png
draft: false
published: true
locale: en
---

# Personal Website

This personal website serves as my digital home on the internet. It showcases my work, hosts my blog, and provides a way to get in touch.

## Key Features

- **Multi-language support** — Chinese (default) and English, with clean URL structure
- **Dark/light theme** — Cookie-based persistence with zero FOUC via inline script
- **Content-driven** — All blog posts, projects, and essays are Markdown files validated with Zod schemas
- **Static generation** — Pre-rendered at build time, served from Cloudflare's global CDN

## Architecture

The site uses the `app/` directory convention with Nuxt 4, separating source code from configuration. Nuxt Content v3 provides type-safe content management.
