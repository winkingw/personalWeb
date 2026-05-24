<script setup lang="ts">
defineProps<{
  techStack: string[]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UiBadge
      v-for="tech in techStack"
      :key="tech"
      variant="outline"
      size="md"
    >
      {{ tech }}
    </UiBadge>
  </div>
</template>
