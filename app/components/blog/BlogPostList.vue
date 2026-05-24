<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

defineProps<{
  posts: BlogCollectionItem[]
}>()
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-stagger">
    <BlogPostCard v-for="post in posts" :key="post.slug" :post="post" />
  </div>
</template>
