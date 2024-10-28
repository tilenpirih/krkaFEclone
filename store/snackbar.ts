export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    open: false,
    message: '',
    timeout: 3000,
    color: 'error',
  }),
  actions: {
    showSnackbar(message: string, timeout: number = 3000, color: string = 'success') {
      this.open = true
      this.message = message
      this.timeout = timeout
      this.color = color
    },
  },
})
