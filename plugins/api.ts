import type { ApiResponse } from '~/types'

/**
 * API client plugin — provides $api helper using $fetch
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  /**
   * Typed API fetcher
   */
  async function api<T = unknown>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    const baseUrl = config.public.apiBaseUrl

    try {
      const response = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers as Record<string, string> | undefined),
        },
      })
      return response
    } catch (error: unknown) {
      // Extract structured error from Laravel validation / API errors
      const err = error as { data?: ApiResponse<T>; status?: number }
      if (err?.data) {
        return err.data
      }
      throw error
    }
  }

  /**
   * Build tenant-scoped API path
   */
  function tenantPath(path: string): string {
    const tenant = tenantStore.currentTenant?.slug ?? config.public.defaultTenant
    return `/api/v1/${tenant}${path}`
  }

  return {
    provide: {
      api,
      tenantPath,
    },
  }
})
