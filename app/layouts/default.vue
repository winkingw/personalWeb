<script setup lang="ts">
// Add hreflang alternate links for SEO (Phase 9 requirement)
const i18nHead = useLocaleHead()

const normalizedI18nLinks = computed(() =>
  (i18nHead.value.link || []).map((link) => {
    if (link.href === '') {
      return { ...link, href: '/' }
    }

    if (link.href === '/en') {
      return { ...link, href: '/en/' }
    }

    return link
  })
)

useHead(() => ({
  link: normalizedI18nLinks.value,
  meta: [...(i18nHead.value.meta || [])]
}))
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
  >
    <CoreAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <CoreAppFooter />
    <CoreBackToTop />
  </div>
</template>
