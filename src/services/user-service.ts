import api from '@/lib/axios'
import { UserRole } from '@/auth/types'

// ============== Interfaces ==============

/**
 * User profile information
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  sasUrl: string | null
  phoneNumber: string
  industry: string
  role: UserRole
}

/**
 * Data needed to update user profile
 */
export interface UpdateProfileDto {
  name: string
  phoneNumber: string
  industry: string
  logoFile?: File | null
  isLogoChanged: boolean
  isLogoDeleted: boolean
}


export interface ChangePasswordDto {
  oldPassword: string
  newPassword: string
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
    formData.append('name', data.name)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('industry', data.industry)
    formData.append('isLogoChanged', String(data.isLogoChanged))
    formData.append('isLogoDeleted', String(data.isLogoDeleted))

    if (data.isLogoChanged && !data.isLogoDeleted && data.logoFile) {
      formData.append('logoUrl', data.logoFile)
    }

    const res = await api.patch('/Account/UpdateProfile', formData)
    return res.data
  },

 

  deleteAccount: async (): Promise<string> => {
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
