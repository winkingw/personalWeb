<script setup lang="ts">
const props = defineProps<{
  text: string
}>()

const characters = computed(() => Array.from(props.text))

const scatter = [
  { x: -1.5, y: -3, r: -5 },
  { x: 1, y: 2, r: 4 },
  { x: -0.5, y: 3, r: -3 },
  { x: 1.5, y: -2, r: 5 },
  { x: 0, y: -3, r: -2 },
]

function characterStyle(index: number) {
  const item = scatter[index % scatter.length]!
  return {
    '--i': index,
    '--x': `${item.x}px`,
    '--y': `${item.y}px`,
    '--r': `${item.r}deg`,
  }
}
</script>

<template>
  <span class="kinetic-text" :aria-label="text">
    <span
      v-for="(character, index) in characters"
      :key="`${character}-${index}`"
      aria-hidden="true"
      :style="characterStyle(index)"
    >
      {{ character === ' ' ? '\u00A0' : character }}
    </span>
  </span>
</template>
