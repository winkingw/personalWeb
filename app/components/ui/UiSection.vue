<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  background?: 'default' | 'muted'
}>()
</script>

<template>
  <section
    :class="[
      background === 'muted' ? 'bg-gray-50 dark:bg-gray-800/50' : '',
      'py-16 sm:py-24',
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="title || description" class="mb-12 text-center">
        <h2
          v-if="title"
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          {{ description }}
        </p>
      </div>
      <slot />
    </div>
  </section>
</template>
