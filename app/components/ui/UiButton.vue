<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  disabled?: boolean
}>()

const localePath = useLocalePath()

const is = computed(() => {
  if (props.to && !props.disabled) {
    return resolveComponent('NuxtLink')
  }
  if (props.to && props.disabled) {
    return 'span'
  }
  return 'button'
})

const resolvedTo = computed(() => (props.to ? localePath(props.to) : undefined))
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="resolvedTo"
    class="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none"
    :class="[
      variant === 'secondary'
        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
        : variant === 'ghost'
          ? 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
      size === 'sm'
        ? 'text-sm px-3 py-1.5 gap-1.5'
        : size === 'lg'
          ? 'text-lg px-6 py-3 gap-2.5'
          : 'text-base px-4 py-2 gap-2',
    ]"
  >
    <slot />
  </NuxtLink>
  <span
    v-else-if="to && disabled"
    role="link"
    :aria-disabled="true"
    :tabindex="-1"
    class="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 opacity-50 pointer-events-none"
    :class="[
      variant === 'secondary'
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        : variant === 'ghost'
          ? 'text-gray-700 dark:text-gray-300'
          : 'bg-blue-600 text-white',
      size === 'sm'
        ? 'text-sm px-3 py-1.5 gap-1.5'
        : size === 'lg'
          ? 'text-lg px-6 py-3 gap-2.5'
          : 'text-base px-4 py-2 gap-2',
    ]"
  >
    <slot />
  </span>
  <button
    v-else
    :disabled="disabled"
    class="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      variant === 'secondary'
        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
        : variant === 'ghost'
          ? 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
      size === 'sm'
        ? 'text-sm px-3 py-1.5 gap-1.5'
        : size === 'lg'
          ? 'text-lg px-6 py-3 gap-2.5'
          : 'text-base px-4 py-2 gap-2',
    ]"
  >
    <slot />
  </button>
</template>
