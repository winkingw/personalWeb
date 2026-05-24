<script setup lang="ts">
import type { EssaysCollectionItem } from '@nuxt/content'

defineProps<{
  essays: EssaysCollectionItem[]
}>()
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-4 animate-stagger">
    <EssayCard v-for="essay in essays" :key="essay.slug" :essay="essay" />
  </div>
</template>
