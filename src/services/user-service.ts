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

// ============== Service ==============

export const userService = {
  /**
   * Get the current user's profile information
   */
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get('/Account/Me')
    return res.data
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
