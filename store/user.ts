import { axios } from '~/composables/useApiFetch'
import { useSnackbarStore } from '@/store/snackbar'

export interface User {
  id: number
  username: string
  is_admin: boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isLoggedIn: false,
    snackbarStore: useSnackbarStore(),
  }),
  actions: {
    async login(username: string, password: string) {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      const response: any = await axios('/auth/token', {
        method: 'POST',
        data: formData,
      })
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token)
        await this.fetchUser()
      }
      else {
        this.snackbarStore.showSnackbar('Napačno uporabniško ime ali geslo', 3000, 'error')
      }

      return response
    },
    async fetchUser() {
      const response = await axios('/auth') as any
      if (response.status === 200) {
        this.user = response.data.user
        this.isLoggedIn = true
      }
    },
    logout() {
      localStorage.removeItem('access_token')
      this.user = null
      this.isLoggedIn = false
    },
    async getUsers() {
      const response = await axios('/auth/user') as User[]
      return response
    },

    async addUser(payload: { username: string, password: string }) {
      const response = await axios('/auth/user', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return response
    },
    async deleteUser(id: number) {
      const response = await axios(`/auth/user/${id}`, {
        method: 'DELETE',
      })
      return response
    },
  },
})
