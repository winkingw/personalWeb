<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="home-flow-section text-white">
    <UiContainer>
      <div class="mx-auto max-w-2xl text-center">
        <UiScrollReveal variant="text">
          <p class="text-sm text-white/45">Contact</p>
          <h2 class="mt-4 text-4xl font-light leading-tight sm:text-6xl">
            {{ t('home.cta.title') }}
          </h2>
          <p class="mt-5 text-lg leading-8 text-white/60">
            {{ t('home.cta.description') }}
          </p>
        </UiScrollReveal>
        <UiScrollReveal variant="text" :delay="120" class="mt-8">
          <UiButton to="/contact" variant="primary" size="lg">
            {{ t('home.cta.button') }}
          </UiButton>
        </UiScrollReveal>
      </div>
    </UiContainer>
  </section>
</template>
