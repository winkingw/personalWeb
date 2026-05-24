<script setup lang="ts">
defineProps<{
  label: string
  name: string
  type?: string
  modelValue: string
  error?: string
  required?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div>
    <label
      :for="name"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="name"
      :name="name"
      :type="type || 'text'"
      :value="modelValue"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${name}-error` : undefined"
      class="w-full rounded-lg border px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
      :class="
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-700 focus:ring-blue-600'
      "
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p
      v-if="error"
      :id="`${name}-error`"
      class="mt-1 text-sm text-red-500"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
