<script setup lang="ts">
defineProps<{
  tag: string
}>()
</script>

<template>
  <NuxtLink :to="`/blog?tag=${encodeURIComponent(tag)}`">
    <UiBadge variant="primary" size="sm">
      {{ tag }}
    </UiBadge>
  </NuxtLink>
</template>
