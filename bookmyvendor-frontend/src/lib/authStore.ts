import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse } from '../services/authService'

type User = AuthResponse['user']

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (auth: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (auth) => {
        localStorage.setItem('bmv_access_token', auth.accessToken)
        set({
          user: auth.user,
          accessToken: auth.accessToken,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('bmv_access_token')
        localStorage.removeItem('bmv_user')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'bmv_auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
)
