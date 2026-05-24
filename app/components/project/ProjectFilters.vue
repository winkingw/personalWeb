<script setup lang="ts">
const props = defineProps<{
  techStack: string[]
}>()

const emit = defineEmits<{
  'update:tech': [tech: string | null]
}>()

const activeTech = ref<string | null>(null)

function selectTech(tech: string | null) {
  activeTech.value = tech
  emit('update:tech', tech)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      :class="[
        'text-sm px-3 py-1 rounded-full font-medium transition-colors',
        !activeTech
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      ]"
      @click="selectTech(null)"
    >
      All
    </button>
    <button
      v-for="tech in techStack"
      :key="tech"
      :class="[
        'text-sm px-3 py-1 rounded-full font-medium transition-colors',
        activeTech === tech
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      ]"
      @click="selectTech(tech)"
    >
      {{ tech }}
    </button>
  </div>
</template>
