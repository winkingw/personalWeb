<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

defineProps<{
  post: BlogCollectionItem
}>()
</script>

<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
      {{ post.title }}
    </h1>
    <p class="mt-3 text-lg text-text-muted">
      {{ post.description }}
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <BlogPostMeta
        :date="post.date"
        :reading-time="post.readingTime"
        :word-count="post.wordCount"
      />
      <div class="flex flex-wrap gap-2">
        <BlogTagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
      </div>
    </div>
  </div>
</template>
