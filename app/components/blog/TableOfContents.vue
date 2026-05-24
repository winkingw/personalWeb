<script setup lang="ts">
defineProps<{
  toc: Array<{ id: string; text: string; depth: number }>
}>()
</script>

<template>
  <nav v-if="toc.length" class="space-y-1">
    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
      Table of Contents
    </h4>
    <a
      v-for="item in toc"
      :key="item.id"
      :href="`#${item.id}`"
      class="block text-sm text-text-muted hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      :style="{ paddingLeft: `${(item.depth - 1) * 12}px` }"
    >
      {{ item.text }}
    </a>
  </nav>
</template>
