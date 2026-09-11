import { createContext, useContext, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ppes_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password, otp = '') => {
    const { data } = await authApi.login(email, password, otp)

    if (data.token) {
      localStorage.setItem('ppes_token', data.token)
      localStorage.setItem('ppes_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    }

    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // token may already be invalid; clear local state regardless
    }
    localStorage.removeItem('ppes_token')
    localStorage.removeItem('ppes_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
