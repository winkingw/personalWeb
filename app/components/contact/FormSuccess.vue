<script setup lang="ts">
const { t } = useI18n()
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="text-center py-12">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
      <svg
        class="w-8 h-8 text-green-600 dark:text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {{ t('contact.success.title') }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
      {{ message || t('contact.success.message') }}
    </p>
  </div>
</template>
