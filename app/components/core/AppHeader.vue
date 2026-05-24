<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const links = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.about'), to: '/about' },
  { label: t('nav.blog'), to: '/blog' },
  { label: t('nav.projects'), to: '/projects' },
  { label: t('nav.essays'), to: '/essays' },
  { label: t('nav.contact'), to: '/contact' },
])

const mobileOpen = ref(false)
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-transparent"
  >
    <UiContainer>
      <div class="flex h-20 items-center justify-between gap-3">
        <NuxtLink
          :to="localePath('/')"
          class="glass-icon-button text-sm font-semibold text-neutral-900"
        >
          TS
        </NuxtLink>

        <CoreNavigation :links="links" class="hidden lg:flex" />

        <div class="flex items-center gap-1">
          <CoreThemeToggle />
          <CoreLanguageSwitcher />

          <button
            @click="mobileOpen = true"
            class="glass-icon-button lg:hidden"
            :aria-label="t('a11y.openMenu')"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </UiContainer>

    <LazyCoreMobileMenu
      v-if="mobileOpen"
      v-model="mobileOpen"
      :links="links"
    />
  </header>
</template>
