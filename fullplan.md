# Full Development Plan — Personal Website

## Overview

A responsive, multi-language personal website built with Nuxt (latest stable) + Nuxt Content v3, deployed to Cloudflare Pages. Content-driven with Markdown for blogs, essays, and projects. Chinese is the default language, English available under `/en/`.

> **Version note:** Nuxt version numbers are intentionally left as "latest stable" rather than a specific major version. Before Phase 1 execution, run `npm view nuxt version` and lock the actual version in `package.json`. The `app/` directory structure (Nuxt 4 convention) is targeted; if Nuxt 3 is the current stable, use `future: { compatibilityVersion: 4 }` in `nuxt.config.ts`.

## Tech Stack

| Category | Choice | Version |
|----------|--------|---------|
| Framework | Nuxt | latest stable (verify before Phase 1) |
| UI Library | Vue | 3.x + TypeScript |
| Content | @nuxt/content | v3 (collection-based, Zod schemas) |
| Styling | TailwindCSS + Nuxt UI | v3+ (latest stable, Reka UI based) |
| Theme | @nuxtjs/color-mode | latest |
| i18n | @nuxtjs/i18n | latest |
| Images | @nuxt/image (SSG-compatible provider/config verified during Phase 1) | latest |
| Icons | @nuxt/icon (or nuxt-icon) | latest |
| Utilities | @vueuse/nuxt + @vueuse/core | latest |
| OG Images | nuxt-og-image | latest |
| Blog Search | fuse.js | latest |
| Deployment | Cloudflare Pages | — |
| CI/CD | GitHub Actions | — |
| Contact Email | Resend API | — |
| Testing | Vitest + @nuxt/test-utils | latest |

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Nuxt Application                    │
│                                                      │
│  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Pages │  │ Layouts  │  │Components│  │Compos-│ │
│  │(routes)│  │(wrappers)│  │(reusable)│  │ables  │ │
│  └───┬────┘  └──────────┘  └──────────┘  └───────┘ │
│      │                                               │
│  ┌───┴─────────────────────────────────────┐        │
│  │        Nuxt Content v3 Engine             │        │
│  │  content/*.md → SQLite → queryCollection()│        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │           Nitro Server Engine              │        │
│  │  SSG (pre-render) + Nitro server route     │        │
│  └────────────────────┬─────────────────────┘        │
│                       │                              │
│              Cloudflare Pages                         │
└──────────────────────────────────────────────────────┘
```

**Content flow:** At build time, Nuxt Content v3 parses all `.md` files, validates frontmatter against Zod schemas, stores in embedded SQLite, and pre-renders every page to static HTML. In the browser, the WASM SQLite handles client-side navigation instantly — no network requests for content.

---

## Phase Roadmap

| # | Phase | Depends On | Description |
|---|-------|-----------|-------------|
| 1 | Project Scaffolding | — | Init Nuxt project safely in a non-empty planning directory, install deps, configure modules |
| 2 | Layout & Navigation | 1 | Build AppHeader, AppFooter, Navigation, MobileMenu, all UI primitives |
| 3 | Theme System | 2 | Dark/light mode toggle, cookie persistence, FOUC prevention |
| 4 | Home/About Page | 2, 3 | Hero section, skills, experience timeline, CTA (FeaturedProjects deferred to Phase 6) |
| 5 | Blog System | 2, 3 | Blog listing + detail, Nuxt Content integration, TOC, tags, Fuse.js search |
| 6 | Project Portfolio | 2, 3 | Project grid + detail, tech stack badges, gallery, FeaturedProjects on home |
| 7 | Essays Section | 2, 3 | Essays listing + detail, clean minimal layout |
| 8 | Contact Page | 2, 3 | Contact form, validation, Nitro server route (→ CF Pages Function) |
| 9 | Multi-language (i18n) | 4–8 | Locale routing, UI translations, per-language content, language switcher |
| 10 | SEO & Performance | 4–8 | OG tags, sitemap, robots.txt, image optimization, Lighthouse audit |
| 11 | Content Creation | 4–8 | Write actual content (Chinese + English), sample posts, projects |
| 12 | Deployment & CI/CD | 1–11 | GitHub Actions → Cloudflare Pages, custom domain, analytics |

---

## Phase Summaries

### Phase 1: Project Scaffolding & Configuration

- Pre-flight: check latest stable versions of Nuxt, @nuxt/ui, @nuxt/content; lock exact versions in package.json using `pnpm add -E package@version`
- Initialize Nuxt project with `app/` directory structure (Nuxt 4 convention, or `compatibilityVersion: 4` on Nuxt 3) without overwriting existing planning/audit Markdown files
- Install all dependencies: `@nuxt/content`, `@nuxt/ui`, `@nuxtjs/i18n`, `@nuxtjs/color-mode`, `@nuxt/image`, `@vueuse/nuxt`, `@vueuse/core`, `@nuxt/icon`, `nuxt-og-image`, `fuse.js`
- Install dev deps: `vitest`, `@nuxt/test-utils`, `vue-tsc`, `wrangler`
- Configure `nuxt.config.ts` with all modules, TypeScript strict, Cloudflare Pages preset
- Configure `@nuxt/image` with an SSG-compatible provider/config verified against the installed version; document the chosen config in `nuxt.config.ts`
- Create `content.config.ts` with collection definitions (blog, essays, projects, about); export Zod schemas and TS types via `z.infer<>`
- Create `app.config.ts` with site metadata (name, description, social links — runtime config for SEO composables)
- Set up `app/assets/css/main.css` with TailwindCSS imports and dark mode `class` strategy
- Set up Vitest with `vitest.config.ts` (jsdom environment, Vue plugin)
- Create minimal `app/app.vue` and `app/layouts/default.vue`
- Create `wrangler.toml` for Cloudflare Pages
- Verify dev server runs successfully; verify `nuxi generate` produces static output; verify `pnpm test` works

### Phase 2: Layout System, Navigation & Core Components

- Build `AppHeader.vue` with responsive nav, logo, theme toggle placeholder
- Build `Navigation.vue` with main site links
- Build `AppFooter.vue` with compact social links and footer nav
- Build `MobileMenu.vue` hamburger drawer for small screens
- Build `BackToTop.vue` floating button
- Build all `app/components/ui/` primitives: UiButton, UiCard, UiBadge, UiContainer, UiSection, UiPageHeader, UiDivider
- Wire up `default.vue` layout with proper slot structure
- Create `blog.vue` layout with sidebar
- Create `error.vue` for 404/500 pages

### Phase 3: Theme System (Dark/Light Mode)

- Configure `@nuxtjs/color-mode` in `nuxt.config.ts`
- Create `useTheme.ts` composable (get, set, toggle, persist)
- Build `ThemeToggle.vue` with animated sun/moon icon
- Add FOUC-prevention inline script in `nuxt.config.ts` app.head
- Define TailwindCSS dark mode color tokens
- Style all existing components for both themes
- Test: toggle, navigate pages, reload — theme must persist without flash

### Phase 4: Home Page

- Home (`/`) = landing page with Hero, Skills, Experience Timeline, and Contact CTA
- About content lives at `/about` as a separate page; content sourced from `content/about/{zh,en}.md`
- Create `content/about/zh.md` and `content/about/en.md` with full profile data:
  - Fields: name, title, avatar, introduction (markdown), skills (array), experience (array of {role, company, period, description}), socialLinks
- Build `app/pages/index.vue` composing all home page sections
- Build `HeroSection.vue` — name, tagline, avatar, animated intro
- Build `SkillsSection.vue` + `SkillBadge.vue`
- Build `ExperienceTimeline.vue` + `TimelineItem.vue` (vertical timeline)
- Build `ContactCTA.vue` — call-to-action button to `/contact`
- Note: `FeaturedProjects.vue` is built in Phase 6 (after projects collection exists); home page uses a placeholder section until then

### Phase 5: Blog System

- Schema already defined in Phase 1 (plan1.md §1.4). Phase 5 adds `readingTime` and `wordCount` computation via `nuxt.config.ts` `hooks.content:file:afterParse` (not collection `transform()` — verify API availability in Phase 1 pre-flight)
- Create `useContent.ts` composable (list + detail query helpers, locale-aware)
- Create `useReadingTime.ts` composable
- Install `fuse.js` and create `useSearch.ts` composable for client-side fuzzy search
- Build `app/pages/blog/index.vue` — responsive grid with Fuse.js search + tag filter
- Build `app/pages/blog/[slug].vue` — post with ContentRenderer, TOC, prev/next
- Build blog components: BlogPostCard, BlogPostList, PostMeta (date, readingTime, tags), PostHeader, PostFooter, TagBadge, BlogFilters, TableOfContents, RelatedPosts, ShareButtons

### Phase 6: Project Portfolio

- Project collection schema already defined in Phase 1 (plan1.md §1.4). Fields: `title`, `summary`, `date`, `techStack: z.array(z.string())`, `image`, `links: z.object({ github, demo, npm, docs })`, `published`, `draft`, `locale`
- Create sample project `.md` files in `content/projects/{zh,en}/`
- Build `app/pages/projects/index.vue` — responsive project grid
- Build `app/pages/projects/[slug].vue` — project detail
- Build project components: ProjectCard, ProjectHero, ProjectContent, ProjectTechStack, ProjectGallery, ProjectFilters
- Tech stack badge color mapping (define token map for common tech)
- Build `FeaturedProjects.vue` as a dumb component that receives `projects` via props; `app/pages/index.vue` fetches top 3 projects through `useContent().getFeaturedProjects(locale, 3)` and passes them in

### Phase 7: Essays Section

- Essay collection schema already defined in Phase 1 (plan1.md §1.4)
- Create sample essay `.md` files
- Build `app/pages/essays/index.vue` — clean chronological list
- Build `app/pages/essays/[slug].vue` — minimal layout, no sidebar
- Build essay components: EssayCard, EssayList
- Custom styling: larger font, serif option for Chinese text

### Phase 8: Contact Page

- Build `app/pages/contact.vue`
- Build `ContactForm.vue` — name, email, subject, message
- Build form components: FormInput, FormTextarea, FormSuccess
- Create `useForm.ts` composable — validation logic, honeypot
- Create `server/api/contact.post.ts` — Nitro server route (Nitro compiles this to a Cloudflare Pages Function at build time; in dev, test via `nuxi dev`, not `wrangler dev`)
- Configure Resend API for email delivery
- Build `SocialLinks.vue` — GitHub, LinkedIn, etc.
- Test end-to-end form submission

### Phase 9: Multi-language Support

- Configure `@nuxtjs/i18n` in `nuxt.config.ts`
- Create `locales/zh.json` and `locales/en.json` with UI strings
- Build `LanguageSwitcher.vue`
- Update UI wiring so existing `useContent.ts` calls use the current locale; pages should not duplicate raw `queryCollection()` locale filters
- Add locale-aware routing middleware
- Handle locale-specific date formatting in `app/utils/date.ts`
- Add `hreflang` tags for SEO
- Note: content directory structure (`content/{collection}/{locale}/`) was created in Phase 1; this phase wires up the queries and routing

### Phase 10: SEO & Performance

- Create `useSeo.ts` composable for per-page meta
- Configure `@nuxtjs/sitemap` module
- Add Open Graph / Twitter Card meta to all pages
- Generate OG images via `nuxt-og-image` for blog posts
- Optimize `nuxt.config.ts` for SSG: crawlLinks, prerender routes
- Create `app/utils/constants.ts` with site metadata
- Configure `@nuxt/image` responsive image sizing and WebP/AVIF generation using the SSG-compatible provider/config chosen in Phase 1
- Add `public/robots.txt`
- Run Lighthouse audit: target 95+ all categories
- Verify Core Web Vitals

### Phase 11: Content Creation

- Write about page content (Chinese + English)
- Write 2–3 initial blog posts with code examples
- Write 2–3 personal essays
- Add 3–4 project entries with descriptions and tech details
- Create favicon and app icons
- Create custom MDC components for rich content:
  - `Notice.vue` — callout boxes (info, warning, tip)
  - `CodeSandbox.vue` — interactive code examples
- Refine typography, spacing, visual hierarchy
- Add micro-animations (scroll reveal, hover effects)
- Full manual QA: all pages, all breakpoints, both themes, both languages

### Phase 12: Deployment & CI/CD

- Finalize `wrangler.toml` with project settings
- Create `.github/workflows/deploy.yml`:
  - Checkout → Setup Node → Install deps → Build (SSG) → Deploy to Cloudflare Pages
- Configure Cloudflare Pages project in dashboard
- Set environment variables (Resend API key, etc.)
- Configure custom domain + SSL
- Run production build locally: `nuxi generate`
- First deploy and verify all routes
- Set up Cloudflare Web Analytics
- Add Uptime monitoring (Uptime Robot free tier)
- Tag v1.0 release

---

## Testing Strategy

| Level | Tool | Scope |
|-------|------|-------|
| Unit/Component | Vitest + @nuxt/test-utils | Every shared UI component gets a render test; composables get logic tests |
| Contact form | Vitest + server handler test | Validate input, test error cases, mock Resend API |
| Accessibility | Manual + axe DevTools | Keyboard nav, screen reader labels, focus management per component |
| Visual regression | Manual browser check | Each phase: verify at mobile (375px), tablet (768px), desktop (1280px) in both themes and both languages |

Testing is integrated per-phase, not a separate phase. Each `planN.md` includes testing tasks specific to the components built in that phase.

**Breakpoints:** Mobile-first, TailwindCSS defaults: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

**A11y acceptance criteria (every phase):**
- All interactive elements keyboard-focusable and operable
- Form inputs have associated `<label>` elements
- Mobile menu manages focus trap correctly
- Theme toggle announces state to screen readers
- Language switcher uses `hreflang` and `lang` attributes

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **SSG over SSR** | Personal site is static content. SSG = zero cold starts, max perf. Only contact form needs a serverless function. |
| **Nuxt Content v3 over headless CMS** | No database, no API calls at runtime, content version-controlled in git, free. |
| **Nuxt UI v3+ (Reka UI)** | Accessible components out of the box, TailwindCSS compatible, well-maintained. |
| **`prefix_except_default` i18n** | Clean default-locale URLs (`/blog/post`) while English gets clear prefix (`/en/blog/post`). |
| **Inline FOUC script** | <300 bytes, executes before first paint, zero flash guaranteed. |
| **TailwindCSS class-based dark mode** | Matches FOUC script strategy; color tokens defined as CSS custom properties in `@theme`. |
| **Resend for email** | Generous free tier (100 emails/day), simple REST API, no SMTP setup. |
| **Fuse.js for blog search** | For <100 posts, client-side fuzzy search on title/tags is fast and adds zero infra. |
| **Reading time via Nuxt Content hooks** | `hooks: { 'content:file:afterParse'(file) { ... } }` in `nuxt.config.ts` computes `readingTime` and `wordCount` at build time. |
| **@nuxt/image SSG config** | Verify the installed `@nuxt/image` behavior during Phase 1 and use an SSG-compatible provider/config; do not hard-code an outdated provider choice. |
| **Vitest + @nuxt/test-utils** | Lightweight testing for components and composables. Added per-phase as components are built. |
| **CJK fonts: subset + self-host** | CJK variable fonts are 5–15 MB+. Use subset ranges (common 4000 chars ~2 MB) with `font-display: swap` + preload. |

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Nuxt Content v3 API still evolving | Pin exact version in package.json |
| Nuxt latest version unknown | Pre-flight check in Phase 1: `npm view nuxt version`; use whatever is stable with `app/` dir convention |
| Cloudflare Pages build limits | SSG output is lightweight; free tier is 500 builds/month |
| Chinese font loading performance | Subset CJK fonts to 4000 common chars (~2 MB), self-host, `font-display: swap`, preload critical subset. Recommended: Noto Sans SC or Source Han Sans. |
| Contact form spam | Honeypot field + timestamp check (<3s submit = bot) |
| Content only in one language | Gracefully show fallback message; don't error |
| Nuxt Content v3 API differences from v2 | No `.fetch()`. Use `queryCollection()` inside `useContent.ts` wrappers. Reading time/wordCount computed via `hooks: { 'content:file:afterParse'(file) { ... } }` in `nuxt.config.ts`. Check docs for current API. |
