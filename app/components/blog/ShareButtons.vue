<script setup lang="ts">
defineProps<{
  title: string
  url: string
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-text-muted">Share:</span>
    <a
      :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="text-sm text-text-muted hover:text-blue-600 dark:hover:text-blue-400"
    >
      Twitter
    </a>
    <a
      :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="text-sm text-text-muted hover:text-blue-600 dark:hover:text-blue-400"
    >
      LinkedIn
    </a>
  </div>
</template>
