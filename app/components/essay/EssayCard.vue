<script setup lang="ts">
import type { EssaysCollectionItem } from '@nuxt/content'
import { formatDate } from '~/utils/date'

const { locale } = useI18n()
const localePath = useLocalePath()
const formatLocaleDate = (date: string | Date) => formatDate(date, locale.value)

defineProps<{
  essay: EssaysCollectionItem
}>()
</script>

<template>
  <NuxtLink
    :to="localePath(`/essays/${essay.slug}`)"
    class="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
  >
    <time
      :datetime="essay.date"
      class="text-sm text-text-muted"
    >
      {{ formatLocaleDate(essay.date) }}
    </time>
    <h3 class="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
      {{ essay.title }}
    </h3>
    <p class="mt-2 text-sm text-text-muted line-clamp-3">
      {{ essay.description }}
    </p>
  </NuxtLink>
</template>
