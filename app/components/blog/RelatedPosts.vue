<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

const localePath = useLocalePath()
const { t } = useI18n()

defineProps<{
  posts: BlogCollectionItem[]
}>()
</script>

<template>
  <div v-if="posts.length">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ t('blog.relatedPosts') }}
    </h3>
    <div class="space-y-3">
      <NuxtLink
        v-for="post in posts"
        :key="post.slug"
        :to="localePath(`/blog/${post.slug}`)"
        class="block text-sm text-text-muted hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {{ post.title }}
      </NuxtLink>
    </div>
  </div>
</template>
