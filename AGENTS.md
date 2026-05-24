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

## Current Phase

**Phase 1: Project Scaffolding & Configuration**

- `fullplan.md` — complete 12-phase roadmap
- `plan1.md` — current phase detailed tasks
- `plan2.md` — next phase (Layout & Navigation) — to be created after Phase 1 complete

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
| Images | `@nuxt/image` with `static` provider | Static provider pre-generates sizes at build time; `ipx` needs Node.js runtime (incompatible with SSG) |
| Search | Fuse.js client-side | <100 posts, fuzzy search on title/tags, zero infra |
| Testing | Vitest + @nuxt/test-utils | Component render tests + composable logic tests |
| Deploy | Cloudflare Pages via GitHub Actions | Free tier, global CDN |

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
│   ├── composables/        # Auto-imported logic (useContent, useTheme, etc.)
│   ├── layouts/            # default.vue, blog.vue
│   ├── pages/              # File-based routing
│   ├── app.vue             # Root component
│   └── error.vue           # Error page
├── content/                # Markdown content files
│   ├── blog/{zh,en}/
│   ├── essays/{zh,en}/
│   ├── projects/{zh,en}/
│   └── about/{zh,en}.md
├── shared/types/           # TypeScript type definitions
├── server/api/             # Nitro server routes (compiled to CF Pages Functions)
├── locales/                # i18n JSON translation strings
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
- UI primitives in `app/components/ui/` (UiButton, UiCard, UiBadge, UiSection, etc.)

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
// hooks['content:file:afterParse'] fires for every parsed .md file
// Add readingTime / wordCount there and merge into the document

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
  .path(path)              // Filter by exact path (for detail pages)
  .where(field, op, value) // SQL-style filter
  .order(field, 'ASC'|'DESC')
  .all()                   // Execute → array
  .first()                 // Execute → single item

// Vue component for rendering MD/MDC
<ContentRenderer :value="doc" />
```

**Content workflow:** Posts use `draft: true` (not ready) and `published: true` (live). Queries filter `.where('published', '=', true)` to only show live posts. `draft: true` + `published: false` = work in progress, hidden on site.

---

## Collaboration Workflow

### Development: Orchestrator + Sub-agents

Use the **orchestrator pattern** defined in `orchestrator.md`. A single master agent:
1. Reads `orchestrator.md` → `fullplan.md` → `AGENTS.md`
2. Dispatches sub-agents via `Codex --dangerously-skip-permissions --print` for each task
3. Reviews output, runs quality gates (`pnpm dev`, `pnpm test`, `nuxi generate`)
4. Marks phases complete, updates `Current Phase`

**To start:** Open a Codex CLI in this directory and say "Read orchestrator.md, then execute all phases."

### Planning Review

For major planning decisions, use a second Codex CLI instance as reviewer:

1. Open a second Codex CLI in this project directory
2. Second instance reads `AGENTS.md` → `fullplan.md` → `planN.md`
3. Ask it to review: completeness, architecture consistency, edge cases
4. Incorporate feedback; iterate until aligned

---

## Planning Files

- `orchestrator.md` — Multi-agent dispatch guide (contracts, prompts, file boundaries)
- `fullplan.md` — Complete 12-phase development roadmap ✅
- `plan1.md` — Phase 1: Project Scaffolding (current) ✅
- `plan2.md` — Phase 2: Layout & Navigation (upcoming)
- `plan3.md` — Phase 3: Theme System (upcoming)
- `plan4.md` — Phase 4: Home Page (upcoming)
- `plan5.md` — Phase 5: Blog System (upcoming)
- `plan6.md` — Phase 6: Project Portfolio (upcoming)
- `plan7.md` — Phase 7: Essays Section (upcoming)
- `plan8.md` — Phase 8: Contact Page (upcoming)
- `plan9.md` — Phase 9: Multi-language (upcoming)
- `plan10.md` — Phase 10: SEO & Performance (upcoming)
- `plan11.md` — Phase 11: Content Creation (upcoming)
- `plan12.md` — Phase 12: Deployment & CI/CD (upcoming)
