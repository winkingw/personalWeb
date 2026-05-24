<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const activeIndex = ref<number | null>(null)

const copy = computed(() => {
  if (locale.value === 'zh') {
    return {
      eyebrow: 'Photography',
      title: '影像练习',
      description: '把摄影作品作为空间里的颜色来源。悬停在图片上，背景会切换到对应的主色调。',
      open: '查看作品',
    }
  }

  return {
    eyebrow: 'Photography',
    title: 'Visual Studies',
    description: 'A compact photography wall where each image drives the surrounding color field on hover.',
    open: 'View study',
  }
})

const studies = [
  {
    title: 'Soft Portrait',
    meta: 'Opening subject',
    image: '/images/hero-subject.jpg',
    href: '/about',
    accent: '#f1ded8',
    foreground: '#171313',
  },
  {
    title: 'Interface Glow',
    meta: 'Project light',
    image: '/images/projects/personal-web.png',
    href: '/projects/personal-website',
    accent: '#057a62',
    foreground: '#f5f3ed',
  },
  {
    title: 'Warm System',
    meta: 'Tool texture',
    image: '/images/projects/cli-task.png',
    href: '/projects/cli-task-manager',
    accent: '#ff4b22',
    foreground: '#160704',
  },
  {
    title: 'Blue Archive',
    meta: 'Technical note',
    image: '/images/blog/typescript.png',
    href: '/blog/typescript-best-practices-2026',
    accent: '#0b73ff',
    foreground: '#06111f',
  },
]

const activeStudy = computed(() =>
  activeIndex.value === null ? null : studies[activeIndex.value],
)

const sectionStyle = computed(() => ({
  '--photo-bg': activeStudy.value?.accent || '#050505',
  '--photo-fg': activeStudy.value?.foreground || '#f5f3ed',
}))

function setActive(index: number | null) {
  activeIndex.value = index
}
</script>

<template>
  <section
    id="photography"
    class="photo-showcase relative -mt-16 overflow-hidden pb-20 pt-36 text-[var(--photo-fg)] transition-colors duration-500 sm:pb-28 sm:pt-44"
    :style="sectionStyle"
  >
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.13),transparent_42%)]" />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:items-end">
        <div class="max-w-sm">
          <p class="text-sm font-medium text-current/55">
            {{ copy.eyebrow }}
          </p>
          <h2 class="mt-4 text-5xl font-light leading-[0.88] sm:text-6xl lg:text-8xl xl:text-9xl">
            {{ copy.title }}
          </h2>
          <p class="mt-6 text-base leading-7 text-current/62">
            {{ copy.description }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <UiScrollReveal
            v-for="(study, index) in studies"
            :key="study.title"
            as="div"
            variant="image"
            :delay="index * 90"
          >
            <NuxtLink
              :to="localePath(study.href)"
              :data-accent="study.accent"
              class="group block outline-none"
              @mouseenter="setActive(index)"
              @pointerenter="setActive(index)"
              @mouseleave="setActive(null)"
              @pointerleave="setActive(null)"
              @focus="setActive(index)"
              @blur="setActive(null)"
            >
              <figure class="photo-card">
                <div class="overflow-hidden rounded-[1.75rem] bg-black/20 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                  <img
                    :src="study.image"
                    :alt="study.title"
                    width="640"
                    height="480"
                    loading="lazy"
                    decoding="async"
                    class="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
                  />
                </div>
                <figcaption class="mt-4 flex items-end justify-between gap-4 text-current">
                  <div>
                    <p class="text-xl font-medium">
                      <span aria-hidden="true">-></span> {{ study.title }}
                    </p>
                    <p class="mt-1 text-sm text-current/55">
                      {{ study.meta }}
                    </p>
                  </div>
                  <span class="rounded-full border border-current/20 px-3 py-1 text-xs text-current/64 transition group-hover:bg-current group-hover:text-[var(--photo-bg)] group-focus-visible:bg-current group-focus-visible:text-[var(--photo-bg)]">
                    <UiKineticText :text="copy.open" />
                  </span>
                </figcaption>
              </figure>
            </NuxtLink>
          </UiScrollReveal>
        </div>
      </div>
    </div>
  </section>
</template>
