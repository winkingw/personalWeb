<script setup lang="ts">
const props = defineProps<{
  tags: string[]
}>()

const emit = defineEmits<{
  'update:tag': [tag: string | null]
}>()

const route = useRoute()
const activeTag = ref<string | null>(null)

const activeTagParam = computed(() => {
  const t = route.query.tag
  return typeof t === 'string' ? t : null
})

watch(activeTagParam, (val) => {
  activeTag.value = val || null
}, { immediate: true })

function selectTag(tag: string | null) {
  activeTag.value = tag
  emit('update:tag', tag)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      :class="[
        'text-sm px-3 py-1 rounded-full font-medium transition-colors',
        !activeTag
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      ]"
      @click="selectTag(null)"
    >
      All
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      :class="[
        'text-sm px-3 py-1 rounded-full font-medium transition-colors',
        activeTag === tag
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      ]"
      @click="selectTag(tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>
