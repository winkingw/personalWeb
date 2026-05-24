<script setup lang="ts">
import { formatDate } from '~/utils/date'

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })
const formatLocaleDate = (date: string | Date) => formatDate(date, locale.value)

const slug = String(route.params.slug)

const { getEssay } = useContent()

const { data: essay } = await useAsyncData(`essay-${locale.value}-${slug}`, () =>
  getEssay(slug, locale.value)
)

if (!essay.value) {
  throw createError({ statusCode: 404, statusMessage: 'Essay not found' })
}

useSeo({
  title: () => essay.value?.title || t('essays.title'),
  description: () => essay.value?.description || '',
  type: 'article',
  publishedAt: () => essay.value?.date,
  updatedAt: () => essay.value?.updated,
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <article v-if="essay">
      <header class="mb-8">
        <time
          :datetime="essay.date"
          class="text-sm text-text-muted"
        >
          {{ formatLocaleDate(essay.date) }}
        </time>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {{ essay.title }}
        </h1>
      </header>

      <div class="prose prose-lg dark:prose-invert max-w-none">
        <ContentRenderer :value="essay" />
      </div>
    </article>

    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <NuxtLink
        :to="localePath('/essays')"
        class="text-sm text-text-muted hover:text-blue-600 dark:hover:text-blue-400"
      >
        {{ t('essays.allEssays') }}
      </NuxtLink>
    </div>
  </div>
</template>
