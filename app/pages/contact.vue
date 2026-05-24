<script setup lang="ts">
const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

useSeo({
  title: () => t('contact.title'),
  description: () => t('contact.description'),
})
</script>

<template>
  <div>
    <UiPageHeader
      :title="t('contact.title')"
      :description="t('contact.description')"
    />

    <UiSection>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <ContactForm />
        </div>
        <div>
          <ContactSocialLinks />
        </div>
      </div>
    </UiSection>
  </div>
</template>
