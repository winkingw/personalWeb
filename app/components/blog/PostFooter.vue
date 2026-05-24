<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

defineProps<{
  prev?: { slug: string; title: string } | null
  next?: { slug: string; title: string } | null
}>()
</script>

<template>
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
    <div class="flex justify-between gap-4">
      <div v-if="prev" class="flex-1">
        <span class="text-sm text-text-muted">{{ t('blog.previousPost') }}</span>
        <NuxtLink
          :to="localePath(`/blog/${prev.slug}`)"
          class="block mt-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          {{ prev.title }}
        </NuxtLink>
      </div>
      <div v-if="next" class="flex-1 text-right">
        <span class="text-sm text-text-muted">{{ t('blog.nextPost') }}</span>
        <NuxtLink
          :to="localePath(`/blog/${next.slug}`)"
          class="block mt-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          {{ next.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
