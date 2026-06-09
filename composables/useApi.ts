import { useNuxtApp } from '#app'

/**
 * Provides typed $api and tenantPath helpers from plugin
 */
export function useApi() {
  const nuxtApp = useNuxtApp()
  return {
    api: nuxtApp.$api,
    tenantPath: nuxtApp.$tenantPath,
  }
}