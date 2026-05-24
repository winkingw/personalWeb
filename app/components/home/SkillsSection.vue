<script setup lang="ts">
import type { AboutCollectionItem } from '@nuxt/content'

const { t } = useI18n()

defineProps<{
  skills: AboutCollectionItem['skills']
}>()
</script>

<template>
  <section class="home-flow-section text-white">
    <UiContainer>
      <UiScrollReveal variant="text" class="mb-12 text-center">
        <p class="text-sm text-white/45">Capability</p>
        <h2 class="mt-4 text-4xl font-light leading-tight sm:text-6xl">
          {{ t('home.skills') }}
        </h2>
      </UiScrollReveal>

      <div class="mx-auto max-w-4xl space-y-8">
        <UiScrollReveal
          v-for="(category, index) in [...new Set(skills.map((s: any) => s.category))]"
          :key="category"
          variant="text"
          :delay="index * 100"
          class="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-md"
        >
          <h3 class="mb-4 text-lg font-medium text-white">
            {{ category }}
          </h3>
          <div class="flex flex-wrap gap-3">
            <HomeSkillBadge
              v-for="skill in skills.filter((s: any) => s.category === category)"
              :key="skill.name"
              :name="skill.name"
              :level="skill.level"
            />
          </div>
        </UiScrollReveal>
      </div>
    </UiContainer>
  </section>
</template>
