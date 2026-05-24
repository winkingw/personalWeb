<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: 'zh' | 'en'; name?: string }>).filter((l) => l.code !== locale.value)
)
</script>

<template>
  <div class="flex items-center gap-1">
    <NuxtLink
      v-for="l in availableLocales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      class="glass-icon-button px-3 text-xs font-semibold text-neutral-900 sm:px-4"
      :hreflang="l.code"
    >
      {{ l.code === 'zh' ? '中文' : 'EN' }}
    </NuxtLink>
  </div>
</template>
