# Plan 1: Project Scaffolding & Configuration

## Objective

Initialize the Nuxt project (latest stable), install all core dependencies, configure every module, and verify both dev server and SSG build work. Establish the project foundation so all subsequent phases have a working base.

## Prerequisites

Existing planning files are present in `D:\programs\personalWeb`. Phase 1 must scaffold Nuxt without overwriting `CLAUDE.md`, `fullplan.md`, `plan1.md`, `orchestrator.md`, review files, or audit files.

---

## Tasks

### 1.0 Pre-flight: Check Latest Versions

- [ ] Run `npm view nuxt version` — record latest stable version
- [ ] Run `npm view @nuxt/ui version` — record latest stable version
- [ ] Run `npm view @nuxt/content version` — record latest stable version (should be v3.x)
- [ ] Run `npm view @nuxt/icon version` — confirm package name (could be `nuxt-icon` for older versions)
- [ ] Run `npm view` for every package installed in §1.2 (`@nuxtjs/i18n`, `@nuxtjs/color-mode`, `@nuxt/image`, `@vueuse/nuxt`, `@vueuse/core`, `fuse.js`, `@nuxtjs/sitemap`, `nuxt-og-image`, `vitest`, `@nuxt/test-utils`, `vue-tsc`, `wrangler`)
- [ ] Pin these exact versions in the plan before running any install commands
- [ ] Use exact dependency saves: either run `pnpm config set save-exact true` for this repo before install, or use `pnpm add -E package@version` / `pnpm add -D -E package@version`
- [ ] Decision: if Nuxt 4.x is NOT stable, target Nuxt 3 with `future: { compatibilityVersion: 4 }` in `nuxt.config.ts`

### 1.1 Initialize Nuxt Project

- [ ] Because the current directory is not empty, scaffold in a temporary sibling directory first:
  ```powershell
  cd D:\programs
  npx nuxi@latest init personalWeb-scaffold
  ```
- [ ] Choose: TypeScript = Yes, package manager = pnpm
- [ ] Copy only generated project files into `D:\programs\personalWeb`; do NOT overwrite existing `*.md` planning/audit/review files
- [ ] Delete the temporary scaffold directory only after verifying copied files are present
- [ ] Verify `package.json`, `nuxt.config.ts`, `tsconfig.json` are created in `D:\programs\personalWeb`
- [ ] Replace the generated `nuxt` version range in `package.json` with the exact Nuxt version recorded in §1.0, preserving whether the scaffold placed it in dependencies or devDependencies
- [ ] Structure project with `app/` directory (if Nuxt 4 stable; otherwise set `compatibilityVersion: 4` on Nuxt 3)

### 1.2 Install Dependencies

Install all modules and utilities:

Replace each `<version>` with the exact version recorded in §1.0 before running:

```
pnpm add -E @nuxt/content@<version> @nuxt/ui@<version> @nuxtjs/i18n@<version> @nuxtjs/color-mode@<version> @nuxt/image@<version>
pnpm add -E @vueuse/nuxt@<version> @vueuse/core@<version> @nuxt/icon@<version> fuse.js@<version>
pnpm add -D -E @nuxtjs/sitemap@<version> nuxt-og-image@<version> vitest@<version> @nuxt/test-utils@<version> vue-tsc@<version>
```

Note: if `@nuxt/icon` doesn't exist (check 1.0 pre-flight), use `nuxt-icon` instead.

Note: `@nuxtjs/sitemap` is installed in Phase 1 but configured in Phase 10 (SEO). If it auto-enables and causes build warnings, disable it with `sitemap: { enabled: false }` in `nuxt.config.ts` until Phase 10.

Cloudflare Pages integration:

```
pnpm add -D -E wrangler@<version>
```

### 1.3 Configure nuxt.config.ts

Set up all modules and build configuration:

- [ ] Enable modules: `@nuxt/content`, `@nuxt/ui`, `@nuxtjs/i18n`, `@nuxtjs/color-mode`, `@nuxt/image`, `@vueuse/nuxt`, `@nuxt/icon` (or `nuxt-icon`)
- [ ] Add minimal i18n placeholder config (prevents startup errors; full config in Phase 9):
  ```typescript
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    strategy: 'prefix_except_default'
  }
  ```
- [ ] Set `compatibilityVersion: 4` (if Nuxt 4) or `future: { compatibilityVersion: 4 }` (if Nuxt 3)
- [ ] Configure TypeScript strict mode
- [ ] Set `nitro.preset: 'cloudflare-pages'`
- [ ] Configure `nitro.prerender.crawlLinks: true`
- [ ] Configure `@nuxt/image` for SSG + Cloudflare Pages according to the installed `@nuxt/image` docs. Do not force a provider name unless the current version requires it; document the final provider/config choice in a comment near the `image` config.
- [ ] Do not add theme behavior in Phase 1. Phase 3 owns `@nuxtjs/color-mode` behavior config, the FOUC script, theme cookie names, and CSS theme tokens. Keep only the minimum module setup required for `pnpm dev` to start.

### 1.4 Create content.config.ts

Define content collections with full Zod schemas:

- [ ] Export Zod schemas and inferred types from `content.config.ts`; do not hand-maintain duplicate production interfaces:
  ```typescript
  import { z } from 'zod'

  export const blogSchema = z.object({ /* fields below */ })
  export type BlogPost = z.infer<typeof blogSchema>
  ```
- [ ] `blog` collection — source: `blog/**/*.md`, type: `page`
  ```typescript
  export const blogSchema = z.object({
    title: z.string(),
    slug: z.string(),          // URL-safe slug; used for detail page lookups (NOT directory path)
    description: z.string(),
    date: z.string().date(),   // Must be quoted in frontmatter: date: "2026-05-22"
    updated: z.string().date().optional(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().default(true),
    published: z.boolean().default(false),
    locale: z.enum(['zh', 'en'])
  })
  export type BlogPost = z.infer<typeof blogSchema>
  ```
- [ ] `essays` collection — source: `essays/**/*.md`, type: `page`
  ```typescript
  export const essaySchema = z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    date: z.string().date(),
    updated: z.string().date().optional(),
    draft: z.boolean().default(true),
    published: z.boolean().default(false),
    locale: z.enum(['zh', 'en'])
  })
  export type Essay = z.infer<typeof essaySchema>
  ```
- [ ] `projects` collection — source: `projects/**/*.md`, type: `page`
  ```typescript
  export const projectSchema = z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    date: z.string().date(),
    techStack: z.array(z.string()),
    image: z.string().optional(),
    links: z.object({
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      npm: z.string().url().optional(),
      docs: z.string().url().optional()
    }).optional(),
    draft: z.boolean().default(true),
    published: z.boolean().default(false),
    locale: z.enum(['zh', 'en'])
  })
  export type Project = z.infer<typeof projectSchema>
  ```
- [ ] `about` collection — source: `about/*.md` (single-file-per-locale collection: `zh.md` and `en.md` live flat in `content/about/`; pages query this collection to render About content)
  ```typescript
  export const aboutSchema = z.object({
    name: z.string(),
    title: z.string(),
    avatar: z.string(),
    introduction: z.string(),
    skills: z.array(z.object({ name: z.string(), level: z.number(), category: z.string() })),
    experience: z.array(z.object({ role: z.string(), company: z.string(), period: z.string(), description: z.string() })),
    socialLinks: z.object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional()
    }),
    locale: z.enum(['zh', 'en'])
  })
  export type About = z.infer<typeof aboutSchema>
  ```
- [ ] Use the exported schema constants in `defineCollection({ schema: blogSchema })`, `defineCollection({ schema: essaySchema })`, `defineCollection({ schema: projectSchema })`, and `defineCollection({ schema: aboutSchema })`

### 1.5 Create App Shell

- [ ] Create `app/assets/css/main.css`:
  ```css
  @import "tailwindcss";
  @import "@nuxt/ui";
  /* TailwindCSS v4 uses class-based dark mode (matches FOUC script) */
  /* Color tokens defined via @theme {} block in Phase 3 */
  ```
- [ ] Ensure `main.css` is loaded: add `css: ['~/assets/css/main.css']` to `nuxt.config.ts` if Nuxt 4 does not auto-import it (verify during dev server test in §1.8)
- [ ] Create `app/app.vue`:
  ```vue
  <template>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </template>
  ```
- [ ] Create `app/layouts/default.vue` with basic `<slot />` structure
- [ ] Create `app/pages/index.vue` with placeholder "Hello, World"

### 1.6 Create Cloudflare Pages Config

- [ ] Create `wrangler.toml`:
  ```toml
  name = "personal-website"
  compatibility_date = "2025-01-01"
  pages_build_output_dir = ".output/public"
  ```
- [ ] Create `.gitignore` (if not auto-generated) including `.output/`, `.data/`, `node_modules/`

### 1.7 Create Directory Structure

Create all empty directories needed for future phases:

```
app/components/{ui,blog,project,essay,home,contact,core}/
app/composables/
app/layouts/
app/pages/blog/
app/pages/projects/
app/pages/essays/
app/utils/
app/assets/images/
app/middleware/
content/blog/{zh,en}/
content/essays/{zh,en}/
content/projects/{zh,en}/
content/about/             # Flat (not {zh,en}/) — single-doc collection, zh.md + en.md only
locales/
public/images/
server/api/
shared/types/
```

### 1.8 Verify Dev Server and Build

- [ ] Run `pnpm dev` (or `npx nuxt dev`)
- [ ] Open http://localhost:3000 — should see "Hello, World" placeholder
- [ ] Verify no console errors
- [ ] Verify HMR (hot reload) works by editing `index.vue`
- [ ] Run `npx nuxi generate` to verify SSG build succeeds (this is the production build command; uses `cloudflare-pages` preset from `nuxt.config.ts`)
- [ ] Verify `.output/public/` contains static HTML files
- [ ] Verify `.output/public/` includes `_worker.js` or `functions/` (Cloudflare Pages specific output)
- [ ] Optional: verify `pnpm build` (Nuxt dev build) compiles without TypeScript errors — this is a secondary check, not the deployment command

### 1.9 Configure Vitest

- [ ] Verify `vitest`, `@nuxt/test-utils`, and `vue-tsc` are in `devDependencies` (installed in 1.2)
- [ ] Add `"test": "vitest --passWithNoTests"` to `package.json` scripts
- [ ] Add `"typecheck": "vue-tsc --noEmit"` to `package.json` scripts
- [ ] Create `vitest.config.ts` (prefer Nuxt-native config; if `@nuxt/test-utils/config` doesn't export `defineVitestConfig`, use the vanilla approach as fallback):
  ```typescript
  // Primary: Nuxt-native (handles auto-imports, module resolution)
  import { defineVitestConfig } from '@nuxt/test-utils/config'
  export default defineVitestConfig({
    test: {
      environment: 'nuxt'
    }
  })
  ```
  ```typescript
  // Fallback: vanilla Vitest (if defineVitestConfig is unavailable)
  import { defineConfig } from 'vitest/config'
  import vue from '@vitejs/plugin-vue'
  export default defineConfig({
    plugins: [vue()],
    test: {
      environment: 'jsdom',
      globals: true
    }
  })
  ```
- [ ] Run `pnpm test` to confirm the test runner works (`vitest --passWithNoTests` verifies setup before real tests exist)

---

## Files to Create

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Generated by init, heavily customized with all modules |
| `app.config.ts` | App runtime config (site name, description, social links — used by SEO composables) |
| `content.config.ts` | Content collection definitions + Zod schemas (TS types derived via `z.infer<>`) |
| `app/app.vue` | Root Vue component |
| `app/layouts/default.vue` | Default page layout |
| `app/pages/index.vue` | Placeholder home page |
| `app/assets/css/main.css` | Tailwind + Nuxt UI imports |
| `vitest.config.ts` | Vitest configuration (jsdom environment, Vue plugin) |
| `wrangler.toml` | Cloudflare Pages configuration |

---

## Acceptance Criteria

- [ ] `pnpm dev` starts without errors (dev server)
- [ ] `npx nuxi generate` completes successfully (SSG production build)
- [ ] `.output/public/` contains static HTML + `_worker.js` or `functions/` (Cloudflare Pages output)
- [ ] `pnpm test` runs without errors (`vitest --passWithNoTests` verifies setup even before tests exist)
- [ ] `pnpm typecheck` runs without errors
- [ ] http://localhost:3000 serves a page
- [ ] All dependency versions are pinned in `package.json`
- [ ] `@nuxt/image` has an SSG-compatible config verified against the installed version; the final provider/config choice is documented in `nuxt.config.ts`
- [ ] `@nuxtjs/i18n` has minimal placeholder config (4 lines: locales, defaultLocale, strategy)
- [ ] All three article collections (blog, essays, projects) have complete Zod schemas with `draft` and `published` fields. About collection is always public — no draft/published needed.
- [ ] `CLAUDE.md` Implementation status table is updated by the orchestrator after Phase 1 completes
- [ ] `fullplan.md` exists and is complete
- [ ] `plan1.md` exists (this file)

---

## Verification

```bash
# Start dev server
pnpm dev
# In another terminal, verify SSG production build
npx nuxi generate
# Verify static output (should have HTML + _worker.js or functions/)
ls .output/public/
# Verify test runner works
pnpm test
# Verify TypeScript
pnpm typecheck
```

## Next Phase

Phase 2: Layout System, Navigation & Core Components (`plan2.md` — to be created after Phase 1 is complete)
