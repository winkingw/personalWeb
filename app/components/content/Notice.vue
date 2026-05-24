<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'tip'
}>()
</script>

<template>
  <aside
    class="my-6 rounded-lg border p-4 text-sm leading-relaxed"
    :class="[
      type === 'warning'
        ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200'
        : type === 'tip'
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
          : 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
    ]"
  >
    <div class="flex items-start gap-3">
      <span class="mt-0.5 text-base shrink-0">
        <svg
          v-if="type === 'warning'"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3l9.66 16.5H2.34L12 3z" />
        </svg>
        <svg
          v-else-if="type === 'tip'"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </span>
      <div>
        <slot />
      </div>
    </div>
  </aside>
</template>
