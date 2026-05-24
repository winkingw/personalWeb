const DEFAULT_SITE_URL = 'https://example.com'
const DEFAULT_OG_IMAGE = '/images/og-default.png'

function normalizeSiteUrl(url: string | undefined) {
  try {
    return new URL(url || DEFAULT_SITE_URL).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function toAbsoluteUrl(url: string | undefined, siteUrl: string) {
  const value = url?.trim()
  if (!value) return siteUrl
  if (isAbsoluteUrl(value)) return value
  return new URL(value, `${siteUrl}/`).toString()
}

export function useSeo(opts: {
  title?: () => string
  description?: () => string
  image?: () => string | undefined
  url?: () => string
  type?: 'website' | 'article'
  publishedAt?: () => string | undefined
  updatedAt?: () => string | undefined
}) {
  const appConfig = useAppConfig() as Record<string, any>
  const siteConfig = (appConfig.site || {}) as { name?: string; description?: string; url?: string; ogImage?: string }
  const runtimeConfig = useRuntimeConfig()
  const { locale } = useI18n()
  const route = useRoute()

  const siteUrl = computed(() => normalizeSiteUrl(
    typeof runtimeConfig.public.siteUrl === 'string'
      ? runtimeConfig.public.siteUrl
      : siteConfig.url,
  ))
  const title = computed(() => opts.title?.() || siteConfig.name || '')
  const description = computed(() => opts.description?.() || siteConfig.description || '')
  const image = computed(() => {
    const img = opts.image?.() || siteConfig.ogImage || DEFAULT_OG_IMAGE
    return toAbsoluteUrl(!img || img === '/' ? DEFAULT_OG_IMAGE : img, siteUrl.value)
  })
  const url = computed(() => {
    return toAbsoluteUrl(opts.url?.() || route.path, siteUrl.value)
  })
  const ogLocale = computed(() => locale.value === 'zh' ? 'zh_CN' : 'en_US')

  useHead(() => {
    const meta: Record<string, any>[] = [
      { name: 'description', content: description.value },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:image', content: image.value },
      { property: 'og:url', content: url.value },
      { property: 'og:type', content: opts.type || 'website' },
      { property: 'og:locale', content: ogLocale.value },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title.value },
      { name: 'twitter:description', content: description.value },
      { name: 'twitter:image', content: image.value },
    ]

    const pa = opts.publishedAt?.()
    if (pa) {
      meta.push({ property: 'article:published_time', content: pa })
    }
    const ua = opts.updatedAt?.()
    if (ua) {
      meta.push({ property: 'article:modified_time', content: ua })
    }

    return {
      title: title.value,
      meta,
      link: [
        { rel: 'canonical', href: url.value },
      ],
    }
  })
}
