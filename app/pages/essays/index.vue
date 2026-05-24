<script setup lang="ts">
const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const { getEssayList } = useContent()
const { data: essays } = await useAsyncData(`essays-list-${locale.value}`, () => getEssayList(locale.value))

useSeo({
  title: () => t('essays.title'),
  description: () => t('essays.description'),
})
</script>

<template>
  <div>
    <UiPageHeader
      :title="t('essays.title')"
      :description="t('essays.description')"
    />

    <UiSection>
      <EssayList v-if="essays?.length" :essays="essays" />

      <div
        v-if="!essays?.length"
        class="text-center py-12 text-text-muted"
      >
        <p class="text-lg">{{ t('essays.noEssays') }}</p>
      </div>
    </UiSection>
  </div>
</template>
