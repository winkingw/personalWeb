<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  socialLinks: {
    github: string
    linkedin: string
    email: string
  }
}

const appConfig = useAppConfig() as unknown as { site?: Partial<SiteConfig> }
const site = computed<SiteConfig>(() => ({
  name: appConfig.site?.name || 'Takagi San',
  description: appConfig.site?.description || 'Personal website, tech blog, projects, and essays',
  url: appConfig.site?.url || 'https://personal-web.local',
  ogImage: appConfig.site?.ogImage || '/images/og-default.png',
  socialLinks: {
    github: appConfig.site?.socialLinks?.github || '',
    linkedin: appConfig.site?.socialLinks?.linkedin || '',
    email: appConfig.site?.socialLinks?.email || '',
  },
}))

const footerLinks = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.about'), to: '/about' },
  { label: t('nav.blog'), to: '/blog' },
  { label: t('nav.projects'), to: '/projects' },
  { label: t('nav.essays'), to: '/essays' },
  { label: t('nav.contact'), to: '/contact' },
])
</script>

<template>
  <footer
    class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
  >
    <UiContainer>
      <div class="py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ site.name }}
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ site.description }}
            </p>
          </div>

          <div>
            <h4
              class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider"
            >
              {{ t('footer.links') }}
            </h4>
            <nav class="mt-4 space-y-2">
              <NuxtLink
                v-for="link in footerLinks"
                :key="link.to"
                :to="localePath(link.to)"
                class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </nav>
          </div>

          <div>
            <h4
              class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider"
            >
              {{ t('footer.social') }}
            </h4>
            <div class="mt-4 space-y-2">
              <a
                v-if="site.socialLinks.github"
                :href="site.socialLinks.github"
                target="_blank"
                rel="noopener noreferrer"
                class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                v-if="site.socialLinks.linkedin"
                :href="site.socialLinks.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                v-if="site.socialLinks.email"
                :href="`mailto:${site.socialLinks.email}`"
                class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div
          class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          {{ t('footer.copyright', { year: new Date().getFullYear(), name: site.name }) }}
        </div>
      </div>
    </UiContainer>
  </footer>
</template>
