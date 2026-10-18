import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

const siteUrl = process.env.SITE_URL || 'https://winkingw.github.io/personalWeb/'
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/personalWeb/'

const baseSitemapRoutes = [
  '/',
  '/about',
  '/blog',
  '/projects',
  '/essays',
  '/contact',
]

const contentRoutePrefixes = {
  blog: 'blog',
  projects: 'projects',
  essays: 'essays',
} as const

const contentLocales = ['zh', 'en'] as const

function frontmatterValue(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '')
}

function isFrontmatterEnabled(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback
  return value === 'true'
}

function getPublishedContentRoutes(section: keyof typeof contentRoutePrefixes) {
  const slugs = new Set<string>()
  const sectionDir = join(process.cwd(), 'content', section)

  for (const locale of contentLocales) {
    const localeDir = join(sectionDir, locale)
    if (!existsSync(localeDir)) continue

    for (const fileName of readdirSync(localeDir)) {
      if (!fileName.endsWith('.md')) continue

      const file = readFileSync(join(localeDir, fileName), 'utf8')
      const frontmatter = file.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ''
      const published = isFrontmatterEnabled(frontmatterValue(frontmatter, 'published'), false)
      const draft = isFrontmatterEnabled(frontmatterValue(frontmatter, 'draft'), true)
      if (!published || draft) continue

      slugs.add(frontmatterValue(frontmatter, 'slug') || fileName.replace(/\.md$/, ''))
    }
  }

  return Array.from(slugs).map((slug) => `/${contentRoutePrefixes[section]}/${slug}`)
}

const siteRoutes = Array.from(new Set([
  ...baseSitemapRoutes,
  ...getPublishedContentRoutes('blog'),
  ...getPublishedContentRoutes('projects'),
  ...getPublishedContentRoutes('essays'),
]))

const sitemapRoutes = siteRoutes.filter((route) => route !== '/')

const localizedPrerenderRoutes = siteRoutes.flatMap((route) => [
  route,
  route === '/' ? '/en' : `/en${route}`,
])

export default defineNuxtConfig({
  ssr: true,
  devtools: {
    enabled: false,
  },

  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    'nuxt-og-image',
  ],

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
  },

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  typescript: {
    strict: true,
  },

  i18n: {
    locales: [
      { code: 'zh', iso: 'zh-CN', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'en', iso: 'en-US', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: '../i18n/locales',
    detectBrowserLanguage: false,
    vueI18n: '../i18n/i18n.config.ts',
    baseUrl: siteUrl,
  },

  // SSG-compatible image config for @nuxt/image v2
  // v2 default provider (ipx) pre-generates images at build time — no runtime service needed
  image: {
    provider: 'ipx',
  },

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: [
        ...localizedPrerenderRoutes,
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/__sitemap__/zh-CN.xml',
        '/__sitemap__/en-US.xml',
      ],
    },
    hooks: {
      close() {
        const robotsPath = join(process.cwd(), 'dist', 'robots.txt')
        if (existsSync(robotsPath)) {
          let content = readFileSync(robotsPath, 'utf8')
          content = content.replace('SITE_URL_PLACEHOLDER', siteUrl)
          writeFileSync(robotsPath, content, 'utf8')
        }
      },
    },
  },

  // Disable Google Fonts — fonts.google.com is blocked in China
  ui: {
    fonts: false,
  },

  sitemap: {
    autoI18n: true,
    urls: () => sitemapRoutes.map((loc) => ({
      loc,
      _i18nTransform: true,
    })),
  },

  ogImage: {
    enabled: false,
  },

  // Theme: dark/light mode via @nuxtjs/color-mode
  // classSuffix: '' means raw class names (light / dark) on <html>
  // FOUC prevention: the module injects an inline script automatically
  colorMode: {
    classSuffix: '',
    cookieName: 'theme',
    storageKey: 'theme',
  },

  hooks: {
    'content:file:afterParse'(ctx: any) {
      const contentPath = String(ctx.content?.path || '')
      if (!contentPath.startsWith('/blog/') && !contentPath.startsWith('/essays/')) {
        return
      }

      const body = typeof ctx.file?.body === 'string' ? ctx.file.body : ''
      const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
      ctx.content.wordCount = wordCount
      ctx.content.readingTime = Math.max(1, Math.ceil(wordCount / 300))
    },
  },

  compatibilityDate: '2026-05-22',
})
