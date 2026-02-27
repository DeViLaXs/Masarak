import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  userService,
  type UpdateProfileDto,
  type ChangePasswordDto,
} from '@/services/user-service'

export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

/**
 * Unified user hook
 *
 * @example
 * ```tsx
 * const { user, isLoading, deleteAccount, updateProfile } = useUser();
 * ```
 */
export function useUser() {
  const queryClient = useQueryClient()

  // Fetch current user profile
  const {
    data: user,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })


  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: userService.deleteAccount,
    onSuccess: () => {
      // Clear all cached data across the entire application for security
      queryClient.clear()

      // Clear all auth cookies
      if (typeof document !== 'undefined') {
        document.cookie =
          'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie =
          'is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordDto) => userService.changePassword(data),
  })

  return {
    // State
    user,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,

    // Actions
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    deleteAccount: deleteAccountMutation.mutate,
    deleteAccountAsync: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
    deleteAccountError: deleteAccountMutation.error,

    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
  }
}
