export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkTheme: {
      primary: '#9bd4a0',
      secondary: '#9bd4a0',
      background: '#1c211c',
      surface: '#101510',
      dark: true,
    },
    lightTheme: {
      primary: '#35693f',
      secondary: '#35693f',
      background: '#ebefe7',
      surface: '#f7fbf2',
      dark: true,
    },
  }),
})
