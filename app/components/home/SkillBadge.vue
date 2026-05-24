<script setup lang="ts">
defineProps<{
  name: string
  level: number
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-sm font-medium text-white/78 transition duration-200 hover:border-white/35 hover:bg-white/14 hover:text-white"
  >
    {{ name }}
    <span class="text-xs text-white/38">{{ level }}%</span>
  </span>
</template>
