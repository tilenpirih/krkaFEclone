<script setup lang="ts">
import { mdiThemeLightDark } from '@mdi/js'
import { useTheme } from 'vuetify'
import { useThemeStore } from '~/store/theme'

const defaultTheme = useTheme().themes.value.defaultTheme
const themeStore = useThemeStore()

function switchTheme() {
  if (defaultTheme.dark) {
    defaultTheme.dark = false
    defaultTheme.colors.primary = themeStore.lightTheme.primary
    defaultTheme.colors.secondary = themeStore.lightTheme.secondary
    defaultTheme.colors.surface = themeStore.lightTheme.surface
    defaultTheme.colors.background = themeStore.lightTheme.background
  }
  else {
    defaultTheme.dark = true
    defaultTheme.colors.primary = themeStore.darkTheme.primary
    defaultTheme.colors.secondary = themeStore.darkTheme.secondary
    defaultTheme.colors.surface = themeStore.darkTheme.surface
    defaultTheme.colors.background = themeStore.darkTheme.background
  }

  setThemeToLocalStorage()
}
function setThemeToLocalStorage() {
  const theme = {
    dark: defaultTheme.dark,
    primary: defaultTheme.colors.primary,
    secondary: defaultTheme.colors.secondary,
    surface: defaultTheme.colors.surface,
    background: defaultTheme.colors.background,
  }
  localStorage.setItem('theme', JSON.stringify(theme))
}
</script>

<template>
  <v-btn variant="tonal" color="primary" class="mr-2" :icon="mdiThemeLightDark" @click="switchTheme()" />
</template>

<style scoped lang="scss">

</style>
