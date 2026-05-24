<script setup lang="ts">
import { formatDate } from '~/utils/date'

const { locale, t } = useI18n()
const formatLocaleDate = (date: string | Date) => formatDate(date, locale.value)

defineProps<{
  date: string
  readingTime?: number
  wordCount?: number
}>()
</script>

<template>
  <div class="flex items-center gap-3 text-sm text-text-muted">
    <time :datetime="date">{{ formatLocaleDate(date) }}</time>
    <span v-if="readingTime">{{ t('blog.minRead', { minutes: readingTime }) }}</span>
    <span v-if="wordCount">{{ t('blog.wordCount', { count: wordCount }) }}</span>
  </div>
</template>
