<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium"
    :class="[
      variant === 'primary'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        : variant === 'secondary'
          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          : variant === 'outline'
            ? 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
    ]"
  >
    <slot />
  </span>
</template>
