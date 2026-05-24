<script setup lang="ts">
defineProps<{
  images: string[]
}>()
</script>

<template>
  <div v-if="images.length" class="grid gap-4 sm:grid-cols-2">
    <img
      v-for="(src, i) in images"
      :key="i"
      :src="src"
      :alt="`Screenshot ${i + 1}`"
      width="640"
      height="360"
      loading="lazy"
      decoding="async"
      class="rounded-lg border border-gray-200 dark:border-gray-800 w-full"
    />
  </div>
</template>
