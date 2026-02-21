import api from '@/lib/axios'
import { UserRole } from '@/auth/types'

// ============== Interfaces ==============

/**
 * User profile information
 */
export interface UserProfile {
  id: string
  companyName: string
  email: string
  sasUrl: string
  phoneNumber: string
  industry: string
  role: UserRole
}

/**
 * Data needed to update user profile
 */
export interface UpdateProfileDto {
  companyName: string
  phoneNumber: string
  industry: string
  logoFile?: File | null
}

export interface ChangePasswordDto {
  OldPassword: string
  NewPassword: string
}

// ============== Service ==============

export const userService = {
  /**
   * Get the current user's profile information
   */
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get('/Account/Me')
    return res.data
  },

  /**
   * Update the current user's profile information
   */
  updateProfile: async (data: UpdateProfileDto): Promise<UserProfile> => {
    const formData = new FormData()
    formData.append('CompanyName', data.companyName)
    formData.append('PhoneNumber', data.phoneNumber)
    formData.append('Industry', data.industry)

    if (data.logoFile) {
      formData.append('LogoUrl', data.logoFile)
    }

    const res = await api.patch('/Account/UpdateProfile', formData)
    return res.data
  },

  deleteAccount: async (): Promise<String> => {
    const res = await api.delete('/Account/DeleteAccount')
    return res.data
  },

  /**
   * Change password for logged in user
   */
  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.patch('/Account/ChangePassword', data)
  },

  /* 
    How to add new methods:
    1. Define the DTO (Data Transfer Object) for the request if needed (e.g., CreateUserDto).
    2. Define the Interface for the response if needed.
    3. Add the method to the userService object using 'api' (axios instance).
    
    Example:
    updateProfile: async (data: UpdateProfileDto): Promise<UserProfile> => {
      const res = await api.put('/Account/UpdateProfile', data)
      return res.data
    },
  */
}
