<script setup lang="ts">
const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const { getAbout, getFeaturedProjects } = useContent()
const { data: about } = await useAsyncData(`home-about-${locale.value}`, () => getAbout(locale.value))
const { data: featuredProjects } = await useAsyncData(`featured-${locale.value}`, () =>
  getFeaturedProjects(locale.value, 3)
)

useSeo({
  title: () => about.value?.name || t('nav.home'),
  description: () => about.value?.introduction || '',
})
</script>

<template>
  <div class="home-flow">
    <HomeHeroSection
      :name="about?.name || 'Takagi San'"
      :tagline="about?.title || 'Full-Stack Developer'"
      :description="about?.introduction || 'Building thoughtful web applications with Vue, TypeScript, and modern frontend tooling.'"
    />

    <UiScrollReveal as="div" variant="section">
      <HomePhotographyShowcase />
    </UiScrollReveal>

    <UiScrollReveal
      v-if="about?.skills?.length"
      as="div"
      variant="section"
    >
      <HomeSkillsSection :skills="about.skills" />
    </UiScrollReveal>

    <UiScrollReveal
      v-if="about?.experience?.length"
      as="div"
      variant="section"
    >
      <HomeExperienceTimeline :experience="about.experience" />
    </UiScrollReveal>

    <UiScrollReveal
      v-if="featuredProjects?.length"
      as="div"
      variant="section"
    >
      <HomeFeaturedProjects :projects="featuredProjects" />
    </UiScrollReveal>

    <UiScrollReveal as="div" variant="section">
      <HomeContactCTA />
    </UiScrollReveal>
  </div>
</template>
