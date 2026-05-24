<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const slug = String(route.params.slug)

const { getProject } = useContent()

const { data: project } = await useAsyncData(`project-${locale.value}-${slug}`, () =>
  getProject(slug, locale.value)
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useSeo({
  title: () => project.value?.title || t('projects.title'),
  description: () => project.value?.summary || '',
  image: () => project.value?.image,
  type: 'article',
  publishedAt: () => project.value?.date,
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <ProjectHero v-if="project" :project="project" />

    <UiDivider />

    <div class="py-8">
      <ProjectContent v-if="project" :project="project" />
    </div>

    <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
      <NuxtLink
        :to="localePath('/projects')"
        class="text-sm text-text-muted hover:text-blue-600 dark:hover:text-blue-400"
      >
        {{ t('projects.allProjects') }}
      </NuxtLink>
    </div>
  </div>
</template>
