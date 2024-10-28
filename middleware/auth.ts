import { useUserStore } from '@/store/user'

export default defineNuxtRouteMiddleware(() => {
  if (process.server)
    return
  const user = useUserStore()
  if (!user.isLoggedIn)
    return navigateTo('/prijava', { replace: true })
})