<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  links: Array<{ label: string; to: string; icon?: string }>
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const panelRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const previousActiveElement = ref<Element | null>(null)

function close() {
  emit('update:modelValue', false)
}

function getFocusableElements(): HTMLElement[] {
  if (!panelRef.value) return []
  const selector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return Array.from(
    panelRef.value.querySelectorAll<HTMLElement>(selector),
  ).filter((el) => el.offsetParent !== null)
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  const focusables = getFocusableElements()
  if (focusables.length === 0) return

  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

function handleDocumentKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (props.modelValue) close()
}

function restoreFocus() {
  const prev = previousActiveElement.value
  if (prev instanceof HTMLElement) {
    prev.focus()
  }
  previousActiveElement.value = null
}

onMounted(() => {
  document.addEventListener('keydown', handleDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleDocumentKeydown)
  restoreFocus()
})

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      previousActiveElement.value = document.activeElement
      nextTick(() => {
        closeButtonRef.value?.focus()
      })
    } else {
      restoreFocus()
    }
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="mobile-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/45 backdrop-blur-sm" />

        <div
          ref="panelRef"
          class="mobile-panel absolute right-0 top-0 h-full w-[min(22rem,88vw)] border-l border-white/40 bg-white/72 p-6 text-neutral-950 shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/82 dark:text-white"
          @keydown="trapFocus"
        >
          <button
            ref="closeButtonRef"
            @click="close"
            class="glass-icon-button mb-8 text-neutral-900"
            :aria-label="t('a11y.closeMenu')"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <nav>
            <ul class="space-y-2">
              <li v-for="link in links" :key="link.to">
                <NuxtLink
                  :to="localePath(link.to)"
                  class="block rounded-full px-4 py-3 text-base font-medium text-neutral-700 transition hover:bg-white/72 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white/72 dark:hover:bg-white/10 dark:hover:text-white"
                  active-class="bg-white/82 text-neutral-950 shadow-sm dark:bg-white/14 dark:text-white"
                  @click="close"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
