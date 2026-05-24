<script setup lang="ts">
defineProps<{
  src: string
  title?: string
}>()
</script>

<template>
  <div class="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div
      v-if="title"
      class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm text-text-muted font-medium border-b border-gray-200 dark:border-gray-800"
    >
      {{ title }}
    </div>
    <div class="relative" style="aspect-ratio: 16/9">
      <iframe
        :src="src"
        :title="title || 'CodeSandbox demo'"
        class="absolute inset-0 w-full h-full"
        loading="lazy"
        referrerpolicy="no-referrer"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-scripts"
      />
    </div>
  </div>
</template>
