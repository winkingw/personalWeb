<script setup lang="ts">
const { t } = useI18n()
const { formData, errors, isSubmitting, isSuccess, serverError, validateField, submit } = useForm()

const honeypot = ref('')

async function onSubmit() {
  await submit(honeypot.value)
}
</script>

<template>
  <div>
    <ContactFormSuccess v-if="isSuccess" />

    <form
      v-else
      class="space-y-5"
      @submit.prevent="onSubmit"
      novalidate
    >
      <ContactFormInput
        :label="t('contact.form.name')"
        name="name"
        :model-value="formData.name"
        :error="errors.name"
        required
        @update:model-value="formData.name = $event"
      />

      <ContactFormInput
        :label="t('contact.form.email')"
        name="email"
        type="email"
        :model-value="formData.email"
        :error="errors.email"
        required
        @update:model-value="formData.email = $event"
      />

      <ContactFormInput
        :label="t('contact.form.subject')"
        name="subject"
        :model-value="formData.subject"
        :error="errors.subject"
        required
        @update:model-value="formData.subject = $event"
      />

      <ContactFormTextarea
        :label="t('contact.form.message')"
        name="message"
        :model-value="formData.message"
        :error="errors.message"
        :rows="6"
        required
        @update:model-value="formData.message = $event"
      />

      <!-- Honeypot — hidden from humans, visible to bots -->
      <div style="position: absolute; left: -9999px" aria-hidden="true">
        <label for="hp-field">{{ t('contact.form.honeypot') }}</label>
        <input
          id="hp-field"
          type="text"
          v-model="honeypot"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div v-if="serverError" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p class="text-sm text-red-600 dark:text-red-400">{{ serverError }}</p>
      </div>

      <UiButton
        type="submit"
        variant="primary"
        size="lg"
        :disabled="isSubmitting"
        class="w-full sm:w-auto"
      >
        <span v-if="isSubmitting" class="flex items-center gap-2">
          <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ t('contact.form.sending') }}
        </span>
        <span v-else>{{ t('contact.form.send') }}</span>
      </UiButton>
    </form>
  </div>
</template>
