# Planning Architecture Audit

审查日期：2026-05-22  
审查范围：`CLAUDE.md`、`orchestrator.md`、`fullplan.md`、`plan1.md`  
目的：在 Phase 1 真正执行前，先修正会导致构建失败、后续返工、职责耦合或多 agent 冲突的问题。

## 结论

当前整体方向是合理的：Nuxt 4、Nuxt Content、SSG、Cloudflare Pages、中文默认加英文前缀，都适合个人网站。主要问题不是目标错，而是计划文件里有若干 API 误用、阶段职责重复、内容路由设计不清，以及 orchestrator 对 Windows/PowerShell 环境不友好。

建议先让 Claude agent 修正本文档列出的 P0 和 P1，再执行 `plan1.md`。

## 当前版本核验快照

本地执行 `npm view` 得到的当前版本：

- `nuxt`: `4.4.6`
- `@nuxt/content`: `3.14.0`
- `@nuxt/ui`: `4.8.0`
- `@nuxtjs/i18n`: `10.4.0`
- `@nuxt/image`: `2.0.0`
- `@nuxtjs/color-mode`: `4.0.0`
- `@nuxt/icon`: `2.2.2`
- `@vueuse/core`: `14.3.0`
- `@vueuse/nuxt`: `14.3.0`
- `@nuxtjs/sitemap`: `8.0.15`
- `nuxt-og-image`: `6.5.1`

这意味着 Phase 1 应直接按 Nuxt 4 处理，不需要再按 Nuxt 3 兼容方案作为默认路径。

## P0: 执行前必须修正

### 1. Nuxt Content v3 的 `transform()` 设计是错误的

位置：
- `CLAUDE.md:110-114`
- `fullplan.md:132`
- `fullplan.md:258`
- `orchestrator.md:360-366`

问题：
- 计划把 `transform: async (doc) => { ... }` 写进 `defineCollection()`，但当前 Nuxt Content 文档的 `defineCollection` 类型只包含 `type`、`source`、`schema`、`indexes`，没有 `transform` 字段。
- `CLAUDE.md` 里的 `body.body.split(...)` 也不可靠，Content body 通常不是原始 markdown 字符串。

影响：
- `content.config.ts` 可能直接类型报错或被 Nuxt Content 忽略。
- Blog/essay 的 `readingTime`、`wordCount` 会无法稳定生成。

建议修正：
- 使用 `nuxt.config.ts` 的 `hooks.content:file:afterParse` 计算 `readingTime` 和 `wordCount`。
- 在 `content.config.ts` 的 blog/essays schema 中显式加入：
  - `readingTime: z.number().optional()`
  - `wordCount: z.number().optional()`
- 更新所有计划文字，不再要求 collection 内使用 `transform()`。

参考：
- Nuxt Content `defineCollection` 文档：https://content.nuxt.com/docs/collections/define
- Nuxt Content hooks 文档：https://content.nuxt.com/docs/advanced/hooks

### 2. 内容详情页的 slug/path 方案不成立

位置：
- `plan1.md:200-202`
- `orchestrator.md:336-342`
- `orchestrator.md:371-373`
- `orchestrator.md:636`
- `orchestrator.md:655`
- `CLAUDE.md:119-124`

问题：
- 内容目录设计是 `content/blog/{zh,en}/xxx.md`、`content/projects/{zh,en}/xxx.md`、`content/essays/{zh,en}/xxx.md`。
- Nuxt Content 的 page path 会包含目录结构，例如大概率是 `/blog/zh/xxx`，但公开路由设计是 `/blog/xxx` 和 `/en/blog/xxx`。
- orchestrator 要求 `getBlogPost/getProject/getEssay use .path(slug)`，这把 slug 当 path 使用，逻辑不成立。

影响：
- 列表页可能能出来，但详情页查不到内容。
- 后续 i18n、SEO、sitemap 都会围绕错误 URL 继续扩散。

建议修正，二选一：
- 推荐方案：在 blog/projects/essays schema 中增加 `slug: z.string()`，所有详情查询使用 `.where('slug', '=', slug).where('locale', '=', locale).first()`。
- 备选方案：保留目录 path，但 `useContent.ts` 统一把 locale 和 slug 映射成真实 content path，例如 `/blog/${locale}/${slug}`。这种方案更耦合，不如显式 slug 清晰。

无论选哪种，`useContent.ts` 必须成为唯一内容查询入口，页面不要各自拼 path。

### 3. Project schema 缺少 `date`

位置：
- `plan1.md:121-134`
- `fullplan.md:142`
- `orchestrator.md:316-318`
- `orchestrator.md:371`

问题：
- `fullplan.md` 和 `orchestrator.md` 都认为 Project 有 `date`。
- `getFeaturedProjects` 要按 date DESC 排序。
- 但 `plan1.md` 的 projects schema 没有 `date` 字段。

影响：
- Phase 6 排序、列表展示、SEO 发布时间、FeaturedProjects 都会出现字段缺失。

建议修正：
- 在 `plan1.md` projects schema 中加入 `date: z.string().date()` 或统一改成 `date: z.date()`。
- 同步更新所有 Project 类型示例和 content 示例要求。

### 4. `@vueuse/core` 被错误当成 Nuxt module

位置：
- `fullplan.md:83`
- `plan1.md:37`
- `plan1.md:55`

问题：
- `@vueuse/core` 是工具库，不是 Nuxt module。
- 如果要放进 `nuxt.config.ts` 的 `modules`，应使用 `@vueuse/nuxt`。

影响：
- Phase 1 生成的 `nuxt.config.ts` 可能启动失败。

建议修正：
- 方案 A：安装 `@vueuse/nuxt @vueuse/core`，modules 使用 `@vueuse/nuxt`。
- 方案 B：只安装 `@vueuse/core`，不加入 Nuxt modules，按需显式 import。
- 对本项目，推荐方案 A，后续组件和 composable 会更省心。

参考：https://nuxt.com/modules/vueuse

### 5. orchestrator 的命令不适配当前 Windows/PowerShell 环境

位置：
- `orchestrator.md:22-39`
- `orchestrator.md:735-747`

问题：
- 文档使用 Bash heredoc：`cat > .claude/task_prompt.txt << 'CLAUDE_EOF'`。
- 质量门禁使用 Bash job control：`pnpm dev &`、`kill %1`。
- 当前项目环境是 `D:\programs\personalWeb` + PowerShell，这些命令不保证可运行。

影响：
- 总控 agent 可能在第一轮调度或质量门禁时失败。

建议修正：
- 在 `orchestrator.md` 明确提供 PowerShell 版本命令。
- 多行 prompt 可用 here-string：
  ```powershell
  @'
  prompt text
  '@ | Set-Content -Encoding UTF8 .claude\task_prompt.txt
  ```
- dev server 检查使用 `Start-Process` 或 `Start-Job`，结束时用进程 id 停止。

### 6. TypeScript 质量门禁被 `|| true` 吞掉

位置：
- `orchestrator.md:747`

问题：
- `npx vue-tsc --noEmit 2>&1 || true` 会把类型错误强制变成成功。
- 这和 Phase gate 的目标相反。
- `vue-tsc` 也没有在 Phase 1 依赖中明确安装。

影响：
- 类型错误会进入下一阶段，后续 agent 会基于坏接口继续写。

建议修正：
- 安装 `vue-tsc`，并改成阻断式命令：
  ```bash
  npx vue-tsc --noEmit
  ```
- 或使用 Nuxt 推荐的 typecheck 命令，并确保失败时停止 phase。

## P1: 应在 Phase 2 到 Phase 5 前修正

### 7. i18n 被放得太晚，导致页面和内容查询大面积返工

位置：
- `CLAUDE.md:94`
- `orchestrator.md:542-585`
- `orchestrator.md:552-564`

问题：
- `CLAUDE.md` 要求所有 content query 都按 locale 过滤。
- 但 orchestrator 计划先在 Phase 4-8 写页面，再到 Phase 9 批量改所有页面。
- 这会让 i18n 成为横切式大改动，耦合高且容易漏。

影响：
- Phase 4-8 的页面查询可能先返回错误语言内容。
- Phase 9 需要改所有页面，容易产生合并冲突和回归。

建议修正：
- 从第一个内容页面开始就使用 `useContent.ts` 的 locale-aware 查询。
- Phase 9 只补 UI 文案、语言切换、hreflang，不再批量重写所有内容查询。
- 如果要延后完整 i18n，至少在 Phase 4-8 使用默认 locale `zh` 作为显式参数，不允许无 locale 查询。

### 8. `FeaturedProjects` 数据归属不清

位置：
- `fullplan.md:148`
- `orchestrator.md:456-458`

问题：
- `fullplan.md` 说 `FeaturedProjects.vue` 自己查询 top 3 projects。
- `orchestrator.md` 又要求在 `index.vue` 中写 `<FeaturedProjects :projects="featuredProjects" />` 并给父页面加数据 fetching。

影响：
- 组件到底是 smart component 还是 dumb component 不明确。
- 后续测试、复用、SEO 数据预取都会出现重复实现。

建议修正：
- 推荐组件保持 dumb：`FeaturedProjects.vue` 只接收 `projects` prop，`index.vue` 通过 `useContent().getFeaturedProjects(locale, 3)` 获取数据。
- 或者组件自查数据，但不要再传 `projects` prop。二选一，写进 contract。

### 9. Theme 相关职责在 Phase 1 和 Phase 3 重复

位置：
- `fullplan.md:64`
- `fullplan.md:112`
- `plan1.md:77-87`
- `orchestrator.md:256-272`

问题：
- Phase 1 要加入 FOUC script 和 colorMode config。
- Phase 3 又要求添加同一批配置。

影响：
- 后执行的 agent 可能重复插入脚本，或误删 Phase 1 配置。

建议修正：
- 推荐 Phase 1 只安装模块并给最小可启动配置。
- Phase 3 独占 theme 行为：FOUC script、colorMode cookie、ThemeToggle、CSS tokens。
- 如果坚持 Phase 1 先加，则 Phase 3 prompt 改为“校验并补齐，不重复添加”。

### 10. Vitest “0 tests OK” 可能不可靠

位置：
- `plan1.md:247`
- `plan1.md:272`

问题：
- 计划认为 0 tests 可以证明 setup 成功，但 Vitest 在无测试文件时可能以非 0 code 退出，取决于版本和参数。

影响：
- Phase 1 可能因为没有测试文件而 gate 失败，或者 agent 为了过关乱加无意义测试。

建议修正：
- 将 test script 改为 `vitest --passWithNoTests`，或在 Phase 1 加一个最小 smoke test。
- 更推荐加 smoke test，例如检查 `app.config.ts` 或渲染首页占位组件。

### 11. Nuxt Image 的 static provider 表述需要更新

位置：
- `CLAUDE.md:41`
- `fullplan.md:86`
- `fullplan.md:259`
- `plan1.md:68-74`

问题：
- 当前 Nuxt Image 文档说明 `nuxt generate` 会在静态生成时优化并保存图片。
- 计划中“必须使用 provider: 'static'，ipx 不兼容 SSG”的说法过于绝对，且 `static.baseURL` 配置需要按当前 `@nuxt/image@2.0.0` 文档复核。

影响：
- Phase 1 可能写入过时或不支持的 image 配置。

建议修正：
- Phase 1 只配置当前文档确认支持的 `image` 选项，例如 `format`、`screens`、`quality`。
- 不要强制写 `provider: 'static'`，除非先用当前版本验证通过。

参考：
- Nuxt Image 配置：https://image.nuxt.com/get-started/configuration
- Nuxt Image 静态图片：https://image.nuxt.com/advanced/static-images

### 12. SEO 模板在 `post` 声明前调用 `useSeo`

位置：
- `orchestrator.md:640-655`

问题：
- 示例中先调用 `useSeo({ title: () => post.value?.title })`，后声明 `const { data: post } = ...`。
- 如果 `useSeo` 内部立即读取函数值，会触发 temporal dead zone 或 undefined 问题。

影响：
- Phase 10 可能生成运行时错误或空 SEO。

建议修正：
- 先声明 `route` 和 `post`，再调用 `useSeo()`。
- 或让 `useSeo` 明确只接收 `computed`/getter，并保证内部延迟求值，但仍建议声明顺序清晰。

### 13. About collection 的 `draft/published` 约定不一致

位置：
- `plan1.md:139-158`
- `plan1.md:277`

问题：
- acceptance criteria 说四个 collection 都有 `draft` 和 `published`。
- 但 about schema 没有这两个字段。

影响：
- 执行 agent 会不知道该遵守 schema 还是 acceptance criteria。

建议修正：
- 如果 About 永远公开，修改 acceptance criteria 为“三个文章类 collection 有 draft/published，about 不需要”。
- 如果 About 也需要发布控制，则在 about schema 中加入 `draft` 和 `published`，查询时也过滤。

### 14. 日期类型需要统一

位置：
- `plan1.md:98-99`
- `plan1.md:112-113`
- `fullplan.md:142`

问题：
- Nuxt Content 官方示例使用 `z.date()`。
- 当前计划使用 `z.string().date()`，但 markdown frontmatter 的日期如果不加引号，解析器可能给出 Date 对象而不是 string。

影响：
- content validation 可能因内容书写风格不同而失败。

建议修正：
- 统一选择一种：
  - 若使用 `z.string().date()`，要求所有 markdown frontmatter 日期必须加引号：`date: "2026-05-22"`。
  - 若使用 `z.date()`，所有 UI 格式化函数接受 Date。
- 推荐使用 string 并强制加引号，方便路由、SEO JSON、i18n formatting。

### 15. `nuxt-og-image` 安装后缺少清晰配置阶段

位置：
- `fullplan.md:22`
- `fullplan.md:186`
- `plan1.md:38`
- `orchestrator.md:663-684`

问题：
- 计划安装 `nuxt-og-image`，fullplan 说要生成 OG images。
- 但 Phase 10 prompt 只明确启用 sitemap，没有明确把 `nuxt-og-image` 加入 modules，也没有定义默认 OG image 生成策略。

影响：
- 依赖被安装但不生效，SEO 验收不完整。

建议修正：
- Phase 10 明确：
  - 是否使用 `nuxt-og-image`。
  - 需要加入哪个 module 名称。
  - 默认 OG 模板文件在哪里。
  - Blog/projects/essays 使用静态默认图还是动态 OG 图。

## P2: 维护性与执行流程优化

### 16. 多 agent 并行只靠“不同文件”隔离还不够

位置：
- `orchestrator.md:14`
- `orchestrator.md:42-48`
- `orchestrator.md:706-717`

问题：
- “不碰同一文件”是必要条件，但不是充分条件。
- 多个 CLI agent 在同一个工作目录并行运行，仍可能争用 `.nuxt/`、`.output/`、lockfile、formatter、缓存或 package manager 状态。

建议修正：
- 并行实现阶段禁止运行 install/build/dev server。
- 每个 agent 只编辑自己 scope 内文件，构建和格式化由 orchestrator 串行执行。
- 更稳妥的方案是每个 agent 使用单独 git worktree，最后由 orchestrator 合并。

### 17. `main.css` 是否被 Nuxt 加载没有写清楚

位置：
- `plan1.md:159-164`

问题：
- 计划创建 `app/assets/css/main.css`，但没有明确在 `nuxt.config.ts` 加：
  ```ts
  css: ['~/assets/css/main.css']
  ```

影响：
- Tailwind/Nuxt UI 样式可能没有进入应用。

建议修正：
- 在 Phase 1 的 `nuxt.config.ts` 配置任务中明确加入 `css` 配置。

### 18. `CLAUDE.md` 的状态标记容易误导

位置：
- `CLAUDE.md:20-26`
- `CLAUDE.md:161`
- `plan1.md:278`
- `orchestrator.md:65`

问题：
- `CLAUDE.md` 中 `plan1.md` 标了 current/完成样式，但 Phase 1 还没真正执行。
- `plan1.md` acceptance criteria 又要求 `CLAUDE.md` Current Phase 为 1，而 orchestrator Phase 1 完成后要求更新到 Phase 2。

影响：
- Agent 可能把“计划文件已存在”误读成“Phase 1 已完成”。

建议修正：
- 区分两个状态：
  - `Plan status: plan1.md ready`
  - `Implementation status: Phase 1 not started / in progress / completed`

---

# Audit Resolution Report

修复日期：2026-05-22  
修复范围：CLAUDE.md、fullplan.md、plan1.md、orchestrator.md

## 处置摘要

| # | 严重度 | 问题 | 处置 | 说明 |
|---|:----:|------|:----:|------|
| 1 | P0 | `transform()` API 不存在 | ✅ 采纳 | 全文档改为 `hooks.content:file:afterParse`；schema 添加 readingTime/wordCount optional 字段 |
| 2 | P0 | slug/path 方案不成立 | ✅ 采纳 | 所有 collection schema 添加 `slug: z.string()`；详情查询使用 `.where('slug', '=', slug).where('locale', '=', locale).first()` |
| 3 | P0 | Project schema 缺少 date | ✅ 采纳 | projects schema 添加 `date: z.string().date()` |
| 4 | P0 | `@vueuse/core` 非 Nuxt module | ✅ 采纳 | 安装命令改为 `@vueuse/nuxt @vueuse/core`；modules 使用 `@vueuse/nuxt` |
| 5 | P0 | orchestrator 命令不适配 Windows/PowerShell | ✅ 采纳 | Agent dispatch 和 quality gates 均提供 PowerShell 版本命令 |
| 6 | P0 | `vue-tsc \|\| true` 吞掉错误 | ✅ 采纳 | 改为阻断式 `npx vue-tsc --noEmit`；补充 `vue-tsc` 安装说明 |
| 7 | P1 | i18n 太晚导致大面积返工 | ✅ 采纳（部分缓解） | content-composable 默认 locale='zh'；页面使用显式 locale 参数；Phase 9 只需将硬编码 'zh' 换为 `locale.value` |
| 8 | P1 | FeaturedProjects 数据归属不清 | ✅ 采纳 | 明确为 dumb component（接收 `projects` prop）；父页面（index.vue）负责数据获取 |
| 9 | P1 | Theme 配置 Phase 1/3 重复 | ✅ 采纳 | Phase 1 只安装模块 + 最小可启动配置；Phase 3 独占全部 theme 行为（FOUC script、colorMode、ThemeToggle、CSS tokens） |
| 10 | P1 | Vitest "0 tests OK" 不可靠 | ✅ 采纳 | test script 改为 `vitest --passWithNoTests`；计划添加最小 smoke test |
| 11 | P1 | Nuxt Image static provider 表述 | ✅ 采纳 | 软化表述：Phase 1 根据 `@nuxt/image@2.0.0` 当前文档配置，不强制写 `provider: 'static'` |
| 12 | P1 | SEO 模板中 `useSeo` 在 `post` 声明前调用 | ✅ 采纳 | 重排声明顺序：先 `route` + `post`，再 `useSeo()` |
| 13 | P1 | About collection draft/published 不一致 | ✅ 采纳 | acceptance criteria 明确：三个文章类 collection 有 draft/published，about 不需要 |
| 14 | P1 | 日期类型需统一 | ✅ 采纳 | 统一使用 `z.string().date()`，frontmatter 日期必须加引号 `date: "2026-05-22"` |
| 15 | P1 | nuxt-og-image 缺少清晰配置阶段 | ✅ 采纳 | Phase 10 明确加入 nuxt-og-image module、默认 OG 模板位置、各页面 OG 策略 |
| 16 | P2 | 多 agent 并行隔离不够 | ⏳ 记录为后续优化 | 并行 agent 禁止运行 install/build/dev server；推荐 worktree 隔离作为未来增强方案 |
| 17 | P2 | main.css 是否被加载不明确 | ✅ 采纳 | Phase 1 nuxt.config.ts 配置任务中明确加入 `css: ['~/assets/css/main.css']` |
| 18 | P2 | CLAUDE.md 状态标记误导 | ✅ 已修复 | 区分 "Plan status: plan1.md ready" 和 "Implementation status: Phase 1 not started"；新增状态表格 |

## 未采纳 / 部分采纳说明

**P1-7 (i18n 时机)：** 审计建议从第一个内容页面就使用动态 locale。最终折中方案：页面使用显式 `locale` 参数（默认 `'zh'`），避免无 locale 查询。Phase 9 将硬编码 `'zh'` 替换为 `locale.value` 的工作范围小且机械，不会产生大面积返工。

**P2-16 (worktree 隔离)：** 理论正确但当前规模不需要。并行 agent 已通过文件冲突矩阵保证无文件重叠。worktree 方案作为未来增强选项保留在 orchestrator.md。

## 变更文件清单

| 文件 | 变更内容 |
|------|---------|
| `CLAUDE.md` | 新增 Plan/Implementation 状态分离；移除误导性 checkmark |
| `fullplan.md` | 风险表 transform→hooks 修正；全文 transform 引用清零 |
| `plan1.md` | schema 补充 slug/date；安装命令修正；vitest --passWithNoTests |
| `orchestrator.md` | 全文 transform→hooks 修正；PowerShell 命令；FeaturedProjects 合同；SEO 模板声明顺序；theme 职责分离；Phase 10 OG 配置 |

## 验证

- [x] `grep -r "transform()" *.md orchestrator.md` — 无残留（仅 audit 本文档提及）
- [x] `grep -r "@vueuse/core" *.md` — 仅 fullplan.md 摘要提及（非 install 命令）；plan1.md 已改为 `@vueuse/nuxt @vueuse/core`
- [x] `grep "|| true" orchestrator.md` — 无匹配
- [x] CLAUDE.md 状态表格清晰区分 Plan status 与 Implementation status

