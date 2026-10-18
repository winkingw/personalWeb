# 内容填充指南

本文件是将占位/演示内容替换为真实个人内容的交接清单。

请勿编辑 `dist/` 目录，它是生成的输出。编辑下方列出的源文件，然后运行：

```bash
pnpm typecheck
pnpm test
npx nuxi generate
```

## 当前设计版本

已确认的版本：

- 提交: `d52d7c7`
- 标签: `design-v5-extended-hover-color`
- 设计来源: `design.md`

## 如何确定内容

- 中文为主要/默认语言。
- 英文为次要语言，位于 `/en/` 路径下。
- 对于双语内容，保持中文和英文配对的 `slug` 一致，除非你刻意想要不同的 URL。
- 如果某篇文章/项目/随笔尚未准备好，设置为：

```yaml
draft: true
published: false
```

如果应该公开展示，设置为：

```yaml
draft: false
published: true
```

## 优先级 1：公开发布前必须完成

### 1. 站点标识

文件: `app.config.ts`

填写以下内容：

```ts
site: {
  name: 'Takagi—San',              // 你的显示名称 / 品牌名称
  description: '我的个人网页',       // 用于 SEO/页脚的简短站点描述
  ogImage: '',           // 默认社交分享图片路径
  socialLinks: {
    github: 'https://github.com/winkingw',
    linkedin: '',
    email: '2428593329@qq.com',
  },
}
```

当前占位内容：

- `Takagi San`
- `Personal website - tech blog, projects, essays`
- 空的社交链接

需要决定：

- [ ] 公开显示名称
- [ ] 站点标语/描述
- [ ] GitHub 地址
- [ ] LinkedIn 地址
- [ ] 电子邮箱
- [ ] 默认 OG 图片

### 2. 部署与联系表单环境

文件：

- `.github/workflows/deploy.yml`
- `wrangler.toml`
- `server/api/contact.post.ts`

需要在代码库之外配置的值：

```text
SITE_URL=https://your-domain.com
CONTACT_TO_EMAIL=your-real-inbox@example.com
RESEND_TO_EMAIL=your-real-inbox@example.com
RESEND_API_KEY=your-resend-api-key
CLOUDFLARE_API_TOKEN=your-cloudflare-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
```

需要决定：

- [ ] 最终公开域名
- [ ] 联系表单接收邮箱
- [ ] 是否使用 Resend 生产环境投递
- [ ] 已验证的 Resend 发件域名

代码说明：

- `CONTACT_TO_EMAIL` 或 `RESEND_TO_EMAIL` 用于接收联系表单消息。
- 访客邮箱用作 `reply_to`。
- 当前发件地址为 `onboarding@resend.dev`；如有需要，在 Resend 域名验证通过后替换。

## 优先级 2：首页与关于页内容

文件：

- `content/about/zh.md`
- `content/about/en.md`

这些文件驱动：

- 首页 Hero 区域的姓名/职位/描述
- 首页技能展示
- 首页经历时间线
- 关于页长文个人介绍
- 关于页社交链接

### 可编辑字段

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

当前占位内容：

- `Takagi San`
- `Full-Stack Developer`
- `Tech Company A`
- `Startup B`
- `Agency C`
- `https://github.com`
- `https://linkedin.com`
- `https://twitter.com`
- `hello@example.com`

需要决定：

- [ ] 真实姓名 / 显示名称
- [ ] **可编辑的职位：** Hero 区域专业职称
- [ ] 首页简短介绍
- [ ] 关于页长文介绍
- [ ] 头像图片
- [ ] 技能类别
- [ ] 技能名称与水平
- [ ] 经历条目
- [ ] 社交链接

### 可编辑的职位选项

当前职位：

- `Full-Stack Developer`

可选职位方向：

- `Creative Developer`（创意开发者）
- `Frontend Engineer`（前端工程师）
- `Full-Stack Developer`（全栈开发者）
- `Product-Minded Engineer`（产品思维工程师）
- `Independent Developer`（独立开发者）
- `Designer & Developer`（设计师兼开发者）
- `AI Product Engineer`（AI 产品工程师）

你的决定：

```text
选择的中文职位:

选择的英文职位:

理由 / 语气:
```

## 优先级 3：首页段落标题与界面文案

文件：

- `i18n/locales/zh.json`
- `i18n/locales/en.json`
- `app/components/home/PhotographyShowcase.vue`

### 可编辑标题

以下是可见的段落/菜单标题。可以保留或重命名。

| 区域 | 当前中文 | 当前英文 | 文件 |
| --- | --- | --- | --- |
| 导航-首页 | 首页 | Home | `i18n/locales/*.json` |
| 导航-关于 | 关于 | About | `i18n/locales/*.json` |
| 导航-博客 | 博客 | Blog | `i18n/locales/*.json` |
| 导航-项目 | 项目 | Projects | `i18n/locales/*.json` |
| 导航-随笔 | 随笔 | Essays | `i18n/locales/*.json` |
| 导航-联系 | 联系 | Contact | `i18n/locales/*.json` |
| 摄影标题 | 影像练习 | Visual Studies | `PhotographyShowcase.vue` |
| 技能标题 | 技能 | Skills | `i18n/locales/*.json` |
| 经历标题 | 经历 | Experience | `i18n/locales/*.json` |
| 精选项目 | 精选项目 | Featured Projects | `i18n/locales/*.json` |
| 联系 CTA | 联系段落标题 | 联系段落标题 | `i18n/locales/*.json` |

需要决定：

- [ ] 保留 `项目` 还是改为 `作品`
- [ ] 保留 `随笔` 还是改为 `札记` / `笔记`
- [ ] 保留 `影像练习` 还是改为其他摄影标题
- [ ] 保留 `技能` 还是改为 `能力` / `技术栈`
- [ ] 保留 `经历` 还是改为 `时间线` / `履历`

你的标题决定：

```text
首页导航:
关于导航:
博客导航:
项目导航:
随笔导航:
联系导航:
摄影段落:
技能段落:
经历段落:
精选项目段落:
联系 CTA:
```

## 优先级 4：项目作品集内容

文件夹：

- `content/projects/zh/`
- `content/projects/en/`

每个项目都有一对中英文文件。将演示项目替换为你的真实项目，或保留部分并重写。

### 项目字段

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

可编辑标题：

- `title` 可以自由修改。
- `slug` 控制 URL。请谨慎修改，如果中英文 slug 描述的是同一个项目，请保持它们配对一致。

当前项目文件：

| 文件 | 当前项目 | 需要决定 |
| --- | --- | --- |
| `content/projects/zh/personal-website.md` | Personal Website | 替换标题/内容/链接，或保留作为真实站点项目 |
| `content/projects/en/personal-website.md` | Personal Website | 英文版本 |
| `content/projects/zh/cli-task-manager.md` | CLI Task Manager | 替换或重写 |
| `content/projects/en/cli-task-manager.md` | CLI Task Manager | 英文版本 |
| `content/projects/zh/markdown-image-optimizer.md` | Markdown Image Optimizer | 替换或重写 |
| `content/projects/en/markdown-image-optimizer.md` | Markdown Image Optimizer | 英文版本 |
| `content/projects/zh/vue-component-library.md` | Vue Component Library | 替换或重写 |
| `content/projects/en/vue-component-library.md` | Vue Component Library | 英文版本 |

当前需要替换的占位链接：

- `https://github.com`
- `https://example.com`
- `https://docs.example.com`

每个项目的决策模板：

```text
项目 1
中文标题:
英文标题:
Slug:
一句话摘要:
详细描述:
技术栈:
GitHub:
Demo:
文档:
NPM:
图片路径:
是否现在发布? 是/否

项目 2
中文标题:
英文标题:
Slug:
一句话摘要:
详细描述:
技术栈:
GitHub:
Demo:
文档:
NPM:
图片路径:
是否现在发布? 是/否
```

## 优先级 5：博客内容

文件夹：

- `content/blog/zh/`
- `content/blog/en/`

当前文件为演示技术文章。将其替换为真实文章或标记为未发布。

### 博客字段

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

可编辑标题：

- `title` 在列表、详情页、SEO、OG 中均可见。
- `slug` 控制 URL。

当前博客文件：

| 文件 | 当前主题 | 需要决定 |
| --- | --- | --- |
| `content/blog/zh/getting-started-nuxt-4.md` | Getting Started with Nuxt 4 | 替换/重写/取消发布 |
| `content/blog/en/getting-started-nuxt-4.md` | Getting Started with Nuxt 4 | 英文版本 |
| `content/blog/zh/modern-css-2026.md` | Modern CSS in 2026 | 替换/重写/取消发布 |
| `content/blog/en/modern-css-2026.md` | Modern CSS in 2026 | 英文版本 |
| `content/blog/zh/typescript-best-practices-2026.md` | TypeScript Best Practices 2026 | 替换/重写/取消发布 |
| `content/blog/en/typescript-best-practices-2026.md` | TypeScript Best Practices 2026 | 英文版本 |

每篇文章的决策模板：

```text
文章 1
中文标题:
英文标题:
Slug:
描述:
标签:
封面图:
大纲:
是否现在发布? 是/否

文章 2
中文标题:
英文标题:
Slug:
描述:
标签:
封面图:
大纲:
是否现在发布? 是/否
```

## 优先级 6：随笔内容

文件夹：

- `content/essays/zh/`
- `content/essays/en/`

当前文件为演示个人随笔。将其替换为你自己的写作内容或标记为未发布。

### 随笔字段

```yaml
title: ''
slug: ''
description: ''
date: YYYY-MM-DD
draft: false
published: true
locale: zh
```

可编辑标题：

- `title` 在卡片/详情页可见。
- `slug` 控制 URL。

当前随笔文件：

| 文件 | 当前主题 | 需要决定 |
| --- | --- | --- |
| `content/essays/zh/open-source-journey.md` | 开源之旅 | 替换/重写/取消发布 |
| `content/essays/en/open-source-journey.md` | 开源之旅 | 英文版本 |
| `content/essays/zh/finding-balance-remote-work.md` | 远程工作平衡 | 替换/重写/取消发布 |
| `content/essays/en/finding-balance-remote-work.md` | 远程工作平衡 | 英文版本 |
| `content/essays/zh/thoughts-on-tech-and-life.md` | 科技与人生思考 | 替换/重写/取消发布 |
| `content/essays/en/thoughts-on-tech-and-life.md` | 科技与人生思考 | 英文版本 |

每篇随笔的决策模板：

```text
随笔 1
中文标题:
英文标题:
Slug:
描述:
主题 / 感觉:
大纲:
是否现在发布? 是/否
```

## 优先级 7：需要替换或确认的图片

当前公开图片：

| 路径 | 用途 | 决定 |
| --- | --- | --- |
| `public/images/hero-subject.jpg` | 首页主体图片及第一张摄影卡片 | 保留/替换 |
| `public/images/avatar.png` | 关于页头像 | 替换为真实头像或保留风格化图片 |
| `public/images/og-default.png` | 社交分享默认图片 | 替换为最终品牌 OG 图片 |
| `public/images/blog/nuxt.png` | 博客封面 | 如文章变更则替换 |
| `public/images/blog/typescript.png` | 博客/摄影卡片封面 | 如文章变更则替换 |
| `public/images/projects/personal-web.png` | 项目封面及摄影卡片 | 如项目变更则替换 |
| `public/images/projects/cli-task.png` | 项目封面及摄影卡片 | 如项目变更则替换 |
| `public/images/projects/img-opt.png` | 项目封面 | 如项目变更则替换 |

需要决定：

- [ ] 保留当前 Hero 主体图片？
- [ ] 选择真实头像图片
- [ ] 选择最终 OG 分享图片
- [ ] 选择项目封面图片
- [ ] 选择博客封面图片
- [ ] 选择摄影卡片图片及其悬停颜色

## 优先级 8：摄影展示内容

文件：

- `app/components/home/PhotographyShowcase.vue`

当前卡片：

| 当前标题 | 图片 | 悬停色调 |
| --- | --- | --- |
| Soft Portrait | `/images/hero-subject.jpg` | 柔粉色 |
| Interface Glow | `/images/projects/personal-web.png` | 绿色 |
| Warm System | `/images/projects/cli-task.png` | 橙色 |
| Blue Archive | `/images/blog/typescript.png` | 蓝色 |

可编辑标题：

- 卡片标题可以重命名。
- 段落标题 `影像练习 / Visual Studies` 可以重命名。
- 每张卡片可以链接到关于页、项目、博客文章或未来的摄影详情页。

决策模板：

```text
摄影段落中文标题:
摄影段落英文标题:
中文描述:
英文描述:

卡片 1 标题:
卡片 1 副标题/元信息:
卡片 1 图片:
卡片 1 链接:
卡片 1 主色调:

卡片 2 标题:
卡片 2 副标题/元信息:
卡片 2 图片:
卡片 2 链接:
卡片 2 主色调:
```

## 优先级 9：可选界面文案

文件：

- `i18n/locales/zh.json`
- `i18n/locales/en.json`

你可以编辑：

- 导航标签
- 页脚标签
- 博客列表描述
- 项目列表描述
- 随笔列表描述
- 联系表单标签
- 联系表单成功/错误消息
- 首页 CTA 文案

需要决定：

```text
整体语气:
正式 / 简洁 / 个人化 / 活泼 / 技术化 / 编辑风格

中文语调:

英文语调:

避免使用的词:

偏好使用的词:
```

## 推荐填写顺序

1. 填写 `app.config.ts`。
2. 填写 `content/about/zh.md` 和 `content/about/en.md`。
3. 确定 `i18n/locales/*.json` 和 `PhotographyShowcase.vue` 中的段落标题。
4. 替换项目内容和链接。
5. 替换博客/随笔演示内容或标记为未发布。
6. 替换图片。
7. 设置部署/联系表单环境变量。
8. 运行质量检查。

## 最终公开发布检查清单

- [ ] 公开内容链接中不再残留 `example.com`（除非刻意保留）。
- [ ] 不再残留 `github.com` 根域名占位链接。
- [ ] 不再残留 `linkedin.com` 根域名占位链接。
- [ ] 不再残留 `hello@example.com`。
- [ ] 不再残留虚假公司名称。
- [ ] 中英文内容含义对应一致。
- [ ] 所有已发布内容都有真实的标题、摘要和正文。
- [ ] 所有已发布项目都有有效链接或已移除空链接。
- [ ] 联系表单收件环境变量已配置。
- [ ] `SITE_URL` 已配置为真实域名。
- [ ] `npx nuxi generate` 构建成功。
