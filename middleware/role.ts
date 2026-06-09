import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

/**
 * Usage: define in page meta: { middleware: ['role:admin'] }
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const requiredRole = to.meta?.role as string | undefined
  if (requiredRole && !auth.user?.roles?.includes(requiredRole)) {
    return navigateTo('/unauthorized')
  }
})