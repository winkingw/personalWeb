# Review: Codex Changes to Planning Files

审查日期：2026-05-22  
审查范围：`CLAUDE.md`、`fullplan.md`、`plan1.md`、`orchestrator.md`  
基线：plan-architecture-audit.md 修复后的状态

## 总体评估

Codex 的改动方向正确，主要做了三件事：
1. 将 Phase 1 从"假设空目录初始化"改为"安全地在非空目录中 scaffold"（`plan1.md`、`orchestrator.md`）
2. 将依赖版本管理从"装就完了"改为"预检全部版本 + `-E` 精确锁定"（`plan1.md` §1.0）
3. 将 Phase 4-7 并行策略从"content-composable ∥ home-page"调整为"3 步串行"以保证 home-page 也走 `useContent()`（`orchestrator.md`）

以下按严重度记录发现的问题。

---

## P0: 应在 Phase 1 执行前修正

### 1. `fullplan.md` Phase 5 重复声明安装 `fuse.js`

**位置：** `fullplan.md:135`

```
- Install `fuse.js` and create `useSearch.ts` composable for client-side fuzzy search
```

**问题：** Phase 1（line 83）已将 `fuse.js` 安装为生产依赖。Phase 5 再说 "Install `fuse.js`" 会导致执行 agent 困惑（重新安装？检查版本？跳过？）。

**影响：** Phase 5 agent 可能尝试重复安装或被误导认为 fuse.js 是 Phase 5 才需要的。

**建议修正：**
```
- Create `useSearch.ts` composable using the already-installed `fuse.js` for client-side fuzzy search
```

---

### 2. `orchestrator.md` Phase 9 中间件命名依赖 Nuxt 4 `.global` 约定但未验证

**位置：** `orchestrator.md:610, 648, 660`

Phase 9 将 i18n 中间件命名为 `app/middleware/i18n.global.ts`。

**问题：** `.global.ts` 后缀是 Nuxt 4 的全局中间件约定。但当前计划中没有任何地方确认这一约定在安装的 Nuxt 版本中存在。如果 Nuxt 版本不支持 `.global` 后缀，中间件根本不会加载，导致语言路由全部失效。

**影响：** Phase 9 做完后 `/en/` 前缀路由可能不工作。

**建议修正：** 在 Phase 1 预检中增加一项：确认当前 Nuxt 版本的全局中间件命名约定（`.global.ts` vs 在 `nuxt.config.ts` 中用 `router.middleware` 注册）。Phase 9 的 prompt 中加入 fallback 逻辑：如果 `.global` 不生效则使用 `nuxt.config.ts` 注册或直接在 `app.vue` 中使用 `defineNuxtRouteMiddleware`。

---

## P1: 设计级问题，建议修正

### 3. `orchestrator.md` Phase 4-7 的 3 步串行依赖链脆弱

**位置：** `orchestrator.md:325-326`

```
1. Step 1 (serial): content-composable creates useContent.ts + hooks
2. Step 2 (serial): home-page builds home + about pages using useContent().getAbout('zh')
3. Step 3 (3 agents in parallel): blog, project, essay
```

**问题：** Step 2 的 home-page agent prompt 中写死了 `useContent().getAbout('zh')`，但 `getAbout` 函数是由 Step 1 的 content-composable agent 创建的。如果 content-composable 遗漏了 `getAbout`（或将其命名为 `getAboutData`），home-page 静默失败。

**为什么这比原来的设计更脆弱：** 原来 home-page 和 content-composable 并行跑，home-page 直接调 `queryCollection('about')`，不依赖 content-composable。新设计虽然架构更一致（所有查询走 composable），但在 home-page 的 prompt 中已经有了 `getAbout` 的耦合。

**建议修正（二选一）：**
- **方案 A（推荐）：** 在 `app/composables/useContent.ts` 的 contract 中明确列出 `getAbout` 签名，content-composable 的 prompt 中列为必须项。Orchestrator 在 dispatch home-page 之前，先 grep `useContent.ts` 确认 `getAbout` 函数存在。
- **方案 B：** 让 home-page 对 about 查询保持独立（直接 `queryCollection('about')`），恢复 content-composable ∥ home-page 的并行。但这样违背了"所有内容查询走 composable"的架构原则。

推荐方案 A，在 content-composable prompt 中已经有 `getAbout(locale?) → Promise<About | null>` 签名（line 376），所以实际上已覆盖——但 orchestrator 应在两步之间加入验证步骤。

**→ 建议在 orchestrator.md 的 Step 1 完成后增加验证指令：**
```
After Step 1 completes, verify useContent.ts exports: getAbout, getBlogList, getBlogPost, getAllBlogTags, getProjectList, getProject, getFeaturedProjects, getEssayList, getEssay
```

---

### 4. `plan1.md` §1.0 `npm view` 包名列表可能包含不存在或不准确的包名

**位置：** `plan1.md:21`

要求对 12 个包逐一执行 `npm view`。潜在问题：
- `nuxt-og-image`：npm 上的包名可能是 `nuxt-og-image` 或 `@nuxtjs/og-image`，取决于版本
- `@nuxt/icon`：如果该包不存在，façade 名是 `nuxt-icon`
- `wrangler`：Cloudflare 的 CLI 包，`npm view wrangler version` 返回的是最新版，但和 Nuxt 生态无关

**影响：** Phase 1 的第一步就可能因为某个包名不对而卡住，导致整个 Phase 1 无法推进。

**建议修正：** 在 §1.0 中增加一条容错说明：
```
If any npm view command fails (package not found), note it and try the alternative package name listed in fullplan.md tech stack table. If still failing, flag for manual resolution — do not block the entire pre-flight.
```

---

### 5. `orchestrator.md` Phase 11d polish agent 的 MDC 注册方式未验证

**位置：** `orchestrator.md:765-767`（Phase 11 表格）

Phase 11d (polish) 要在 `content.config.ts` 中注册 MDC 组件（Notice.vue, CodeSandbox.vue）。

**问题：** Nuxt Content v3 的 MDC 组件注册方式与 v2 不同。在 v3 中，MDC 组件通常是通过放在特定目录（如 `app/components/content/` 或 `app/components/global/`）实现自动发现，不一定需要在 `content.config.ts` 中显式注册。

**影响：** Phase 11d agent 可能写入无效的 content.config.ts 配置，导致构建失败。

**建议修正：** Phase 1 预检中增加一项：确认 Nuxt Content v3 的 MDC 自定义组件注册方式（目录约定 vs 显式注册）。Phase 11d prompt 中加入验证指令："Verify the current Nuxt Content v3 MDC component registration API before modifying content.config.ts. If auto-discovery via directory convention works, skip content.config.ts modification."

---

## P2: 细节问题，可延后修正

### 6. `orchestrator.md` Phase 3 Theme prompt 中的"or complete"措辞可能被误解

**位置：** orchestrator.md Phase 3 agent prompt

```
1. Add or complete @nuxtjs/color-mode behavior config in nuxt.config.ts
```

**问题：** 按照 P1-9 修复，Phase 1 只装模块不做 theme 配置，Phase 3 独占所有 theme 行为。所以 Phase 3 看到的状态应该是"colorMode 模块已启用但无行为配置"。但 "or complete" 暗示可能已有部分配置，agent 可能花时间判断哪些是"已有"的。

**建议修正：** 改为更明确的措辞：
```
Add @nuxtjs/color-mode behavior config to nuxt.config.ts (classSuffix: '', cookieName: 'theme', storageKey: 'theme'). Phase 1 only registered the module; no theme behavior config exists yet.
```

---

### 7. `plan1.md` §1.1 scaffold-then-copy 策略可能遗漏隐藏文件

**位置：** `plan1.md §1.1`

**问题：** PowerShell 的 `Copy-Item` 默认不复制隐藏文件（如 `.nuxtrc`、`.npmrc`、`.gitignore` 等如果存在）。Nuxt scaffold 可能生成这些文件。

**建议修正：** 在 §1.1 的 copy 步骤中注明：
```
Use Copy-Item -Recurse -Force and also copy dotfiles (.nuxtrc, .npmrc if generated)
```

---

### 8. `CLAUDE.md` hooks 示例使用字符串 key 但 query builder 注释仍强调 `.path()`

**位置：** `CLAUDE.md:112-121`

hooks 示例已正确使用 `'content:file:afterParse'` 字符串 key。这是 codex 的一个好的修正。但 query builder 示例中 `.path(path)` 的注释"includes locale dir: /blog/zh/xxx"可能让 agent 误以为应该用 path 做查询。虽然后面有明确的 slug 策略警告，但 API 示例区的 `.path()` 优先展示可能造成先入为主。

**建议修正：** 在 query builder 示例中，将 `.where()` 示例放在 `.path()` 之前，或者在 `.path()` 行加注释 `// rarely used; prefer .where('slug', ...) for detail lookups`

---

### 9. `plan1.md` §1.2 安装命令跨多行但没有说明这是增量安装

**位置：** `plan1.md:47-48`

```
pnpm add -E @nuxt/content@<version> @nuxt/ui@<version> ...
pnpm add -E @vueuse/nuxt@<version> @vueuse/core@<version> ...
```

**问题：** `nuxi init` 已经生成了 `package.json` 并安装了部分依赖（nuxt、vue 等）。这些 `pnpm add` 命令是增量添加，但没有任何说明。执行 agent 可能担心覆盖或冲突。

**建议修正：** 在命令前加一句："After `nuxi init` completes, add the remaining dependencies (pnpm add is additive — does not remove existing deps):"

---

## 变更质量评价

| 维度 | 评分 | 说明 |
|------|:----:|------|
| Phase 1 非空目录处理 | ✅ 良好 | scaffold-then-copy 策略解决了核心痛点 |
| 版本锁定 | ✅ 良好 | `-E` + 预检覆盖了之前计划缺失的版本管理 |
| 架构一致性 | ✅ 良好 | home-page 改走 useContent 使所有内容查询路径统一 |
| 去 transform() 化 | ✅ 良好 | 全文无 transform() 残留（仅否定式引用） |
| 并行效率 | ⚠️ 可接受 | 多了一个串行步骤但换来架构一致性，值得 |
| 边缘情况覆盖 | ⚠️ 一般 | MDC 注册、中间件命名、npm view 容错仍有缺口 |
| 文档内一致性 | ✅ 良好 | fullplan/plan1/orchestrator/CLAUDE 之间无矛盾 |

**总体：** Codex 的改动通过了架构审计，没有引入新的严重设计问题。上述 9 个发现中 P0-1（fuse.js 重复安装声明）和 P0-2（i18n.global 未验证）建议在 Phase 1 前修正；P1-3～5 可在对应 Phase 执行前补充验证；P2 可按优先级逐步处理。
