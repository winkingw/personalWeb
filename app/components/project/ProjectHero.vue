<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'
import { formatDate } from '~/utils/date'

const { locale } = useI18n()
const formatLocaleDate = (date: string | Date) => formatDate(date, locale.value)

defineProps<{
  project: ProjectsCollectionItem
}>()
</script>

<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
      {{ project.title }}
    </h1>
    <p class="mt-3 text-lg text-text-muted">
      {{ project.summary }}
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <time :datetime="project.date" class="text-sm text-text-muted">
        {{ formatLocaleDate(project.date) }}
      </time>
      <div class="flex flex-wrap gap-2">
        <UiBadge
          v-for="tech in project.techStack"
          :key="tech"
          variant="primary"
          size="sm"
        >
          {{ tech }}
        </UiBadge>
      </div>
    </div>
    <div v-if="project.links" class="mt-4 flex gap-3">
      <UiButton
        v-if="project.links.github"
        variant="secondary"
        size="sm"
        :to="project.links.github"
      >
        GitHub
      </UiButton>
      <UiButton
        v-if="project.links.demo"
        variant="primary"
        size="sm"
        :to="project.links.demo"
      >
        Live Demo
      </UiButton>
      <UiButton
        v-if="project.links.docs"
        variant="secondary"
        size="sm"
        :to="project.links.docs"
      >
        Docs
      </UiButton>
      <UiButton
        v-if="project.links.npm"
        variant="secondary"
        size="sm"
        :to="project.links.npm"
      >
        npm
      </UiButton>
    </div>
  </div>
</template>
