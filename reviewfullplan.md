# Review: fullplan.md + plan1.md (Round 3)

## Review Scope

Third-round review. The second-round fixes are all properly applied. This review does a fresh pass for any remaining issues.

---

## 1. Round 2 Issues — All Resolved

| # | Round 2 Issue | Resolution |
|---|--------------|------------|
| 2.1 | About file pattern / directory mismatch | Commented in plan1.md §1.4 and §1.7: flat directory, `zh.md` + `en.md` only |
| 2.2 | i18n module enabled without config | 4-line minimal config added to plan1.md §1.3 |
| 2.3 | Testing infra missing from plan1.md | New §1.9 "Configure Vitest" with full config + verification |
| 2.4 | `shared/types/content.ts` undefined | Removed from file table; types derived via `z.infer<>` in content.config.ts |
| 2.5 | Sitemap installed too early | Note added: disable with `sitemap: { enabled: false }` until Phase 10 |
| 2.6 | `pnpm build` ambiguous | Marked optional with explanation; removed from acceptance criteria |
| 2.7 | Nice-to-have items (error page, cache, analytics, component APIs) | Acceptable at fullplan level — should be detailed in respective planN.md files |
| 2.8 | No `app.config.ts` | Added to Phase 1 summary + Files to Create table |
| 2.9 | About collection "not type: page" comment | Removed; replaced with clear description |

---

## 2. New Findings (Minor)

### 2.1 Vitest Config May Not Match Nuxt Convention

plan1.md §1.9 creates `vitest.config.ts` with `vue()` plugin and `jsdom` environment:

```typescript
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

For Nuxt projects using `@nuxt/test-utils`, the standard approach is to use Nuxt's own vitest integration, which auto-configures Nuxt auto-imports, modules, and aliases:

```typescript
import { defineVitestConfig } from '@nuxt/test-utils/config'
export default defineVitestConfig({
  test: {
    environment: 'nuxt'
  }
})
```

The plain `vue()` plugin config won't resolve Nuxt auto-imports (`useFetch`, `queryCollection`, etc.) in tests. This will cause test failures when composables are tested in later phases, requiring a config rework.

**Recommendation:** Change the vitest config to use `@nuxt/test-utils/config`'s `defineVitestConfig` with `environment: 'nuxt'`. The exact API depends on the `@nuxt/test-utils` version installed — verify during pre-flight §1.0.

### 2.2 fullplan.md Phase 4 Content Path vs plan1.md Directory Structure — Slight Ambiguity

fullplan.md Phase 4 says:

> "content sourced from `content/about/{zh,en}.md`"

plan1.md §1.7 directory structure:

```
content/about/  # Flat (not {zh,en}/) — single-doc collection, zh.md + en.md only
```

These are consistent if you read `{zh,en}.md` as a brace expansion for filenames. But `{zh,en}` is used elsewhere in the project as a directory shorthand (`blog/{zh,en}/`, `essays/{zh,en}/`, `projects/{zh,en}/`). A reader skimming fullplan.md might mistakenly create `content/about/zh/` and `content/about/en/` subdirectories, then wonder why content doesn't load.

**Recommendation:** Change fullplan.md Phase 4 to say `content/about/zh.md` and `content/about/en.md` explicitly (no brace shorthand), matching plan1.md's clarity.

### 2.3 Phase 10 `constants.ts` vs Phase 1 `app.config.ts` — Overlapping Purpose

fullplan.md Phase 1 adds `app.config.ts` for "site metadata (name, description, social links — runtime config for SEO composables)." Phase 10 adds `app/utils/constants.ts` with "site metadata." These overlap. If `app.config.ts` already holds site name, description, and social links, what goes in `constants.ts`?

**Recommendation:** Clarify the split:
- `app.config.ts` — Nuxt runtime config (site name, description, default locale, etc.) — accessible via `useAppConfig()`
- `app/utils/constants.ts` — non-Nuxt constants (pagination sizes, date formats, social link URLs, breakpoint values)

Or merge them into one file and drop the other.

### 2.4 No `app.config.ts` Creation Task in plan1.md

`app.config.ts` appears in the "Files to Create" table in plan1.md, but there's no explicit task telling the implementer what to put in it. Every other file in that table has corresponding content in a §1.X task (nuxt.config.ts in §1.3, content.config.ts in §1.4, main.css in §1.5, etc.), but `app.config.ts` has no dedicated task.

**Recommendation:** Add a brief task in §1.5 (or a new §1.5a) with minimal content:

```typescript
export default defineAppConfig({
  site: {
    name: '...',
    description: '...',
    url: '...'
  }
})
```

### 2.5 `@nuxtjs/i18n` in Phase 9: "Configure" vs "Extend"

fullplan.md Phase 9 says "Configure `@nuxtjs/i18n` in `nuxt.config.ts`." But Phase 1 already configures the module (4-line placeholder). Phase 9 should "Extend" not "Configure" to avoid someone removing the Phase 1 config and starting fresh.

**Recommendation:** Change Phase 9 wording to "Extend i18n configuration" to signal additive changes.

### 2.6 Missing `.gitkeep` Strategy for Empty Directories

plan1.md §1.7 creates many empty directories. Git doesn't track empty directories. When the project is cloned fresh for CI or another developer, these directories won't exist unless they contain files. This means build tools might error on missing directories (e.g., `content/blog/zh/` not existing when a content query runs).

**Recommendation:** For directories that MUST exist before content is added (especially `content/` subdirectories), add `.gitkeep` files. Or note that directories will be naturally created when content files are added in later phases.

---

## 3. Assessment

**Status: Ready for Phase 1 execution.**

All structural issues from Rounds 1 and 2 are resolved. The 6 new findings above are all minor — none block Phase 1. The only one worth fixing before execution is §2.1 (vitest config) because using the wrong config will cause test failures in Phase 2+.

### Remaining Issue Severity

| # | Issue | Severity | Action |
|---|-------|----------|--------|
| 2.1 | Vitest config might not match Nuxt convention | Medium | Fix before Phase 2 (when first tests are written) |
| 2.2 | Phase 4 content path ambiguity | Low | Fix when writing plan4.md |
| 2.3 | constants.ts vs app.config.ts overlap | Low | Clarify when writing plan10.md |
| 2.4 | No app.config.ts creation task | Low | Add 3-line task to plan1.md §1.5 |
| 2.5 | Phase 9 wording "Configure" vs "Extend" | Trivial | Fix when writing plan9.md |
| 2.6 | Empty directories not git-tracked | Trivial | Add .gitkeep to content/ subdirs |

### Verdict

The plan is solid. The 12-phase structure is coherent, the tech choices are sound, edge cases are documented, and every critical ambiguity from the original version has been resolved. The remaining issues are fit-and-finish — they won't cause wrong implementations, just minor friction that can be smoothed during execution.
