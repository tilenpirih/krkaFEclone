import { useUserStore } from '~/store/user'

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn)
    await userStore.fetchUser()
})
