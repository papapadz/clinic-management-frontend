import { defineStore } from 'pinia'
import type { AuthUser, AuthTokenResponse } from '~/types'

type NameLike = string | { name?: unknown }

interface State {
  user: AuthUser | null
  token: string | null
  expires_at: string | null
  loading: boolean
}

function normalizeNameList(preferred: unknown, fallback: unknown): string[] {
  const source = Array.isArray(preferred) ? preferred : fallback

  if (!Array.isArray(source)) {
    return []
  }

  return source
    .map((item: NameLike) => {
      if (typeof item === 'string') {
        return item
      }

      return typeof item.name === 'string' ? item.name : ''
    })
    .map((name) => name.trim())
    .filter(Boolean)
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    token: null,
    expires_at: null,
    loading: false,
  }),
  actions: {
    setAuth(payload: AuthTokenResponse) {
      const roles = normalizeNameList(payload.roles, payload.user.roles)
      const permissions = normalizeNameList(payload.permissions, payload.user.permissions)

      this.user = {
        ...payload.user,
        roles,
        permissions,
      }
      this.token = payload.token
      this.expires_at = payload.expires_at
    },
    clearAuth() {
      this.user = null
      this.token = null
      this.expires_at = null
    },
  },
  persist: true,
})
