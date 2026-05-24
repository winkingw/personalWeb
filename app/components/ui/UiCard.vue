<script setup lang="ts">
const props = defineProps<{
  as?: 'div' | 'article' | 'a'
  to?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>()

const localePath = useLocalePath()
const resolvedTo = computed(() => (props.to ? localePath(props.to) : undefined))
const attrs = useAttrs()
</script>

<template>
  <NuxtLink
    v-if="resolvedTo"
    :to="resolvedTo"
    v-bind="attrs"
    class="block rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
    :class="[
      padding === 'none'
        ? ''
        : padding === 'sm'
          ? 'p-4'
          : padding === 'lg'
            ? 'p-8'
            : 'p-6',
    ]"
  >
    <slot />
  </NuxtLink>
  <component
    v-else
    :is="as || 'div'"
    v-bind="attrs"
    class="block rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
    :class="[
      padding === 'none'
        ? ''
        : padding === 'sm'
          ? 'p-4'
          : padding === 'lg'
            ? 'p-8'
            : 'p-6',
    ]"
  >
    <slot />
  </component>
</template>
