import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const tenantSlug = to.params.tenant as string | undefined
  if (!tenantSlug) {
    return navigateTo('/login')
  }
  // Optionally: fetch tenant info if not loaded
})
