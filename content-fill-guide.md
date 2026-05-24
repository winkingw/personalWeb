# Content Fill Guide

This file is the handoff checklist for replacing placeholder/demo content with real personal content.

Do not edit `dist/`; it is generated output. Edit the source files listed below, then run:

```bash
pnpm typecheck
pnpm test
npx nuxi generate
```

## Current Design Version

Accepted version:

- Commit: `d52d7c7`
- Tag: `design-v5-extended-hover-color`
- Design source of truth: `design.md`

## How To Decide Content

- Chinese is primary/default.
- English is secondary under `/en/`.
- For bilingual content, keep `slug` aligned between zh/en pairs unless you intentionally want different URLs.
- If a post/project/essay is not ready, set:

```yaml
draft: true
published: false
```

If it should appear publicly, set:

```yaml
draft: false
published: true
```

## Priority 1: Required Before Public Launch

### 1. Site Identity

File: `app.config.ts`

Fill these:

```ts
site: {
  name: '',              // Your display name / brand name
  description: '',       // Short site description for SEO/footer
  ogImage: '',           // Default social share image path
  socialLinks: {
    github: '',
    linkedin: '',
    email: '',
  },
}
```

Current placeholders:

- `Takagi San`
- `Personal website - tech blog, projects, essays`
- Empty social links

Decision needed:

- [ ] Public display name
- [ ] Site tagline/description
- [ ] GitHub URL
- [ ] LinkedIn URL
- [ ] Email address
- [ ] Default OG image

### 2. Deployment And Contact Environment

Files:

- `.github/workflows/deploy.yml`
- `wrangler.toml`
- `server/api/contact.post.ts`

Values to configure outside the codebase:

```text
SITE_URL=https://your-domain.com
CONTACT_TO_EMAIL=your-real-inbox@example.com
RESEND_TO_EMAIL=your-real-inbox@example.com
RESEND_API_KEY=your-resend-api-key
CLOUDFLARE_API_TOKEN=your-cloudflare-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
```

Decision needed:

- [ ] Final public domain
- [ ] Contact form recipient email
- [ ] Whether to use Resend production delivery
- [ ] Verified Resend sender domain

Code note:

- `CONTACT_TO_EMAIL` or `RESEND_TO_EMAIL` receives contact form messages.
- Visitor email is used as `reply_to`.
- Current sender is `onboarding@resend.dev`; replace after your Resend domain is verified if needed.

## Priority 2: Home And About Content

Files:

- `content/about/zh.md`
- `content/about/en.md`

These files power:

- Home hero name/title/description
- Home skills
- Home experience timeline
- About page long bio
- About page social links

### Editable Fields

```yaml
name: ''
title: ''
avatar: /images/avatar.png
introduction: |
  ...
skills:
  - name: ''
    level: 90
    category: ''
experience:
  - role: ''
    company: ''
    period: ''
    description: ''
socialLinks:
  github: ''
  linkedin: ''
  twitter: ''
  email: ''
```

Current placeholders:

- `Takagi San`
- `Full-Stack Developer`
- `Tech Company A`
- `Startup B`
- `Agency C`
- `https://github.com`
- `https://linkedin.com`
- `https://twitter.com`
- `hello@example.com`

Decision needed:

- [ ] Real name / display name
- [ ] **Editable title:** hero professional title
- [ ] Short intro for homepage
- [ ] Long About page bio
- [ ] Avatar image
- [ ] Skill categories
- [ ] Skill names and levels
- [ ] Experience entries
- [ ] Social links

### Editable Title Options

Current title:

- `Full-Stack Developer`

Possible title directions:

- `Creative Developer`
- `Frontend Engineer`
- `Full-Stack Developer`
- `Product-Minded Engineer`
- `Independent Developer`
- `Designer & Developer`
- `AI Product Engineer`

Your decision:

```text
Chosen Chinese title:

Chosen English title:

Reason / tone:
```

## Priority 3: Homepage Section Titles And UI Copy

Files:

- `i18n/locales/zh.json`
- `i18n/locales/en.json`
- `app/components/home/PhotographyShowcase.vue`

### Editable Titles

These are visible section/menu titles. You can keep them or rename them.

| Area | Current zh | Current en | File |
| --- | --- | --- | --- |
| Navigation Home | 首页 | Home | `i18n/locales/*.json` |
| Navigation About | 关于 | About | `i18n/locales/*.json` |
| Navigation Blog | 博客 | Blog | `i18n/locales/*.json` |
| Navigation Projects | 项目 | Projects | `i18n/locales/*.json` |
| Navigation Essays | 随笔 | Essays | `i18n/locales/*.json` |
| Navigation Contact | 联系 | Contact | `i18n/locales/*.json` |
| Photography title | 影像练习 | Visual Studies | `PhotographyShowcase.vue` |
| Skills title | 技能 | Skills | `i18n/locales/*.json` |
| Experience title | 经历 | Experience | `i18n/locales/*.json` |
| Featured Projects | 精选项目 | Featured Projects | `i18n/locales/*.json` |
| Contact CTA | Contact section title | Contact section title | `i18n/locales/*.json` |

Decision needed:

- [ ] Keep `项目` or rename to `作品`
- [ ] Keep `随笔` or rename to `札记` / `笔记`
- [ ] Keep `影像练习` or rename to another photography title
- [ ] Keep `技能` or rename to `能力` / `技术栈`
- [ ] Keep `经历` or rename to `时间线` / `履历`

Your title decisions:

```text
Home nav:
About nav:
Blog nav:
Projects nav:
Essays nav:
Contact nav:
Photography section:
Skills section:
Experience section:
Featured projects section:
Contact CTA:
```

## Priority 4: Project Portfolio Content

Folder:

- `content/projects/zh/`
- `content/projects/en/`

Each project has a zh/en pair. Replace demo projects with your real projects, or keep some and rewrite them.

### Project Fields

```yaml
title: ''
slug: ''
summary: ''
date: YYYY-MM-DD
techStack:
  - ''
links:
  github: ''
  demo: ''
  docs: ''
  npm: ''
image: /images/projects/...
draft: false
published: true
locale: zh
```

Editable title:

- `title` can be changed freely.
- `slug` controls the URL. Change carefully, and keep zh/en slugs paired if they describe the same project.

Current project files:

| File | Current project | Needs decision |
| --- | --- | --- |
| `content/projects/zh/personal-website.md` | Personal Website | Replace title/content/links or keep as real site project |
| `content/projects/en/personal-website.md` | Personal Website | English version |
| `content/projects/zh/cli-task-manager.md` | CLI Task Manager | Replace or rewrite |
| `content/projects/en/cli-task-manager.md` | CLI Task Manager | English version |
| `content/projects/zh/markdown-image-optimizer.md` | Markdown Image Optimizer | Replace or rewrite |
| `content/projects/en/markdown-image-optimizer.md` | Markdown Image Optimizer | English version |
| `content/projects/zh/vue-component-library.md` | Vue Component Library | Replace or rewrite |
| `content/projects/en/vue-component-library.md` | Vue Component Library | English version |

Current placeholder links to replace:

- `https://github.com`
- `https://example.com`
- `https://docs.example.com`

Decision template per project:

```text
Project 1
Chinese title:
English title:
Slug:
One-line summary:
Long description:
Tech stack:
GitHub:
Demo:
Docs:
NPM:
Image path:
Published now? yes/no

Project 2
Chinese title:
English title:
Slug:
One-line summary:
Long description:
Tech stack:
GitHub:
Demo:
Docs:
NPM:
Image path:
Published now? yes/no
```

## Priority 5: Blog Content

Folder:

- `content/blog/zh/`
- `content/blog/en/`

Current files are demo technical articles. Replace them with real articles or mark them unpublished.

### Blog Fields

```yaml
title: ''
slug: ''
description: ''
date: YYYY-MM-DD
tags:
  - ''
image: /images/blog/...
draft: false
published: true
locale: zh
```

Editable title:

- `title` is visible in lists, detail pages, SEO, OG.
- `slug` controls URL.

Current blog files:

| File | Current topic | Needs decision |
| --- | --- | --- |
| `content/blog/zh/getting-started-nuxt-4.md` | Getting Started with Nuxt 4 | Replace/rewrite/unpublish |
| `content/blog/en/getting-started-nuxt-4.md` | Getting Started with Nuxt 4 | English version |
| `content/blog/zh/modern-css-2026.md` | Modern CSS in 2026 | Replace/rewrite/unpublish |
| `content/blog/en/modern-css-2026.md` | Modern CSS in 2026 | English version |
| `content/blog/zh/typescript-best-practices-2026.md` | TypeScript Best Practices 2026 | Replace/rewrite/unpublish |
| `content/blog/en/typescript-best-practices-2026.md` | TypeScript Best Practices 2026 | English version |

Decision template per article:

```text
Article 1
Chinese title:
English title:
Slug:
Description:
Tags:
Cover image:
Outline:
Published now? yes/no

Article 2
Chinese title:
English title:
Slug:
Description:
Tags:
Cover image:
Outline:
Published now? yes/no
```

## Priority 6: Essays Content

Folder:

- `content/essays/zh/`
- `content/essays/en/`

Current files are demo personal essays. Replace them with your own writing or mark them unpublished.

### Essay Fields

```yaml
title: ''
slug: ''
description: ''
date: YYYY-MM-DD
draft: false
published: true
locale: zh
```

Editable title:

- `title` is visible on cards/detail pages.
- `slug` controls URL.

Current essay files:

| File | Current topic | Needs decision |
| --- | --- | --- |
| `content/essays/zh/open-source-journey.md` | Open source journey | Replace/rewrite/unpublish |
| `content/essays/en/open-source-journey.md` | Open source journey | English version |
| `content/essays/zh/finding-balance-remote-work.md` | Remote work balance | Replace/rewrite/unpublish |
| `content/essays/en/finding-balance-remote-work.md` | Remote work balance | English version |
| `content/essays/zh/thoughts-on-tech-and-life.md` | Tech and life thoughts | Replace/rewrite/unpublish |
| `content/essays/en/thoughts-on-tech-and-life.md` | Tech and life thoughts | English version |

Decision template per essay:

```text
Essay 1
Chinese title:
English title:
Slug:
Description:
Theme / feeling:
Outline:
Published now? yes/no
```

## Priority 7: Images To Replace Or Confirm

Current public images:

| Path | Used for | Decision |
| --- | --- | --- |
| `public/images/hero-subject.jpg` | Homepage main subject and first photography card | Keep/replace |
| `public/images/avatar.png` | About avatar | Replace with real avatar or keep stylized image |
| `public/images/og-default.png` | Social share default image | Replace with final branded OG image |
| `public/images/blog/nuxt.png` | Blog cover | Replace if article changes |
| `public/images/blog/typescript.png` | Blog/photography card cover | Replace if article changes |
| `public/images/projects/personal-web.png` | Project cover and photography card | Replace if project changes |
| `public/images/projects/cli-task.png` | Project cover and photography card | Replace if project changes |
| `public/images/projects/img-opt.png` | Project cover | Replace if project changes |

Decision needed:

- [ ] Keep current hero subject image?
- [ ] Choose real avatar image
- [ ] Choose final OG share image
- [ ] Choose project cover images
- [ ] Choose blog cover images
- [ ] Choose photography card images and their hover colors

## Priority 8: Photography Showcase Content

File:

- `app/components/home/PhotographyShowcase.vue`

Current cards:

| Current title | Image | Hover tone |
| --- | --- | --- |
| Soft Portrait | `/images/hero-subject.jpg` | soft pink |
| Interface Glow | `/images/projects/personal-web.png` | green |
| Warm System | `/images/projects/cli-task.png` | orange |
| Blue Archive | `/images/blog/typescript.png` | blue |

Editable title:

- Card titles can be renamed.
- The section title `影像练习 / Visual Studies` can be renamed.
- Each card can link to About, a project, a blog post, or a future photography detail page.

Decision template:

```text
Photography section title zh:
Photography section title en:
Description zh:
Description en:

Card 1 title:
Card 1 subtitle/meta:
Card 1 image:
Card 1 link:
Card 1 dominant color:

Card 2 title:
Card 2 subtitle/meta:
Card 2 image:
Card 2 link:
Card 2 dominant color:
```

## Priority 9: Optional UI Copy

Files:

- `i18n/locales/zh.json`
- `i18n/locales/en.json`

You can edit:

- Navigation labels
- Footer labels
- Blog list descriptions
- Project list descriptions
- Essay list descriptions
- Contact form labels
- Contact success/error messages
- Home CTA text

Decision needed:

```text
Overall tone:
Formal / minimal / personal / playful / technical / editorial

Chinese voice:

English voice:

Words to avoid:

Words to prefer:
```

## Fill Order Recommendation

1. Fill `app.config.ts`.
2. Fill `content/about/zh.md` and `content/about/en.md`.
3. Decide section titles in `i18n/locales/*.json` and `PhotographyShowcase.vue`.
4. Replace project content and links.
5. Replace blog/essay demo content or mark unpublished.
6. Replace images.
7. Set deployment/contact env vars.
8. Run quality gates.

## Final Public Launch Checklist

- [ ] No `example.com` remains in public content links unless intentional.
- [ ] No `github.com` root placeholder remains.
- [ ] No `linkedin.com` root placeholder remains.
- [ ] No `hello@example.com` remains.
- [ ] No fake company names remain.
- [ ] Chinese and English content match in meaning.
- [ ] All published content has real title, summary, and body.
- [ ] All published projects have valid links or empty omitted links.
- [ ] Contact recipient env var is configured.
- [ ] `SITE_URL` is configured to the real domain.
- [ ] `npx nuxi generate` completes successfully.
