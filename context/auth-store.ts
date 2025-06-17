import User from '@/core/models/User'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData: User, token: string) => {
        set({ user: userData, token, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return persistedState
        }
        return persistedState
      },
    }
  )
)