# Orchestrator Agent — Personal Website

## Role

You are the **orchestrator agent**. You do NOT write code yourself. Your job:

1. Read this document + `fullplan.md` + `CLAUDE.md` + `planN.md`
2. For each phase, determine which tasks can run in parallel
3. Spawn Claude CLI sub-agents with precise scope
4. Review each agent's output by reading the changed files
5. Verify integration: `pnpm dev`, `pnpm test`, `npx nuxi generate`
6. Mark phase complete, update the `CLAUDE.md` Implementation status table, advance to next

**Golden rule:** Never ask two agents to touch the same file. If a file is shared, it MUST be done by a single agent or handled sequentially with explicit handoff.

---

## Agent Dispatch Protocol

### Starting a sub-agent

Use Bash tool with `run_in_background: false` to run a Claude CLI instance.

**Bash (Git Bash / WSL):**
```bash
# Assumes `claude` is on PATH. Verify with: which claude || which claude-code
cd D:\programs\personalWeb && \
claude --dangerously-skip-permissions --print --output-format text 'one-line prompt here'
```

**PowerShell:**
```powershell
# Assumes `claude` is on PATH. Verify with: Get-Command claude -ErrorAction SilentlyContinue
cd D:\programs\personalWeb
claude --dangerously-skip-permissions --print --output-format text 'one-line prompt here'
```

For multi-line prompts, write to a temp file first:

**Bash (Git Bash / WSL):**
```bash
cd D:\programs\personalWeb && \
cat > .claude/task_prompt.txt << 'CLAUDE_EOF'
You are implementing part of a Nuxt personal website...
[full prompt here]
CLAUDE_EOF
claude --dangerously-skip-permissions --print --output-format text "$(cat .claude/task_prompt.txt)"
```

**PowerShell:**
```powershell
cd D:\programs\personalWeb
@'
You are implementing part of a Nuxt personal website...
[full prompt here]
'@ | Set-Content -Encoding UTF8 .claude\task_prompt.txt
claude --dangerously-skip-permissions --print --output-format text (Get-Content .claude\task_prompt.txt -Raw)
```

### Parallel dispatch

When tasks are independent (different files), launch multiple agents simultaneously in one message using multiple Bash calls. Parallel agents must only edit files in scope; they must not run installs, builds, dev servers, formatters, or full test suites. The orchestrator runs integration gates after the whole parallel batch completes.

### What to review after each agent

1. Read the changed files — verify the agent didn't touch files outside its scope
2. Check: are component props matching the contract? Are imports correct?
3. For serial tasks, run the relevant quality gate after the agent finishes.
4. For parallel batches, review scope/diff after each agent, then run `pnpm test`, `pnpm typecheck`, and `npx nuxi generate` only after all agents in the batch have completed.
5. If a shared file was changed, immediately verify it doesn't break other agents' work

---

## Phase Execution Map

### Phase 1: Project Scaffolding — 1 Agent (Serial)

| Task # | Agent | Files | Description |
|--------|-------|-------|-------------|
| 1.1 | `scaffold` | `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts`, `tsconfig.json`, `content.config.ts`, `app.config.ts`, `vitest.config.ts`, `wrangler.toml`, `.gitignore`, `app/**`, `content/**`, `server/**`, `shared/**`, `public/**`, `locales/**` | Safe project initialization per plan1.md; preserve existing planning/audit Markdown files |

**Can't parallelize:** All config files are interdependent. One agent does it all.

**After completion:** Run `pnpm dev` + `pnpm test` + `pnpm typecheck` + `npx nuxi generate`. Update the `CLAUDE.md` Implementation status table: Phase 1 implemented, Phase 2 not started.

**Agent prompt (Phase 1):**

```
You are implementing Phase 1 of a Nuxt personal website. Read these files in this order:
1. D:\programs\personalWeb\CLAUDE.md (project conventions)
2. D:\programs\personalWeb\fullplan.md (architecture overview)
3. D:\programs\personalWeb\plan1.md (Phase 1 detailed tasks)

## Your Task
Execute ALL tasks in plan1.md §1.0 through §1.9. This includes:
- Pre-flight version checks (§1.0)
- Initialize Nuxt project safely from a temporary sibling directory because D:\programs\personalWeb is not empty (§1.1)
- Install all dependencies with exact versions using `pnpm add -E` / `pnpm add -D -E` (§1.2)
- Configure nuxt.config.ts with all modules, i18n placeholder, and SSG-compatible image config verified against the installed @nuxt/image docs (§1.3)
- Create content.config.ts with all four collection Zod schemas (§1.4)
- Create app.config.ts with site metadata (§1.5a):
  ```typescript
  export default defineAppConfig({
    site: {
      name: 'Takagi San',
      description: 'Personal website — tech blog, projects, essays',
      url: 'https://example.com',
      ogImage: '/images/og-default.png',
      socialLinks: { github: '', linkedin: '', email: '' }
    }
  })
  ```
- Create app shell files: main.css, app.vue, layouts/default.vue, pages/index.vue (§1.5)
- Create wrangler.toml and .gitignore (§1.6)
- Create all empty directories (§1.7)
- Create vitest.config.ts using defineVitestConfig from @nuxt/test-utils/config (see plan1.md §1.9 for exact config — the plan1.md version is the authoritative source)

## Your File Scope
You may create/modify ONLY project scaffold files and directories:
- package.json, pnpm-lock.yaml, nuxt.config.ts, tsconfig.json, content.config.ts, app.config.ts, vitest.config.ts, wrangler.toml, .gitignore
- app/**, content/**, server/**, shared/**, public/**, locales/**

Do NOT modify CLAUDE.md, fullplan.md, plan1.md, orchestrator.md, review*.md, plan-architecture-audit*.md, or any other planning/audit documents. The orchestrator updates status separately after gates pass.

## Acceptance Criteria (from plan1.md)
- pnpm dev starts without errors
- http://localhost:3000 serves a page
- npx nuxi generate completes successfully
- .output/public/ contains static HTML + _worker.js
- pnpm test runs without errors
- pnpm typecheck runs without errors
- All dependency versions pinned in package.json
- @nuxt/image has an SSG-compatible config verified against the installed version
- All four content collections have complete exported Zod schemas and inferred types
```

---

### Phase 2: Layout & Navigation — 2 Agents (Parallel)

#### Contract — Component Props (shared with both agents)

```typescript
// core/AppHeader.vue — no props (reads route)
// core/AppFooter.vue — no props (reads app.config)

// core/Navigation.vue
defineProps<{
  links: Array<{ label: string; to: string; icon?: string }>
}>()

// core/MobileMenu.vue
defineProps<{
  links: Array<{ label: string; to: string; icon?: string }>
  modelValue: boolean
}>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

// ui/UiButton.vue
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  disabled?: boolean
}>()

// ui/UiCard.vue
defineProps<{
  as?: 'div' | 'article' | 'a'
  to?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>()

// ui/UiBadge.vue
defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md'
}>()

// ui/UiContainer.vue — no props, just <div class="max-w-6xl mx-auto px-4">
// ui/UiSection.vue
defineProps<{
  title?: string
  description?: string
  background?: 'default' | 'muted'
}>()

// ui/UiPageHeader.vue
defineProps<{
  title: string
  description?: string
}>()

// ui/UiDivider.vue — no props, just <hr> with styling
```

#### Task Dispatch

| Task | Agent | Files (exclusive scope) |
|------|-------|------------------------|
| 2a | `ui-primitives` | `app/components/ui/UiButton.vue`, `app/components/ui/UiCard.vue`, `app/components/ui/UiBadge.vue`, `app/components/ui/UiContainer.vue`, `app/components/ui/UiSection.vue`, `app/components/ui/UiPageHeader.vue`, `app/components/ui/UiDivider.vue` |
| 2b | `layout-core` | `app/components/core/AppHeader.vue`, `app/components/core/AppFooter.vue`, `app/components/core/Navigation.vue`, `app/components/core/MobileMenu.vue`, `app/components/core/BackToTop.vue`, `app/layouts/default.vue`, `app/layouts/blog.vue`, `app/error.vue` |

**Parallel safe:** Different directories, zero file overlap. Nuxt auto-imports handle component references — 2b just uses `<UiButton>` directly.

**Agent prompt (2a — ui-primitives):**

```
You are implementing Phase 2a of a Nuxt personal website. Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md

## Your Task
Build all UI primitive components in app/components/ui/. Each component uses TailwindCSS + Nuxt UI v3+ conventions.

## Your File Scope — ONLY these files:
- app/components/ui/UiButton.vue
- app/components/ui/UiCard.vue
- app/components/ui/UiBadge.vue
- app/components/ui/UiContainer.vue
- app/components/ui/UiSection.vue
- app/components/ui/UiPageHeader.vue
- app/components/ui/UiDivider.vue

DO NOT touch any other files.

## Component Props Contract
[Insert props from the contract section above]

## Acceptance Criteria
- Each component renders without errors
- Props are type-safe (TypeScript strict)
- Responsive: works at 375px, 768px, 1280px
- Keyboard accessible (buttons focusable, etc.)
```

**Agent prompt (2b — layout-core):**

```
You are implementing Phase 2b of a Nuxt personal website. Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md

## Your Task
Build all core layout components and layouts. Use Nuxt UI auto-imported components where helpful.

## Your File Scope — ONLY these files:
- app/components/core/AppHeader.vue
- app/components/core/AppFooter.vue
- app/components/core/Navigation.vue
- app/components/core/MobileMenu.vue
- app/components/core/BackToTop.vue
- app/layouts/default.vue
- app/layouts/blog.vue
- app/error.vue

DO NOT touch any other files.

## Component Props Contract
[Insert props from the contract section above for core components]

## Acceptance Criteria
- AppHeader has responsive nav + mobile hamburger menu
- MobileMenu opens/closes with focus trap
- AppFooter has social links and compact nav
- default.vue has header + slot + footer
- blog.vue has sidebar slot
- error.vue handles 404 and 500
- Layout renders at 375px, 768px, 1280px
```

**After completion:** Run `pnpm dev`, verify all pages render. Update the `CLAUDE.md` Implementation status table to Phase 3 not started.

---

### Phase 3: Theme System — 1 Agent (Serial)

| Task | Agent | Files |
|------|-------|-------|
| 3 | `theme` | `nuxt.config.ts` (colorMode config), `app/composables/useTheme.ts`, `app/components/core/ThemeToggle.vue`, `app/assets/css/main.css` (@theme block with dark tokens), all `app/components/ui/*.vue` (add dark: variants), all `app/components/core/*.vue` (add dark: variants) |

**Can't parallelize:** Touches both ui/ and core/ directories plus shared config files.

**Agent prompt:**

```
You are implementing Phase 3 of a Nuxt personal website. Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md

## Your Task
Implement the dark/light theme system:
1. Add or complete @nuxtjs/color-mode behavior config in nuxt.config.ts (`classSuffix: ''`, `cookieName: 'theme'`, `storageKey: 'theme'`). Do NOT duplicate existing config if Phase 1 required a minimal startup config.
2. Add the FOUC script in nuxt.config.ts app.head.script. Confirm no duplicate copy exists.
3. Create app/composables/useTheme.ts (get, set, toggle, persist via cookie)
4. Create app/components/core/ThemeToggle.vue (animated sun/moon icon)
5. Add @theme block to app/assets/css/main.css with CSS custom properties for light/dark
6. Add dark: variants to ALL existing components in ui/ and core/ directories

## Your File Scope
You may modify:
- nuxt.config.ts (add sections, don't remove existing config)
- app/assets/css/main.css (add @theme block, don't remove imports)
- app/composables/useTheme.ts (create)
- app/components/core/ThemeToggle.vue (create)
- app/components/ui/*.vue (add dark: classes only)
- app/components/core/*.vue (add dark: classes only)

## Acceptance Criteria
- Theme toggle works: click switches light ↔ dark
- Reload persists the chosen theme (no flash)
- System preference respected on first visit
- All components look correct in both themes
- pnpm dev + pnpm test pass
```

**After completion:** Manual test: toggle, navigate, reload — no flash. Update the `CLAUDE.md` Implementation status table to Phase 4 not started.

---

### Phase 4-7: Content Pages — 5 Agents (serial setup + parallel content pages)

**Execution order (optimized):**
1. **Step 1 (serial):** `content-composable` creates `useContent.ts` + adds readingTime/wordCount hooks in `nuxt.config.ts`.
2. **Step 2 (serial):** `home-page` builds home + about pages using `useContent().getAbout('zh')`.
3. **Step 3 (3 agents in parallel):** `blog-system`, `project-portfolio`, `essay-section` all depend on `useContent.ts`; `project-portfolio` runs after `home-page` because it replaces the home placeholder.

Why this order: content queries stay centralized in `useContent.ts`, and `app/pages/index.vue` has one writer at a time.

#### Shared Types (agent-facing contracts — source of truth is `content.config.ts`)

> These interfaces are copies for agent reference. The authoritative definitions are the Zod schemas in `content.config.ts` (created in Phase 1). Any field discrepancy: trust `content.config.ts`. In production code, types are derived via `z.infer<>` from the schemas — not hand-written.

```typescript
interface BlogPost {
  title: string; slug: string; description: string; date: string; updated?: string
  tags: string[]; image?: string; draft: boolean; published: boolean
  locale: 'zh' | 'en'; readingTime?: number; wordCount?: number
}

interface Project {
  title: string; slug: string; summary: string; date: string
  techStack: string[]; image?: string
  links?: { github?: string; demo?: string; npm?: string; docs?: string }
  draft: boolean; published: boolean; locale: 'zh' | 'en'
}

interface Essay {
  title: string; slug: string; description: string; date: string; updated?: string
  draft: boolean; published: boolean; locale: 'zh' | 'en'
  readingTime?: number; wordCount?: number
}

interface About {
  name: string; title: string; avatar: string; introduction: string
  skills: Array<{ name: string; level: number; category: string }>
  experience: Array<{ role: string; company: string; period: string; description: string }>
  socialLinks: { github?: string; linkedin?: string; twitter?: string; email?: string }
  locale: 'zh' | 'en'
}
```

#### Shared Composable Signatures

```typescript
// app/composables/useContent.ts — ALL agents import from this file
export function useContent() {
  getBlogList(locale?, opts?: { limit?, offset?, tag? }) → Promise<BlogPost[]>
  getBlogPost(slug, locale?) → Promise<BlogPost | null>
  getAllBlogTags(locale?) → Promise<string[]>
  getProjectList(locale?, opts?: { limit?, offset? }) → Promise<Project[]>
  getProject(slug, locale?) → Promise<Project | null>
  getFeaturedProjects(locale?, limit?) → Promise<Project[]>
  getEssayList(locale?, opts?: { limit?, offset? }) → Promise<Essay[]>
  getEssay(slug, locale?) → Promise<Essay | null>
  getAbout(locale?) → Promise<About | null>
}
```

#### Step 1: content-composable (serial)

**Agent `content-composable` prompt:**

```
You are implementing the shared content composable. Read these files first:
- D:\programs\personalWeb\CLAUDE.md (especially §"Key Nuxt Content v3 API" — queryCollection(), NOT v2 fetch())
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\content.config.ts (existing collection schemas from Phase 1)

## Your Task
1. Create app/composables/useContent.ts with the following exported functions:
[Insert shared composable signatures from the contract section above]

2. Add readingTime and wordCount computation:
   - In content.config.ts: add `readingTime: z.number().optional()` and `wordCount: z.number().optional()` to blog + essays schemas
   - In nuxt.config.ts: add a valid Nuxt hook key, `hooks: { 'content:file:afterParse'(file) { ... } }`, to compute wordCount from string body and readingTime = ceil(wordCount / 300)
   - (Uses Nuxt Content hooks API, not collection transform(). Verify in Phase 1 pre-flight.)

Hook template:
```typescript
hooks: {
  'content:file:afterParse'(file) {
    const body = typeof file.body === 'string' ? file.body : ''
    const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
    file.wordCount = wordCount
    file.readingTime = Math.max(1, Math.ceil(wordCount / 300))
  }
}
```

## Your File Scope — ONLY these 3 files:
- app/composables/useContent.ts
- content.config.ts (add readingTime/wordCount optional fields to blog + essays schemas ONLY)
- nuxt.config.ts (add hooks.content:file:afterParse — do NOT change existing module config)

## Implementation Notes
- Use queryCollection() from @nuxt/content v3 — NOT v2's fetchContent() or $content()
- Filter by .where('locale', '=', locale) and .where('published', '=', true) for all list functions
- Default locale argument is `'zh'` until Phase 9 wires `useI18n().locale`
- getFeaturedProjects returns top N projects ordered by date DESC
- getAllBlogTags deduplicates tags across all blog posts
- getBlogPost/getProject/getEssay use `.where('slug', '=', slug).where('locale', '=', locale).first()` — NOT `.path(slug)`. File path includes locale dir (e.g. `/blog/zh/my-post`) but URL uses slug only.
- getAbout(locale) uses queryCollection('about').where('locale', '=', locale).first()
```

#### Step 2: home-page (serial)

**Agent `home-page` prompt:**

```
You are implementing Phase 4 (Home Page). Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\app\composables\useContent.ts
- D:\programs\personalWeb\content.config.ts (about collection schema)

## Your Task
Build the home page (/) and about page (/about):
1. app/pages/index.vue — compose all home sections: HeroSection, SkillsSection, ExperienceTimeline, ContactCTA
2. app/pages/about.vue — about page with content from content/about/ via `useContent().getAbout('zh')` (Phase 9 replaces `'zh'` with `locale.value`)
3. All components in app/components/home/ (HeroSection, SkillsSection, SkillBadge, ExperienceTimeline, TimelineItem, ContactCTA)
4. content/about/zh.md and content/about/en.md (sample about data matching the about schema)

## Important: index.vue MUST contain this exact line:
<!-- FEATURED_PROJECTS_PLACEHOLDER -->
Insert it where featured projects should appear. Another agent will replace it.

## Your File Scope — ONLY these files:
- app/pages/index.vue
- app/pages/about.vue
- app/components/home/HeroSection.vue
- app/components/home/SkillsSection.vue
- app/components/home/SkillBadge.vue
- app/components/home/ExperienceTimeline.vue
- app/components/home/TimelineItem.vue
- app/components/home/ContactCTA.vue
- content/about/zh.md
- content/about/en.md

DO NOT create or modify app/composables/useContent.ts — another agent already handled it.
DO NOT call queryCollection() directly in page files; use useContent() wrappers.
DO NOT touch app/pages/blog/, app/pages/projects/, or app/pages/essays/.
```

#### Step 3: blog + project + essay (3 agents in parallel)

**Agent `blog-system` prompt:**

```
You are implementing Phase 5 (Blog System). Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\app\composables\useContent.ts (shared composable)

## Your Task
Build the blog system:
1. app/pages/blog/index.vue — blog listing with search + tag filter
2. app/pages/blog/[slug].vue — blog detail with ContentRenderer, TOC, prev/next
3. All components in app/components/blog/ (BlogPostCard, BlogPostList, PostMeta, PostHeader, PostFooter, TagBadge, BlogFilters, TableOfContents, RelatedPosts, ShareButtons)
4. app/composables/useReadingTime.ts
5. app/composables/useSearch.ts (Fuse.js client-side search)
6. Sample content: 2 blog posts each in content/blog/zh/ and content/blog/en/

Use `useContent()` for all content queries. Do NOT call `queryCollection()` directly in page components.

## Your File Scope — ONLY these files/directories:
- app/pages/blog/index.vue
- app/pages/blog/[slug].vue
- app/components/blog/*.vue
- app/composables/useReadingTime.ts
- app/composables/useSearch.ts
- content/blog/zh/*.md
- content/blog/en/*.md
```

**Agent `project-portfolio` prompt:**

```
You are implementing Phase 6 (Project Portfolio). Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\app\composables\useContent.ts (shared composable)

## Your Task
Build the project portfolio:
1. app/pages/projects/index.vue — project grid
2. app/pages/projects/[slug].vue — project detail
3. All components in app/components/project/ (ProjectCard, ProjectHero, ProjectContent, ProjectTechStack, ProjectGallery, ProjectFilters)
4. app/components/home/FeaturedProjects.vue
5. Sample content: 3 project .md files each in content/projects/zh/ and content/projects/en/

Use `useContent()` for all content queries. Do NOT call `queryCollection()` directly in page components.

## FeaturedProjects Contract (dumb component — parent fetches data)
FeaturedProjects.vue receives projects as a prop, does NOT query data itself:
  defineProps<{ projects: Project[] }>()
In app/pages/index.vue: fetch data with useContent().getFeaturedProjects(locale, 3), pass to <FeaturedProjects :projects="featuredProjects" />

## CRITICAL: After creating FeaturedProjects.vue, edit app/pages/index.vue:
Find <!-- FEATURED_PROJECTS_PLACEHOLDER --> and replace with data fetching + component usage:
  const { locale } = useI18n()
  const { data: featuredProjects } = await useAsyncData(`featured-${locale.value}`, () =>
    useContent().getFeaturedProjects(locale.value, 3)
  )
  // Template: <FeaturedProjects :projects="featuredProjects" />

## Your File Scope — ONLY these files/directories:
- app/pages/projects/index.vue
- app/pages/projects/[slug].vue
- app/components/project/*.vue
- app/components/home/FeaturedProjects.vue
- content/projects/zh/*.md
- content/projects/en/*.md
- app/pages/index.vue (ONLY to replace FEATURED_PROJECTS_PLACEHOLDER — do not change anything else)
```

**Agent `essay-section` prompt:**

```
You are implementing Phase 7 (Essays Section). Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\app\composables\useContent.ts (shared composable)

## Your Task
Build the essays section:
1. app/pages/essays/index.vue — clean chronological list
2. app/pages/essays/[slug].vue — minimal layout, no sidebar
3. All components in app/components/essay/ (EssayCard, EssayList)
4. Sample content: 2 essay .md files each in content/essays/zh/ and content/essays/en/

Use `useContent()` for all content queries. Do NOT call `queryCollection()` directly in page components.

## Your File Scope — ONLY these files/directories:
- app/pages/essays/index.vue
- app/pages/essays/[slug].vue
- app/components/essay/*.vue
- content/essays/zh/*.md
- content/essays/en/*.md
```

**After completion:** Run `pnpm dev`, test all routes. Verify FeaturedProjects appears on home page.

Update the `CLAUDE.md` Implementation status table to show Phases 4-7 completed and Phase 8 not started. The per-phase numbering in fullplan.md is preserved for plan document granularity; the combined execution is a runtime optimization with one writer per shared file.

---

### Phase 8: Contact — 1 Agent (Serial)

| Task | Agent | Files |
|------|-------|-------|
| 8 | `contact` | `app/pages/contact.vue`, `app/components/contact/ContactForm.vue`, `app/components/contact/FormInput.vue`, `app/components/contact/FormTextarea.vue`, `app/components/contact/FormSuccess.vue`, `app/components/contact/SocialLinks.vue`, `app/composables/useForm.ts`, `server/api/contact.post.ts` |

**Agent prompt:**

```
You are implementing Phase 8 (Contact Page). Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md

## Your Task
Build the contact page with form and server endpoint:
1. app/pages/contact.vue
2. Components: ContactForm, FormInput, FormTextarea, FormSuccess, SocialLinks
3. app/composables/useForm.ts — validation + honeypot + timestamp check
4. server/api/contact.post.ts — Nitro server route using Resend API

## Your File Scope — ONLY these files:
- app/pages/contact.vue
- app/components/contact/*.vue
- app/composables/useForm.ts
- server/api/contact.post.ts

## Acceptance Criteria
- Form validates required fields (name, email, subject, message)
- Honeypot field catches bots
- Timestamp check rejects submissions < 3 seconds
- Server route sends email via Resend API
- Success/error states displayed to user
```

**After completion:** Test form submission end-to-end. Update the `CLAUDE.md` Implementation status table to Phase 9 not started.

---

### Phase 9: i18n — 1 Agent (Serial)

| Task | Agent | Files |
|------|-------|-------|
| 9 | `i18n` | `nuxt.config.ts` (extend — NOT replace — the Phase 1 i18n placeholder), `locales/zh.json`, `locales/en.json`, `app/components/core/LanguageSwitcher.vue`, `app/middleware/i18n.global.ts`, `app/utils/date.ts`, plus ALL existing page files: `app/pages/index.vue`, `app/pages/about.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[slug].vue`, `app/pages/projects/index.vue`, `app/pages/projects/[slug].vue`, `app/pages/essays/index.vue`, `app/pages/essays/[slug].vue`, `app/pages/contact.vue` |

**Can't parallelize:** Touches nearly every file for locale wiring. One agent, consistent changes.

**i18n change template (agent must follow this pattern for every page):**

```vue
<!-- BEFORE (Phase 4-8 output) — example for blog/index.vue -->
<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () =>
  useContent().getBlogList('zh')
)
</script>

<!-- AFTER (Phase 9 i18n) -->
<script setup lang="ts">
const { locale } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const { data: posts } = await useAsyncData(`blog-${locale.value}`, () =>
  useContent().getBlogList(locale.value)
)
</script>
```

**Agent prompt:**

```
You are implementing Phase 9 (i18n) of a Nuxt personal website. Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\nuxt.config.ts (see existing i18n placeholder config)

## Your Task
Wire up multi-language support everywhere:
1. Extend nuxt.config.ts i18n section: add vueI18n config path, detectBrowserLanguage, lazy loading
2. Create locales/zh.json and locales/en.json with ALL UI strings (nav labels, headings, form labels, aria labels, dates)
3. Create app/components/core/LanguageSwitcher.vue
4. Create app/middleware/i18n.global.ts only if needed. Default policy: `/` remains Chinese and does not auto-redirect by browser language; LanguageSwitcher handles explicit user choice. If browser detection is enabled later, only redirect first root visit with no locale cookie and keep canonical/hreflang correct.
5. Create app/utils/date.ts (locale-aware date formatting for zh-CN and en-US)
6. Update EVERY page file to add: useI18n() locale ref, useHead htmlAttrs lang, and pass `locale.value` into existing `useContent()` calls. Do not add raw `queryCollection()` calls to pages.

## Change Pattern — apply to every page:
[Insert i18n change template from above]

## Your File Scope — ONLY these files:
- nuxt.config.ts (EXTEND i18n section, do NOT remove existing config)
- locales/zh.json
- locales/en.json
- app/components/core/LanguageSwitcher.vue
- app/middleware/i18n.global.ts
- app/utils/date.ts
- app/pages/index.vue
- app/pages/about.vue
- app/pages/blog/index.vue
- app/pages/blog/[slug].vue
- app/pages/projects/index.vue
- app/pages/projects/[slug].vue
- app/pages/essays/index.vue
- app/pages/essays/[slug].vue
- app/pages/contact.vue

## Acceptance Criteria
- / → default Chinese, no URL prefix
- /en/ → English version
- /en/blog/ → English blog listing
- Language switcher toggles locale, preserves current page
- Date formatting differs per locale (2026年5月22日 vs May 22, 2026)
- hreflang tags in <head> for SEO
- pnpm dev + pnpm test + npx nuxi generate all pass
```

**After completion:** Test all routes in both zh and en. Verify `/en/` prefix works, default locale has no prefix. Update the `CLAUDE.md` Implementation status table to Phase 10 not started.

---

### Phase 10: SEO & Performance — 1 Agent (Serial)

| Task | Agent | Files |
|------|-------|-------|
| 10 | `seo` | `app/composables/useSeo.ts`, `nuxt.config.ts` (enable sitemap, finalize prerender routes), `app/utils/constants.ts`, `public/robots.txt`, plus ALL existing page files: `app/pages/index.vue`, `app/pages/about.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[slug].vue`, `app/pages/projects/index.vue`, `app/pages/projects/[slug].vue`, `app/pages/essays/index.vue`, `app/pages/essays/[slug].vue`, `app/pages/contact.vue` |

**SEO change template (agent must follow this pattern for every page):**

```vue
<!-- BEFORE (Phase 9 i18n output) — example for blog/[slug].vue -->
<script setup lang="ts">
const { locale } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })
const route = useRoute()
const { data: post } = await useAsyncData(`blog-${locale.value}-${route.params.slug}`, () =>
  useContent().getBlogPost(String(route.params.slug), locale.value)
)
</script>

<!-- AFTER (Phase 10 SEO) -->
<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

// Fetch data FIRST, then use it in SEO
const { data: post } = await useAsyncData(`blog-${locale.value}-${route.params.slug}`, () =>
  useContent().getBlogPost(String(route.params.slug), locale.value)
)

useSeo({
  title: () => post.value?.title || 'Blog',
  description: () => post.value?.description || '',
  image: () => post.value?.image || '/images/og-default.png',
  url: () => `/${locale.value === 'en' ? 'en/' : ''}blog/${route.params.slug}`,
  type: 'article',
  publishedAt: () => post.value?.date
})
</script>
```

**Agent prompt:**

```
You are implementing Phase 10 (SEO & Performance) of a Nuxt personal website. Read these files first:
- D:\programs\personalWeb\CLAUDE.md
- D:\programs\personalWeb\fullplan.md
- D:\programs\personalWeb\app.config.ts (site metadata for SEO defaults)
- D:\programs\personalWeb\nuxt.config.ts (sitemap + prerender config)

## Your Task
1. Create app/composables/useSeo.ts — a composable that wraps useHead() with OG/Twitter meta tags. Accepts: title, description, image, url, type, publishedAt (optional)
2. Enable @nuxtjs/sitemap in nuxt.config.ts (remove Phase 1's `enabled: false`), configure crawlLinks + prerender routes
3. Enable nuxt-og-image in nuxt.config.ts modules + create default OG image template at app/components/OgImage.vue (or configure static fallback via app.config.ts ogImage path)
4. Create app/utils/constants.ts — pagination sizes, breakpoint values, social link URLs
5. Create public/robots.txt (allow all, point to sitemap)
6. Add useSeo() call to EVERY page file — follow the change template below

## SEO Change Pattern — apply to every page:
[Insert SEO change template from above]

## Your File Scope — ONLY these files:
- app/composables/useSeo.ts
- nuxt.config.ts (enable sitemap, extend prerender routes)
- app/utils/constants.ts
- public/robots.txt
- app/pages/index.vue
- app/pages/about.vue
- app/pages/blog/index.vue
- app/pages/blog/[slug].vue
- app/pages/projects/index.vue
- app/pages/projects/[slug].vue
- app/pages/essays/index.vue
- app/pages/essays/[slug].vue
- app/pages/contact.vue

## Acceptance Criteria
- Every page has OG title, description, image, url, type in <head>
- Sitemap generated at /sitemap.xml
- robots.txt exists at /robots.txt
- npx nuxi generate succeeds with all routes prerendered
- Lighthouse score ≥ 95 on all categories (Performance, Accessibility, Best Practices, SEO)
```

**After completion:** Run `npx nuxi generate`, verify sitemap.xml/robots.txt exist, run Lighthouse. Update the `CLAUDE.md` Implementation status table to Phase 11 not started.

---

### Phase 11: Content Creation — 4 Agents (Parallel)

| Task | Agent | Files |
|------|-------|-------|
| 11a | `content-blog` | `content/blog/zh/*.md`, `content/blog/en/*.md` — 3 blog posts (zh + en) |
| 11b | `content-projects` | `content/projects/zh/*.md`, `content/projects/en/*.md` — 4 project entries (zh + en) |
| 11c | `content-essays` | `content/essays/zh/*.md`, `content/essays/en/*.md` — 3 essays (zh + en) |
| 11d | `polish` | `app/components/**/*.vue` (micro-animations, hover effects), `app/pages/**/*.vue` (visual refinement), `content.config.ts` (register MDC components: Notice.vue, CodeSandbox.vue), `public/favicon.ico` — no structural changes to components |

**Parallel safe:** Agents 11a/11b/11c write different `content/` subdirectories. Agent 11d touches `app/` files for visual polish only (Tailwind animation classes, spacing tweaks) and registers MDC components in content.config.ts — no structural or logic changes.

**After completion:** Full manual QA. Update the `CLAUDE.md` Implementation status table to Phase 12 not started.

---

### Phase 12: Deployment — 1 Agent (Serial)

| Task | Agent | Files |
|------|-------|-------|
| 12 | `deploy` | `.github/workflows/deploy.yml`, `wrangler.toml` (finalize) |

---

## Quality Gates (Orchestrator Checks After Each Phase)

After EACH phase (or parallel batch), run:

**Bash (Git Bash / WSL):**
```bash
# 1. Dev server quick check
pnpm dev &
sleep 5
curl -s http://localhost:3000 | head -20
kill %1

# 2. Tests pass
pnpm test

# 3. SSG build succeeds
npx nuxi generate

# 4. TypeScript check
pnpm typecheck
```

**PowerShell:**
```powershell
# 1. Dev server quick check
$proc = Start-Process pnpm -ArgumentList "dev" -PassThru -NoNewWindow
Start-Sleep 5
try { Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing | Select-Object -First 20 } catch {}
Stop-Process $proc.Id -Force

# 2. Tests pass
pnpm test

# 3. SSG build succeeds
npx nuxi generate

# 4. TypeScript check
pnpm typecheck
```

If any gate fails, read the error, identify which agent's code caused it, and re-dispatch that agent with the error context. Do NOT fix code yourself — send it back.

---

## File Conflict Matrix (Quick Reference)

| File | Phases That Touch It | Conflict Resolution |
|------|---------------------|---------------------|
| `nuxt.config.ts` | 1, 3, 5 (hooks.content:file:afterParse), 9, 10 | Serial execution only. Phase 5 adds content hooks only — does not touch module config from Phase 1/3. |
| `app.config.ts` | 1 | Once |
| `content.config.ts` | 1 (creates all 4 schemas), 5 (adds readingTime/wordCount optional fields to blog/essays), 11d (registers MDC components) | All serial. Operations are non-overlapping: schema creation → optional field addition → MDC registration |
| `app/assets/css/main.css` | 1, 3 | Serial |
| `app/composables/useContent.ts` | 5 (content-composable creates) → read-only import by home/blog/project/essay agents | Created in Step 1 serial. Page agents import it read-only. |
| `app/pages/index.vue` | 4 (creates), 6 (replaces placeholder) | Phase 4 then Phase 6 |
| `app/components/ui/*` | 2a (create), 3 (add dark styles) | Serial |
| `app/components/core/*` | 2b (create), 3 (dark styles), 9 (i18n) | Serial |
| All page files | 4-8 (create), 9 (i18n), 10 (SEO) | Serial |

---

## Agent Prompt Template

Use this structure when dispatching any agent. Fill in `[...]` brackets per task.

```
You are implementing part of a Nuxt personal website. Read these files first:
- D:\programs\personalWeb\CLAUDE.md (project conventions)
- D:\programs\personalWeb\fullplan.md (architecture overview)
- D:\programs\personalWeb\plan[N].md (if it exists for this phase)

## Your Task
[What to build, specifics about the feature]

## Your File Scope
You are ONLY allowed to create/modify files in these paths:
- [explicit file/directory list]

DO NOT touch any other files. If you think you need to change a file outside your scope, report it instead.

## Contract — Component Props
[Relevant prop signatures for this task]

## Contract — Composables
[Relevant composable signatures for this task]

## Acceptance Criteria
- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] Components render without errors
- [ ] pnpm test passes (if tests exist)

After implementation, verify by running: [verification command]
```
