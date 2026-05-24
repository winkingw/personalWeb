# Personal Website — Project Guide

## Global Goal

Build a responsive, multi-language personal website and deploy it to a public URL where it can be accessed online.

**Site sections:**
- **Home** (`/`) — landing page: hero, skills, experience timeline, featured projects
- **About** (`/about`) — long-form personal bio, education, work history (separate from Home)
- **Blog** — technical articles (Markdown via Nuxt Content)
- **Portfolio** — project showcase with tech stack and screenshots
- **Essays (随笔)** — personal essays and musings
- **Contact** — contact form + social links

**Tech stack:** Nuxt (latest stable, Vue 3 + TypeScript) → Cloudflare Pages.
**Languages:** Chinese (primary/default), English (secondary under `/en/`).

---

## Project Status

**Plan status:** `plan1.md` ready, `fullplan.md` complete, `orchestrator.md` complete.

**Implementation status:** All 12 phases **complete**. Ready for deployment.

| Phase | Plan | Implemented |
|-------|------|-------------|
| 1 | `plan1.md` ✅ | ✅ completed 2026-05-22 |
| 2 | `plan2.md` (draft) | ✅ completed 2026-05-22 |
| 3 | `plan3.md` (draft) | ✅ completed 2026-05-22 |
| 4 | `plan4.md` (draft) | ✅ completed 2026-05-22 |
| 5 | `plan5.md` (draft) | ✅ completed 2026-05-22 |
| 6 | `plan6.md` (draft) | ✅ completed 2026-05-22 |
| 7 | `plan7.md` (draft) | ✅ completed 2026-05-22 |
| 8 | `plan8.md` (draft) | ✅ completed 2026-05-23 |
| 9 | `plan9.md` (draft) | ✅ completed 2026-05-23 |
| 10 | `plan10.md` (draft) | ✅ completed 2026-05-23 |
| 11 | `plan11.md` (draft) | ✅ completed 2026-05-23 |
| 12 | `plan12.md` (draft) | ✅ completed 2026-05-23 |

After completing a phase: run quality gates, mark the phase ✅ here, advance `Implementation status` to next phase.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Nuxt (latest stable) with `app/` dir | Clean separation of source from config |
| Content | Nuxt Content v3 (MD + Zod) | Build-time, version-controlled, no CMS needed |
| Styling | TailwindCSS + Nuxt UI v3+ (Reka UI) | Accessible primitives, class-based dark mode |
| Theme | `@nuxtjs/color-mode` + cookie + FOUC script | Zero flash on theme switch |
| i18n | `@nuxtjs/i18n` `prefix_except_default` | Chinese default (no prefix), English at `/en/` |
| Rendering | SSG via `nuxi generate` | Best perf for static content; hybrid API for contact |
| Contact API | Nitro server route (→ CF Pages Function) | Serverless, test via `nuxi dev` |
| Images | `@nuxt/image` with SSG-compatible provider/config | Verify against the installed version during Phase 1; do not hard-code outdated provider assumptions |
| Search | Fuse.js client-side | <100 posts, fuzzy search on title/tags, zero infra |
| Testing | Vitest + @nuxt/test-utils | Component render tests + composable logic tests |
| Deploy | Cloudflare Pages via GitHub Actions | Free tier, global CDN |
| SEO | `useSeo()` composable + `@nuxtjs/sitemap` + `nuxt-og-image` | Per-page OG/Twitter meta, canonical URLs, auto-sitemap with i18n hreflang |
| Sitemap | `@nuxtjs/sitemap` v8 with `autoI18n: true` | Generates per-locale sitemaps with hreflang alternates |
| OG Images | `nuxt-og-image` v6 with takumi renderer | Requires `@takumi-rs/core`; generates OG images at build time via SSR prerender |

---

## Project File Structure

```
personalWeb/
├── app/                    # Source code (`app/` directory convention)
│   ├── assets/             # CSS, images (processed by build)
│   ├── components/
│   │   ├── ui/             # Shared primitives (UiButton, UiCard, etc.)
│   │   ├── blog/           # Blog-specific components
│   │   ├── project/        # Project/portfolio components
│   │   ├── essay/          # Essay components
│   │   ├── home/           # Home page sections
│   │   ├── contact/        # Contact form components
│   │   └── core/           # Layout, nav, header, footer
│   ├── composables/        # Auto-imported logic (useContent, useTheme, useSeo, etc.)
│   ├── layouts/            # default.vue, blog.vue
│   ├── pages/              # File-based routing
│   ├── utils/              # constants.ts, date.ts
│   ├── app.vue             # Root component
│   └── error.vue           # Error page
├── content/                # Markdown content files
│   ├── blog/{zh,en}/
│   ├── essays/{zh,en}/
│   ├── projects/{zh,en}/
│   └── about/{zh,en}.md
├── i18n/locales/           # i18n JSON translation strings (zh.json, en.json)
├── server/api/             # Nitro server routes (compiled to CF Pages Functions)
├── public/                 # Static files (favicon, robots.txt)
├── content.config.ts       # Content collections + Zod schemas
├── app.config.ts           # Runtime site metadata (name, description, links)
├── nuxt.config.ts          # Nuxt module & build config
├── vitest.config.ts        # Vitest configuration
├── wrangler.toml           # Cloudflare Pages config
├── fullplan.md             # Complete 12-phase plan
├── plan1.md                # Phase 1 detailed plan
└── package.json
```

---

## Coding Conventions

- All source code in `app/` directory
- Components: `Domain/PascalCase.vue` (e.g. `blog/BlogPostCard.vue`)
- Composables in `app/composables/` — Nuxt auto-imports them
- Content queries go through `app/composables/useContent.ts` wrappers
- Always filter content collections by locale: `.where('locale', '=', currentLocale)`
- TypeScript strict mode; content types derived from Zod schemas via `z.infer<>` in `content.config.ts`
- Shared types for non-content interfaces (contact form, etc.) in `shared/types/`
- Site metadata (name, description, social links) in `app.config.ts` (runtime config)
- SEO metadata via `useSeo()` composable wrapping `useHead()` with OG/Twitter/canonical tags
- Shared constants (pagination, breakpoints, social URLs) in `app/utils/constants.ts`
- UI primitives in `app/components/ui/` (UiButton, UiCard, UiBadge, UiSection, etc.)
- Keep development environments isolated and reproducible: use environment managers where applicable (Corepack/pnpm for Node, Conda for Python tooling, Docker for services/databases); avoid unmanaged global installs except required CLI prerequisites.

---

## Key Nuxt Content v3 API

```typescript
// Collection definition (in content.config.ts)
defineCollection({
  source: 'blog/**/*.md',
  type: 'page',
  schema: z.object({ /* Zod validation */ })
})

// Build-time computed fields: use nuxt.config.ts hooks, NOT collection.transform()
export default defineNuxtConfig({
  hooks: {
    'content:file:afterParse'(ctx) {
      const contentPath = String(ctx.content?.path || '')
      if (!contentPath.startsWith('/blog/') && !contentPath.startsWith('/essays/')) return
      const body = typeof ctx.file?.body === 'string' ? ctx.file.body : ''
      const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
      ctx.content.wordCount = wordCount
      ctx.content.readingTime = Math.max(1, Math.ceil(wordCount / 300))
    }
  }
})

// Query builder
queryCollection(name)
  .path(path)              // Filter by exact content path (includes locale dir: /blog/zh/xxx)
  .where(field, op, value) // SQL-style filter
  .order(field, 'ASC'|'DESC')
  .all()                   // Execute → array
  .first()                 // Execute → single item

// Vue component for rendering MD/MDC
<ContentRenderer :value="doc" />
```

**⚠️ Detail page lookup:** content files live at paths like `/blog/zh/my-post` (locale in directory). URL routes are `/blog/my-post` (zh) and `/en/blog/my-post` (en). Use `slug` in frontmatter + `.where('slug', '=', slug).where('locale', '=', locale).first()` — NOT `.path(slug)`.

**Content workflow:** Posts use `draft: true` (not ready) and `published: true` (live). Queries filter `.where('published', '=', true)` to only show live posts. `draft: true` + `published: false` = work in progress, hidden on site.

---

## Collaboration Workflow

### Development: Orchestrator + Sub-agents

Use the **orchestrator pattern** defined in `orchestrator.md`. A single master agent:
1. Reads `orchestrator.md` → `fullplan.md` → `CLAUDE.md`
2. Dispatches sub-agents via `claude --dangerously-skip-permissions --print` for each task
3. Reviews output, runs quality gates (`pnpm dev`, `pnpm test`, `nuxi generate`)
4. Marks phases complete, updates the `CLAUDE.md` Implementation status table

**To start:** Open a Claude CLI in this directory and say "Read orchestrator.md, then execute all phases."

### Planning Review

For major planning decisions, use a second Claude CLI instance as reviewer:

1. Open a second Claude CLI in this project directory
2. Second instance reads `CLAUDE.md` → `fullplan.md` → `planN.md`
3. Ask it to review: completeness, architecture consistency, edge cases
4. Incorporate feedback; iterate until aligned

---

## Planning Files

- `orchestrator.md` — Multi-agent dispatch guide (contracts, prompts, file boundaries) ✅
- `fullplan.md` — Complete 12-phase development roadmap ✅
- `plan1.md` — Phase 1: Project Scaffolding ✅ (ready for execution)
- `plan2.md` — Phase 2: Layout & Navigation (to be created after Phase 1)
- `plan3.md` — Phase 3: Theme System (to be created)
- `plan4.md` — Phase 4: Home Page (to be created)
- `plan5.md` — Phase 5: Blog System (to be created)
- `plan6.md` — Phase 6: Project Portfolio (to be created)
- `plan7.md` — Phase 7: Essays Section (to be created)
- `plan8.md` — Phase 8: Contact Page (to be created)
- `plan9.md` — Phase 9: Multi-language (to be created)
- `plan10.md` — Phase 10: SEO & Performance (to be created)
- `plan11.md` — Phase 11: Content Creation (to be created)
- `plan12.md` — Phase 12: Deployment & CI/CD (to be created)
