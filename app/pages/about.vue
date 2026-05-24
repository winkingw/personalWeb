<script setup lang="ts">
type Skill = { name: string; level: number; category: string }

const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const { getAbout } = useContent()
const { data: about } = await useAsyncData(`about-${locale.value}`, () => getAbout(locale.value))

useSeo({
  title: () => about.value?.name || t('about.title'),
  description: () => about.value?.introduction || '',
})
</script>

<template>
  <div>
    <UiPageHeader
      :title="about?.name || t('about.title')"
      :description="about?.title"
    />

    <UiSection v-if="about?.introduction">
      <div class="max-w-3xl mx-auto">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <ContentRenderer v-if="about" :value="about" />
        </div>
      </div>
    </UiSection>

    <UiSection
      v-if="about?.skills?.length"
      :title="t('about.skills')"
      background="muted"
    >
      <div class="max-w-4xl mx-auto space-y-8">
        <div
          v-for="category in [...new Set(about.skills.map((s: Skill) => s.category))]"
          :key="category"
        >
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {{ category }}
          </h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="skill in about.skills.filter((s: Skill) => s.category === category)"
              :key="skill.name"
              class="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <span class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ skill.name }}
              </span>
              <div class="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                  :style="{ width: `${skill.level}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiSection>

    <UiSection
      v-if="about?.experience?.length"
      :title="t('about.experience')"
    >
      <div class="max-w-3xl mx-auto">
        <div class="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4">
          <div
            v-for="(exp, i) in about.experience"
            :key="i"
            class="mb-10 ml-8 relative"
          >
            <div
              class="absolute -left-[calc(2rem+5px)] top-1 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-gray-950"
            />
            <span class="text-sm text-text-muted">{{ exp.period }}</span>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ exp.role }}
            </h3>
            <p class="text-text-muted font-medium">{{ exp.company }}</p>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ exp.description }}</p>
          </div>
        </div>
      </div>
    </UiSection>

    <UiSection
      v-if="about?.socialLinks"
      background="muted"
    >
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('about.connect') }}
        </h2>
        <div class="flex justify-center gap-4 flex-wrap">
          <UiButton
            v-if="about.socialLinks.github"
            variant="secondary"
            :to="about.socialLinks.github"
            size="md"
          >
            GitHub
          </UiButton>
          <UiButton
            v-if="about.socialLinks.linkedin"
            variant="secondary"
            :to="about.socialLinks.linkedin"
            size="md"
          >
            LinkedIn
          </UiButton>
          <UiButton
            v-if="about.socialLinks.twitter"
            variant="secondary"
            :to="about.socialLinks.twitter"
            size="md"
          >
            Twitter
          </UiButton>
          <UiButton
            v-if="about.socialLinks.email"
            variant="primary"
            :to="`mailto:${about.socialLinks.email}`"
            size="md"
          >
            Email
          </UiButton>
        </div>
      </div>
    </UiSection>
  </div>
</template>
