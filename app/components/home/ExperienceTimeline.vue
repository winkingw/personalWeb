<script setup lang="ts">
import type { AboutCollectionItem } from '@nuxt/content'

const { t } = useI18n()

defineProps<{
  experience: AboutCollectionItem['experience']
}>()
</script>

<template>
  <section class="home-flow-section text-white">
    <UiContainer>
      <UiScrollReveal variant="text" class="mb-12 text-center">
        <p class="text-sm text-white/45">Selected time</p>
        <h2 class="mt-4 text-4xl font-light leading-tight sm:text-6xl">
          {{ t('home.experience') }}
        </h2>
      </UiScrollReveal>

      <div class="mx-auto max-w-3xl">
        <div class="relative ml-4 border-l border-white/14">
        <HomeTimelineItem
          v-for="(exp, i) in experience"
          :key="i"
          :role="exp.role"
          :company="exp.company"
          :period="exp.period"
          :description="exp.description"
          :index="i"
        />
        </div>
      </div>
    </UiContainer>
  </section>
</template>
