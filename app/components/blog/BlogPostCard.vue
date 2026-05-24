<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'
import { formatDate } from '~/utils/date'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const formatLocaleDate = (date: string | Date) => formatDate(date, locale.value)

defineProps<{
  post: BlogCollectionItem
}>()
</script>

<template>
  <UiCard as="article" :to="localePath(`/blog/${post.slug}`)" padding="md" class="h-full flex flex-col">
    <div v-if="post.image" class="mb-4 -mx-6 -mt-6">
      <img
        :src="post.image"
        :alt="post.title"
        width="640"
        height="360"
        loading="lazy"
        decoding="async"
        class="w-full h-48 object-cover rounded-t-xl"
      />
    </div>
    <div class="flex-1">
      <div class="flex flex-wrap gap-2 mb-3">
        <UiBadge v-for="tag in post.tags" :key="tag" variant="secondary" size="sm">
          {{ tag }}
        </UiBadge>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {{ post.title }}
      </h3>
      <p class="text-sm text-text-muted line-clamp-2 mb-4">
        {{ post.description }}
      </p>
    </div>
    <div class="flex items-center gap-3 text-xs text-text-muted pt-4 border-t border-gray-200 dark:border-gray-800">
      <time :datetime="post.date">{{ formatLocaleDate(post.date) }}</time>
      <span v-if="post.readingTime">{{ t('blog.minRead', { minutes: post.readingTime }) }}</span>
    </div>
  </UiCard>
</template>
