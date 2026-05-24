<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const { getProjectList } = useContent()

const activeTech = ref<string | null>(null)

const { data: allProjects } = await useAsyncData(`projects-list-${locale.value}`, () => getProjectList(locale.value))

const allTechStacks = computed(() => {
  const techs = new Set<string>()
  for (const p of (allProjects.value || [])) {
    for (const t of p.techStack) techs.add(t)
  }
  return [...techs].sort()
})

const filteredProjects = computed(() => {
  const projects = allProjects.value || []
  if (!activeTech.value) return projects
  return projects.filter((p: ProjectsCollectionItem) => p.techStack.includes(activeTech.value!))
})

function onTechChange(tech: string | null) {
  activeTech.value = tech
}

useSeo({
  title: () => t('projects.title'),
  description: () => t('projects.description'),
})
</script>

<template>
  <div>
    <UiPageHeader
      :title="t('projects.title')"
      :description="t('projects.description')"
    />

    <UiSection>
      <div class="space-y-6">
        <ProjectFilters
          v-if="allTechStacks.length"
          :tech-stack="allTechStacks"
          @update:tech="onTechChange"
        />

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-stagger">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.slug"
            :project="project"
          />
        </div>

        <div
          v-if="!filteredProjects.length"
          class="text-center py-12 text-text-muted"
        >
          <p class="text-lg">{{ t('projects.noProjects') }}</p>
        </div>
      </div>
    </UiSection>
  </div>
</template>
