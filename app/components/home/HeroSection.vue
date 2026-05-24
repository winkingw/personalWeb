<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

defineProps<{
  name: string
  tagline: string
  description: string
}>()

const heroImage = '/images/hero-subject.jpg'
const photographyLabel = computed(() => locale.value === 'zh' ? '摄影' : 'Photography')
</script>

<template>
  <section
    class="relative isolate overflow-hidden text-[#161616] dark:text-[#161616]"
  >
    <div class="absolute inset-x-0 top-0 h-40 bg-white/70 blur-3xl" aria-hidden="true" />
    <div class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7f7f4] to-transparent" aria-hidden="true" />

    <div class="relative min-h-[calc(100svh-4rem)] px-4 py-10 sm:px-6 lg:px-8">
      <div
        class="pointer-events-none absolute left-1/2 top-10 h-[78svh] w-[min(72vw,720px)] -translate-x-1/2 rounded-full bg-white/70 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative mx-auto min-h-[calc(100svh-9rem)] max-w-7xl lg:flex lg:items-end">
        <div
          class="pointer-events-none absolute inset-x-0 top-4 mx-auto flex justify-center"
          aria-hidden="true"
        >
          <p class="max-w-[min(92vw,1100px)] text-center text-7xl font-light leading-[0.85] text-black/[0.035] sm:text-8xl lg:text-[12rem] xl:text-[14rem]">
            {{ name }}
          </p>
        </div>

        <img
          :src="heroImage"
          :alt="name"
          width="960"
          height="1365"
          fetchpriority="high"
          decoding="async"
          class="pointer-events-none relative z-0 mx-auto mt-12 h-auto w-full max-w-[min(88vw,420px)] object-contain drop-shadow-[0_34px_90px_rgba(20,20,20,0.13)] hero-subject-mask sm:max-w-[460px] lg:absolute lg:left-1/2 lg:top-4 lg:mt-0 lg:h-[min(82svh,850px)] lg:w-auto lg:max-w-none lg:-translate-x-1/2"
        />

        <div class="relative z-10 grid w-full gap-8 pb-10 sm:pb-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(340px,0.5fr)] lg:items-end">
          <div class="max-w-lg animate-fade-in-up">
            <p class="text-sm font-semibold lowercase text-black/80">
              {{ name }}
            </p>
            <h1 class="mt-4 max-w-[18rem] break-words text-4xl font-light leading-[0.96] sm:max-w-lg sm:text-6xl lg:text-8xl lg:leading-[0.92]">
              {{ tagline }}
            </h1>
            <p class="mt-5 max-w-md text-base leading-7 text-black/52 sm:text-lg">
              {{ description }}
            </p>
          </div>

          <div class="relative z-10 w-full max-w-sm justify-self-start rounded-[2rem] border border-white/70 bg-white/45 p-4 shadow-[0_24px_90px_rgba(18,18,18,0.10)] backdrop-blur-2xl sm:max-w-xl sm:p-5 lg:justify-self-end">
            <p class="mb-4 text-xs uppercase text-black/40">
              Explore
            </p>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                :to="localePath('/projects')"
                class="glass-chip"
              >
                <UiKineticText :text="t('home.hero.viewProjects')" />
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact')"
                class="glass-chip"
              >
                <UiKineticText :text="t('home.hero.getInTouch')" />
              </NuxtLink>
              <a href="#photography" class="glass-chip">
                <UiKineticText :text="photographyLabel" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
