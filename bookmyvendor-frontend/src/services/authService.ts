import api from './api'

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: {
    id: string
    email: string | null
    phone: string | null
    fullName: string
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN'
    emailVerified: boolean
    phoneVerified: boolean
    profileComplete: boolean
  }
}

export const authService = {
  // Email/password register
  register: async (data: {
    email?: string
    phone?: string
    password: string
    role: 'CUSTOMER' | 'VENDOR'
    fullName: string
    category?: string
    city?: string
  }): Promise<AuthResponse> => {
    const res = await api.post('/api/v1/auth/register', data)
    return res.data.data
  },

  // Email/password login
  login: async (data: {
    email?: string
    phone?: string
    password: string
  }): Promise<AuthResponse> => {
    const res = await api.post('/api/v1/auth/login', data)
    return res.data.data
  },

  // Send OTP to phone
  sendOtp: async (phone: string): Promise<string> => {
    const res = await api.post('/api/v1/auth/otp/send', { phone })
    return res.data.message
  },

  // Verify OTP and login
  verifyOtp: async (phone: string, otp: string): Promise<AuthResponse> => {
    const res = await api.post('/api/v1/auth/otp/verify', { phone, otp })
    return res.data.data
  },

  // Google OAuth login
  googleLogin: async (data: {
    googleId: string
    email: string
    name: string
    picture?: string
  }): Promise<AuthResponse> => {
    const res = await api.post('/api/v1/auth/google', data)
    return res.data.data
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<string> => {
    const res = await api.post('/api/v1/auth/forgot-password', { email })
    return res.data.message
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<string> => {
    const res = await api.post('/api/v1/auth/reset-password', { token, newPassword })
    return res.data.message
  },
}
