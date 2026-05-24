<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  links: Array<{ label: string; to: string; icon?: string }>
}>()
</script>

<template>
  <nav aria-label="Main navigation" class="glass-nav-pill">
    <ul class="flex items-center gap-1">
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="localePath(link.to)"
          class="rounded-full px-4 py-2 text-sm font-medium text-neutral-800/75 transition duration-200 hover:bg-white/70 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          active-class="bg-white/80 text-neutral-950 shadow-sm"
        >
          <UiKineticText :text="link.label" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
