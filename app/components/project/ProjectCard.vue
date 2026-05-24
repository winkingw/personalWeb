<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'
import { formatDate } from '~/utils/date'

const { locale } = useI18n()
const localePath = useLocalePath()
const formatLocaleDate = (date: string | Date) => formatDate(date, locale.value)

defineProps<{
  project: ProjectsCollectionItem
}>()
</script>

<template>
  <UiCard as="article" :to="localePath(`/projects/${project.slug}`)" padding="md" class="h-full flex flex-col">
    <div v-if="project.image" class="mb-4 -mx-6 -mt-6">
      <img
        :src="project.image"
        :alt="project.title"
        width="640"
        height="360"
        loading="lazy"
        decoding="async"
        class="w-full h-48 object-cover rounded-t-xl"
      />
    </div>
    <div class="flex-1">
      <div class="flex flex-wrap gap-2 mb-3">
        <UiBadge
          v-for="tech in project.techStack"
          :key="tech"
          variant="outline"
          size="sm"
        >
          {{ tech }}
        </UiBadge>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ project.title }}
      </h3>
      <p class="text-sm text-text-muted line-clamp-3">
        {{ project.summary }}
      </p>
    </div>
    <div class="flex items-center gap-3 text-xs text-text-muted pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
      <time :datetime="project.date">{{ formatLocaleDate(project.date) }}</time>
    </div>
  </UiCard>
</template>
