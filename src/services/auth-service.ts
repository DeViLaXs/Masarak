import api from '@/lib/axios'
import type {
  LoginResponse,
  RegisterResponse,
  SessionUser,
  VerifyEmailResponse,
} from '@/auth/types'

// ============== DTOs ==============

export type RegisterDto = {
  CompanyName: string
  Email: string
  PhoneNumber: string
  Password: string
  PasswordConfirmation: string
  Industry: string
  LogoUrl?: File | null
}

export type LoginDto = {
  Email: string
  Password: string
}

export type VerifyOtpDto = {
  Email: string
  EmailConfirmationCode: string
}

export type ForgetPasswordDto = {
  Email: string
}

export type ResetPasswordDto = {
  Email: string | null
  NewPassword: string
  Token: string | null
}

// ============== Service ==============

export const authService = {
  /**
   * Register a new company account
   */
  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    const formData = new FormData()
    formData.append('CompanyName', data.CompanyName)
    formData.append('Email', data.Email)
    formData.append('PhoneNumber', data.PhoneNumber)
    formData.append('Password', data.Password)
    formData.append('PasswordConfirmation', data.PasswordConfirmation)
    formData.append('Industry', data.Industry)

    if (data.LogoUrl) {
      formData.append('LogoUrl', data.LogoUrl)
    }

    const res = await api.post('/Account/Register', formData)
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
