import api from '@/lib/axios'
import type {
  LoginResponse,
  RegisterResponse,
  SessionUser,
  VerifyEmailResponse,
} from '@/auth/types'

// ============== DTOs ==============

export type RegisterDto = {
  name: string
  email: string
  phoneNumber: string
  password: string
  passwordConfirmation: string
  industry: string
  logoUrl?: File | null
}

export type RegisterSubAdminDto = {
  name: string
  email: string
  phoneNumber: string
  password: string
  passwordConfirmation: string
}

export type LoginDto = {
  email: string
  password: string
}

export type VerifyOtpDto = {
  email: string
  emailConfirmationCode: string
}

export type ForgetPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  email: string | null
  newPassword: string
  token: string | null
}

// ============== Service ==============

export const authService = {
  /**
   * Register a new company account
   */
  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('password', data.password)
    formData.append('passwordConfirmation', data.passwordConfirmation)
    formData.append('industry', data.industry)

    if (data.logoUrl) {
      formData.append('logoUrl', data.logoUrl)
    }

    const res = await api.post('/Account/Register', formData)
    return res.data
  },

  /**
   * Register a new sub-admin account
   */
  registerSubAdmin: async (
    data: RegisterSubAdminDto,
  ): Promise<RegisterResponse> => {
    const res = await api.post('/Account/Admin/Register', data)
    return res.data
  },

  /**
   * Verify email with OTP code
   */
  verifyOtp: async (data: VerifyOtpDto): Promise<VerifyEmailResponse> => {
    const res = await api.post('/Account/VerifyEmail', data)
    return res.data
  },

  /**
   * Resend OTP code to email
   */
  resendOtp: async (email: string): Promise<void> => {
    await api.post('/Account/ResendOtp', { email: email })
  },

  /**
   * Resend verification link to email
   */
  resendLink: async (email: string): Promise<void> => {
    await api.post('/Account/ResendLink', { email: email })
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const res = await api.post('/Account/Login', data)
    return res.data
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<string> => {
    const res = await api.post('/Account/Logout')
    return res.data
  },

  /**
   * Request password reset email
   */
  forgetPassword: async (data: ForgetPasswordDto): Promise<void> => {
    await api.post('/Account/ForgetPassword', data)
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await api.post('/Account/ResetPassword', data)
  },

  /**
   * Get current user session
   */
  me: async (): Promise<SessionUser> => {
    const res = await api.get('/Account/Me')
    return res.data
  },
}
// This is the last working version
