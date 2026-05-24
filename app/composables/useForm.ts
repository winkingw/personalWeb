export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function useForm() {
  const { t } = useI18n()

  function validate(data: ContactFormData): FormErrors {
    const errors: FormErrors = {}

    if (!data.name.trim()) {
      errors.name = t('contact.validation.nameRequired')
    }
    if (!data.email.trim()) {
      errors.email = t('contact.validation.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = t('contact.validation.emailInvalid')
    }
    if (!data.subject.trim()) {
      errors.subject = t('contact.validation.subjectRequired')
    }
    if (!data.message.trim()) {
      errors.message = t('contact.validation.messageRequired')
    } else if (data.message.trim().length < 10) {
      errors.message = t('contact.validation.messageMinLength')
    }

    return errors
  }

  const formData = reactive<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const errors = reactive<FormErrors>({})
  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const serverError = ref('')
  const pageLoadTime = Date.now()

  function clearErrors() {
    errors.name = undefined
    errors.email = undefined
    errors.subject = undefined
    errors.message = undefined
    serverError.value = ''
  }

  function validateField(field: keyof ContactFormData) {
    const single = { ...formData }
    const result = validate(single)
    ;(errors as Record<string, string | undefined>)[field] = (result as Record<string, string | undefined>)[field]
  }

  async function submit(honeypot: string) {
    clearErrors()

    // Timestamp check: reject if form was filled in < 3 seconds
    if (Date.now() - pageLoadTime < 3000) {
      serverError.value = t('contact.validation.waitBeforeSubmit')
      return false
    }

    // Honeypot check
    if (honeypot) {
      // Bot filled the hidden field — silently "succeed"
      isSuccess.value = true
      return true
    }

    // Validate all fields
    const validationErrors = validate(formData)
    Object.assign(errors, validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return false
    }

    isSubmitting.value = true

    try {
      const res = await $fetch('/api/contact', {
        method: 'POST',
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          honeypot,
          startedAt: pageLoadTime,
        },
      })

      if (res && (res as any).success) {
        isSuccess.value = true
        formData.name = ''
        formData.email = ''
        formData.subject = ''
        formData.message = ''
        return true
      } else {
        serverError.value = (res as any).error || t('contact.validation.error')
        return false
      }
    } catch (e: any) {
      serverError.value = e?.data?.error || e?.message || t('contact.validation.sendFailed')
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    serverError,
    validateField,
    submit,
  }
}
