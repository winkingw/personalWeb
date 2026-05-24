<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: string
  variant?: 'section' | 'text' | 'image'
  delay?: number
  once?: boolean
  rootMargin?: string
  threshold?: number
}>(), {
  as: 'div',
  variant: 'section',
  delay: 0,
  once: false,
  rootMargin: '8% 0px 8% 0px',
  threshold: 0.08,
})

const target = ref<HTMLElement | null>(null)
const mounted = ref(false)
const visible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  mounted.value = true

  if (!target.value || !('IntersectionObserver' in window)) {
    visible.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = Boolean(entry?.isIntersecting)
      if (props.once && entry?.isIntersecting) {
        observer?.disconnect()
      }
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    },
  )

  observer.observe(target.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

const revealStyle = computed(() => ({
  '--reveal-delay': `${props.delay}ms`,
}))
</script>

<template>
  <component
    :is="as"
    ref="target"
    class="scroll-reveal"
    :class="[
      `scroll-reveal-${variant}`,
      mounted && 'scroll-reveal-ready',
      visible && 'is-visible',
    ]"
    :style="revealStyle"
  >
    <slot />
  </component>
</template>
