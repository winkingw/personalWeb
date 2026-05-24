<script setup lang="ts">
defineProps<{
  project: Record<string, any>
}>()
</script>

<template>
  <div class="prose prose-lg dark:prose-invert max-w-none">
    <ContentRenderer :value="project" />
  </div>
</template>
