<script setup lang="ts">
defineProps<{
  role: string
  company: string
  period: string
  description: string
  index?: number
}>()
</script>

<template>
  <UiScrollReveal
    variant="text"
    class="relative mb-10 ml-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
    :delay="(index || 0) * 110"
  >
    <div class="absolute -left-[calc(2rem+5px)] top-6 h-3 w-3 rounded-full border-2 border-[#071413] bg-white" />
    <span class="text-sm text-white/45">{{ period }}</span>
    <h3 class="mt-2 text-xl font-medium text-white">
      {{ role }}
    </h3>
    <p class="text-white/52">{{ company }}</p>
    <p class="mt-3 leading-7 text-white/62">{{ description }}</p>
  </UiScrollReveal>
</template>
