# Planning Architecture Audit Round 2

审查日期：2026-05-22  
审查范围：`CLAUDE.md`、`orchestrator.md`、`fullplan.md`、`plan1.md`  
背景：Claude 已根据 `plan-architecture-audit.md` 做过第一轮修复。本文件只记录第二轮复查后仍然存在或新暴露的问题。

## 总体结论

第一轮的大问题多数已经修掉：`transform()` 基本改为 Content hooks，slug 查询方向也改对了，`@vueuse/nuxt` 已进入 `plan1.md`，PowerShell 质量门禁也补上了。

但现在仍不建议直接执行 Phase 1。原因是 Phase 1 初始化命令仍假设当前目录为空，而实际目录已经有多个规划文档；同时若按当前 orchestrator 执行，`vue-tsc` 质量门禁缺依赖、`fullplan.md` 与 `plan1.md` 的依赖和 image 策略仍互相矛盾，后续内容查询也还没有完全落实“通过 `useContent.ts` 解耦”的原则。

## P0: 执行 Phase 1 前必须修

### 1. Phase 1 仍假设项目目录为空，可能导致 `nuxi init .` 失败或覆盖规划文件

位置：
- `plan1.md:26`
- `orchestrator.md:94-98`
- `orchestrator.md:117-118`

问题：
- 当前目录 `D:\programs\personalWeb` 并不是空目录，已有 `CLAUDE.md`、`orchestrator.md`、`fullplan.md`、`plan1.md`、审查文件等。
- `plan1.md` 仍要求直接在当前目录执行 `npx nuxi@latest init .`。
- `orchestrator.md` 还告诉 Phase 1 agent：“You may create/modify any file... This is the first phase — the project is empty.”

影响：
- `nuxi init .` 可能因为目录非空而失败。
- 如果 agent 使用强制初始化，可能覆盖或污染规划文档。
- “任何文件都可改”的 scope 太宽，会让 scaffold agent 修改 audit/review/plan 文档。

建议修正：
- 明确 Phase 1 初始化策略，推荐：
  1. 在临时目录执行 `npx nuxi@latest init personalWeb-scaffold`。
  2. 只把生成的项目文件复制到当前目录。
  3. 不覆盖现有 `*.md` 规划/审查文件。
- 或者在当前目录手工创建 Nuxt 所需文件，不运行会写全目录的初始化命令。
- Phase 1 file scope 改成白名单：`package.json`、`pnpm-lock.yaml`、Nuxt 配置、`app/`、`content/`、`server/`、`shared/`、`public/`、`locales/`、`.gitignore`、`wrangler.toml`。禁止修改 `CLAUDE.md`/`fullplan.md`/`plan1.md`/audit 文档，除非 orchestrator 单独更新状态。

### 2. `vue-tsc` 被质量门禁使用，但 Phase 1 未安装

位置：
- `orchestrator.md:784`
- `orchestrator.md:802`
- `plan1.md:36-38`

问题：
- 第一轮审查要求补 `vue-tsc`，orchestrator 已改成阻断式 `npx vue-tsc --noEmit`。
- 但 `plan1.md` 的 dev dependencies 仍没有 `vue-tsc`。

影响：
- Phase gate 不可复现，`npx` 可能临时拉取未锁定版本，或在 CI/无交互环境失败。
- 也违反 “All dependency versions pinned” 的验收目标。

建议修正：
- 在 Phase 1 dev deps 中加入 `vue-tsc`。
- 同时加入 package script，例如：
  ```json
  "typecheck": "vue-tsc --noEmit"
  ```
- orchestrator gate 调整为 `pnpm typecheck`。

### 3. 依赖“锁定版本”的要求和安装命令不一致

位置：
- `plan1.md:17-22`
- `plan1.md:36-38`
- `plan1.md:279`
- `fullplan.md:81-84`

问题：
- 文档要求先查版本并锁定到 `package.json`。
- 但安装命令是 `pnpm add @nuxt/content ...`，默认会写入 semver range，通常不是严格 pin。

影响：
- 后续 Claude agent 或 CI 重装时可能获得不同 minor/patch 行为。
- “latest stable” + 未严格 pin 会削弱计划中的可复现性。

建议修正：
- Phase 1 使用 `pnpm add -E package@version` / `pnpm add -D -E package@version`。
- 或在 repo 层设置 `save-exact=true`，但仍建议命令显式带版本。

## P1: 应在生成代码前修正

### 4. `fullplan.md` 仍残留错误的 `@vueuse/core` 依赖说明

位置：
- `fullplan.md:21`
- `fullplan.md:83`

问题：
- `plan1.md` 已改为安装 `@vueuse/nuxt @vueuse/core`，modules 使用 `@vueuse/nuxt`。
- 但 `fullplan.md` 仍写“Utilities | @vueuse/core”和 Phase 1 安装列表只包含 `@vueuse/core`。

影响：
- Orchestrator 和子 agent 读 `fullplan.md` 时仍可能按旧依赖执行。

建议修正：
- `fullplan.md` 改为：
  - Tech Stack：`@vueuse/nuxt + @vueuse/core`
  - Phase 1 install list：同时包含 `@vueuse/nuxt` 和 `@vueuse/core`
  - modules 描述只写 `@vueuse/nuxt`

参考：Nuxt Modules 官方页说明 `@vueuse/nuxt` 提供 Nuxt auto-import 集成，安装示例同时包含 `@vueuse/nuxt @vueuse/core`。

### 5. `@nuxt/image` 策略在四个文档中仍互相矛盾

位置：
- `CLAUDE.md:47`
- `fullplan.md:19`
- `fullplan.md:86`
- `fullplan.md:189`
- `fullplan.md:259`
- `plan1.md:68-74`
- `plan1.md:280`
- `orchestrator.md:98`
- `orchestrator.md:127`

问题：
- `plan1.md` 正文已经软化为“按 `@nuxt/image@2.0.0` 文档验证是否需要 static provider”。
- 但验收项仍写“configured with `static` provider”。
- `CLAUDE.md`、`fullplan.md`、`orchestrator.md` 仍把 static provider 写成固定决策。
- 当前 Nuxt Image 文档说明静态 preset 下默认 provider 会是 `ipxStatic`，不一定需要手动 `provider: 'static'`。

影响：
- Phase 1 agent 可能为了满足验收写入过时或不必要配置。
- 后续 Phase 10 的 image 优化策略会和 Phase 1 产生冲突。

建议修正：
- 统一表述为：`@nuxt/image` 使用 SSG 兼容配置；Phase 1 以当前文档验证 `ipxStatic`/static 行为，不强制手写 `provider: 'static'`。
- 验收项改为：“`nuxi generate` 后本地图片能正常输出，并记录最终 image provider/config 选择。”

参考：Nuxt Image 当前配置文档写明静态 Nitro preset / `nuxt generate` 下默认 provider 是 `ipxStatic`。

### 6. Nuxt Content hook 写法仍不够可执行

位置：
- `CLAUDE.md:118-120`
- `fullplan.md:132`
- `fullplan.md:258`
- `orchestrator.md:378-386`

问题：
- 已经从 `transform()` 改成 hook，这是正确方向。
- 但文档多处写成 `hooks.content:file:afterParse`，这不是可直接复制的 `nuxt.config.ts` 语法。
- orchestrator 还写“compute wordCount from parsed body”，但没有约定当 `file.body` 不是 string 时如何处理。

影响：
- 子 agent 可能写出非法 TS object key，或在 AST body 上错误 split。

建议修正：
- 在 `plan1.md` 或 `orchestrator.md` 给出可执行模板：
  ```ts
  hooks: {
    'content:file:afterParse'(file) {
      const body = typeof file.body === 'string' ? file.body : ''
      const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
      file.readingTime = Math.max(1, Math.ceil(wordCount / 300))
      file.wordCount = wordCount
    }
  }
  ```
- 同时保留“schema 必须先定义 custom fields”的提醒。

参考：Nuxt Content hooks 文档示例在 `content:file:afterParse` 中新增字段，并说明要在 schema 里定义该字段后才能通过 `queryCollection()` 访问。

### 7. 内容查询仍没有彻底通过 `useContent.ts` 解耦

位置：
- `CLAUDE.md:99`
- `orchestrator.md:318`
- `orchestrator.md:407`
- `orchestrator.md:577-593`
- `orchestrator.md:613`
- `orchestrator.md:660-681`

问题：
- `CLAUDE.md` 规定 content queries go through `app/composables/useContent.ts` wrappers。
- 但 orchestrator 仍要求 About 页面直接 `queryCollection('about')`。
- Phase 9/10 模板也继续在页面里直接写 `queryCollection('blog')`。

影响：
- 查询逻辑分散在多个页面，locale、published、slug、fallback 行为难以统一维护。
- Phase 9/10 会继续做横切式页面修改，和“降低耦合”的目标冲突。

建议修正：
- `useContent.ts` 从 Phase 5 起就包含 about helper：
  - `getAbout(locale = 'zh')`
  - 所有 blog/project/essay/about 查询统一走 composable。
- Phase 9/10 模板改为调用 `useContent()`，不要在页面内直接 `queryCollection()`。
- 如果 Phase 4 必须早于 `useContent.ts`，则不要让 About 页直接查 collection；先使用静态 placeholder 或把 content-composable 提前到 Phase 4 前执行。

### 8. Locale-sensitive `useAsyncData` key 不完整

位置：
- `orchestrator.md:483-485`
- `orchestrator.md:663-681`

问题：
- FeaturedProjects 示例使用固定 key `'featured'`，但数据依赖 `locale.value`。
- SEO detail 示例使用 `blog-${route.params.slug}`，但查询也依赖 `locale.value`。

影响：
- 切换语言时可能复用旧缓存，显示错语言内容。

建议修正：
- key 包含 locale：
  ```ts
  useAsyncData(`featured-${locale.value}`, () => ...)
  useAsyncData(`blog-${locale.value}-${route.params.slug}`, () => ...)
  ```
- 或显式设置 `watch: [locale]`，但 key 加 locale 更直观。

### 9. “类型从 Zod schema 推导”缺少落地方式

位置：
- `CLAUDE.md:101`
- `orchestrator.md:325-345`
- `plan1.md:94-158`

问题：
- 文档要求 content types derived from Zod schemas via `z.infer<>`。
- 但 `plan1.md` 的 schema 是内联在 `defineCollection()` 里的，没有导出 `blogSchema`、`projectSchema` 等常量。
- orchestrator 又给了手写 interface 作为 agent-facing contracts。

影响：
- 最终实现很可能变成手写 interface 和 Zod schema 双维护，字段漂移风险高。

建议修正：
- Phase 1 要求把 schema 拆成导出常量：
  ```ts
  export const blogSchema = z.object({ ... })
  export type BlogPost = z.infer<typeof blogSchema>
  ```
- `shared/types/content.ts` 或 `content.config.ts` 明确作为类型来源。
- orchestrator 的手写 interface 只保留为说明，标注“不得复制到生产代码”。

### 10. 并行批次的测试时机仍有矛盾

位置：
- `orchestrator.md:46-50`
- `orchestrator.md:250-266`
- `orchestrator.md:765-806`

问题：
- “What to review after each agent” 要求每个 agent 后都跑 `pnpm test`。
- 但 Phase 2a/2b、Phase 4-7 都有并行 agent。单个 agent 完成时，依赖文件可能还没由同批次另一个 agent 创建完成。

影响：
- 会产生假失败，导致 orchestrator 错误返工。

建议修正：
- 并行批次中，每个 agent 完成后只做 scope 检查和 diff 审查。
- `pnpm test`、`nuxi generate`、`vue-tsc` 只在整个 parallel batch 合并后串行运行。
- 若要单 agent 测试，只允许运行与其文件 scope 无跨依赖的轻量检查。

## P2: 维护性建议

### 11. `Current Phase` 状态描述仍有旧术语

位置：
- `CLAUDE.md:20-32`
- `CLAUDE.md:144-148`
- `plan1.md:283`
- `orchestrator.md:12`
- `orchestrator.md:83`

问题：
- `CLAUDE.md` 已改成 Plan status / Implementation status，这是好改动。
- 但后文仍写“updates `Current Phase`”，`plan1.md` 验收仍写“`CLAUDE.md` is updated with `Current Phase: 1`”。

建议修正：
- 全部统一成“update `CLAUDE.md` Implementation status table”。
- Phase 1 完成后状态应是 Phase 1 implemented ✅、Phase 2 not started，而不是写 `Current Phase: 1`。

### 12. Phase 9 的浏览器语言重定向描述有歧义

位置：
- `orchestrator.md:608-613`

问题：
- 文档写“redirect / to / if browser pref is en, etc.”，语义上是空重定向。
- 中文是默认/主语言，是否要按浏览器语言把 `/` 自动跳到 `/en/` 也应明确，否则会影响 SEO 和用户预期。

建议修正：
- 明确策略：
  - 若坚持中文默认：`/` 永远保持中文，不按浏览器语言跳转；语言切换由用户触发。
  - 若启用检测：只在首次访问 root 且无 cookie 时把英文浏览器跳到 `/en/`，并确保 canonical/hreflang 正确。

## 给 Claude agent 的二次修复提示词

```text
请阅读 D:\programs\personalWeb\plan-architecture-audit-round2.md，然后只修改 CLAUDE.md、orchestrator.md、fullplan.md、plan1.md。不要初始化 Nuxt，不要安装依赖，不要创建 app 源码。

优先级：
1. 必须先修 P0：非空目录初始化策略、vue-tsc 依赖、依赖 exact pin 命令。
2. 再修 P1：fullplan 的 @vueuse/nuxt 残留不一致、@nuxt/image 统一策略、Content hook 可执行语法、content 查询全部走 useContent、locale-sensitive useAsyncData key、Zod schema 类型导出、并行批次测试时机。
3. 最后修 P2：状态术语和 i18n 重定向描述。

约束：
- 不要覆盖 plan-architecture-audit.md 或本 round2 审查文件。
- Phase 1 scaffold agent 的文件范围必须是白名单，不能再写“any file / project is empty”。
- 所有依赖安装命令要使用 exact versions 或 `-E`，并包含 vue-tsc。
- 页面内不要直接写 queryCollection，除非是在 useContent.ts 内部。
```

