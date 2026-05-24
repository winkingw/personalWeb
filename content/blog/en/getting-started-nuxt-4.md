---
title: Getting Started with Nuxt 4
slug: getting-started-nuxt-4
description: A comprehensive guide to building modern web applications with Nuxt 4 and its powerful features.
date: 2026-05-15
tags:
  - Nuxt
  - Vue.js
  - Web Development
image: /images/blog/nuxt.png
draft: false
published: true
locale: en
---

# Getting Started with Nuxt 4

Nuxt 4 brings a refined developer experience with the new `app/` directory convention, improved performance, and better TypeScript support. In this post, I'll walk through the key changes and how to migrate.

## The New app/ Directory

The most visible change in Nuxt 4 is the `app/` directory. Instead of placing pages, components, and composables at the project root, everything lives under `app/`:

```
app/
├── pages/
├── components/
├── composables/
├── layouts/
├── app.vue
└── error.vue
```

This provides cleaner separation between source code and configuration files.

## Content Management with Nuxt Content v3

Nuxt Content v3 introduces a collection-based architecture with Zod schemas for type-safe content:

```typescript
import { defineCollection, z } from '@nuxt/content'

export const blogSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string().date(),
  tags: z.array(z.string()),
  published: z.boolean(),
})

export const collections = {
  blog: defineCollection({
    source: 'blog/**/*.md',
    type: 'page',
    schema: blogSchema,
  }),
}
```

## SSG with Cloudflare Pages

For static sites, Nuxt's SSG mode with Cloudflare Pages deployment offers zero cold starts, global CDN, and unlimited bandwidth on the free tier.

## Conclusion

Nuxt 4 represents a significant step forward for the Vue.js ecosystem. The new conventions and improved tooling make it an excellent choice for building modern web applications.
