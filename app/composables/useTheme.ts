export function useTheme() {
  const { $colorMode: colorMode } = useNuxtApp()

  const isDark = computed(() => colorMode.value === 'dark')

  function setTheme(theme: 'light' | 'dark') {
    colorMode.preference = theme
  }

  function toggle() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    colorMode: computed(() => colorMode.value),
    isDark,
    setTheme,
    toggle,
  }
}
