<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="py-16 sm:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
