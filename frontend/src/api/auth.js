import client from './client'

export const login = (email, password, otp = '') =>
  client.post('/login', { email, password, otp })

export const logout = () => client.post('/logout')

export const me = () => client.get('/me')
