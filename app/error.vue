<script setup lang="ts">
const props = defineProps<{
  error: {
    url?: string
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const is404 = computed(() => props.error?.statusCode === 404)
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"
  >
    <div class="text-center px-4">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white">
        {{ error?.statusCode || '500' }}
      </h1>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
        {{ is404 ? 'Page not found' : 'Something went wrong' }}
      </p>
      <p class="mt-2 text-gray-500 dark:text-gray-500">
        {{
          is404
            ? "The page you're looking for doesn't exist."
            : 'An unexpected error occurred. Please try again later.'
        }}
      </p>
      <UiButton to="/" variant="primary" size="lg" class="mt-8">
        Go back home
      </UiButton>
    </div>
  </div>
</template>
