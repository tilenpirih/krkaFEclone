import type { ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const defaultTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#35693f',
    secondary: '#35693f',
    background: '#ebefe7',
    surface: '#f7fbf2',
    danger: '#FE4543',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}
if (process.client) {
  const localTheme = JSON.parse(localStorage.getItem('theme') as string)
  if (localTheme && defaultTheme.colors) {
    defaultTheme.dark = localTheme.dark
    defaultTheme.colors.primary = localTheme.primary
    defaultTheme.colors.secondary = localTheme.secondary
    defaultTheme.colors.background = localTheme.background
    defaultTheme.colors.surface = localTheme.surface
    if (localTheme.danger)
      defaultTheme.colors.danger = localTheme.danger
    if (localTheme.error)
      defaultTheme.colors.error = localTheme.error
    if (localTheme.info)
      defaultTheme.colors.info = localTheme.info
    if (localTheme.success)
      defaultTheme.colors.success = localTheme.success
    if (localTheme.warning)
      defaultTheme.colors.warning = localTheme.warning
  }
}
export default defineNuxtPlugin(app => {
  const vuetify = createVuetify({
    components: {
      ssr: true,
      VNumberInput,
    },
    theme: {
      defaultTheme: 'defaultTheme',
      themes: {
        defaultTheme,
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    defaults: {
      VBtn: {
        color: 'primary',
        class: 'text-none',
      },
      VAutocomplete: {
        color: 'primary',
        variant: 'outlined',
      },
      VSelect: {
        color: 'primary',
        variant: 'outlined',
      },
      VTextField: {
        color: 'primary',
        variant: 'outlined',
      },
      VSlider: {
        color: 'primary',
      },
      VFileInput: {
        color: 'primary',
        variant: 'outlined',
      },
      VCheckbox: {
        color: 'primary',
      },
    },
  })

  app.vueApp.use(vuetify)
})