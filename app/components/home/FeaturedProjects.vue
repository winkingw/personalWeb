<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

const { locale, t } = useI18n()
const localePath = useLocalePath()

const openLabel = computed(() => locale.value === 'zh' ? '打开' : 'Open')

defineProps<{
  projects: ProjectsCollectionItem[]
}>()
</script>

<template>
  <section
    v-if="projects.length"
    class="home-flow-section text-white"
  >
    <UiContainer>
      <UiScrollReveal variant="text" class="mb-12 max-w-3xl">
        <p class="text-sm text-white/45">Featured work</p>
        <h2 class="mt-4 text-4xl font-light leading-tight sm:text-6xl">
          {{ t('home.featuredProjects') }}
        </h2>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-white/58">
          {{ t('home.featuredDescription') }}
        </p>
      </UiScrollReveal>

      <div class="grid gap-8 lg:grid-cols-3">
        <UiScrollReveal
          v-for="(project, index) in projects"
          :key="project.slug"
          as="article"
          variant="image"
          :delay="index * 110"
        >
          <NuxtLink
            :to="localePath(`/projects/${project.slug}`)"
            class="group block outline-none"
          >
            <div class="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_90px_rgba(0,0,0,0.2)]">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
                class="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
              />
            </div>
            <div class="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 class="text-2xl font-medium text-white">
                  <span aria-hidden="true">-></span> {{ project.title }}
                </h3>
                <p class="mt-2 line-clamp-3 text-sm leading-6 text-white/55">
                  {{ project.summary }}
                </p>
              </div>
              <span class="mt-1 rounded-full border border-white/15 px-3 py-1 text-xs text-white/55 transition group-hover:border-white/35 group-hover:text-white group-focus-visible:border-white/35 group-focus-visible:text-white">
                {{ openLabel }}
              </span>
            </div>
          </NuxtLink>
        </UiScrollReveal>
      </div>

      <UiScrollReveal variant="text" class="mt-10">
        <UiButton to="/projects" variant="secondary" size="md">
          {{ t('home.featuredViewAll') }}
        </UiButton>
      </UiScrollReveal>
    </UiContainer>
  </section>
</template>
