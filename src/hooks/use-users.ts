import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user-service'

export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

/**
 * Hook to fetch the current user's profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/* 
  How to add new hooks:
  1. Add a new key to the userKeys object.
  2. Create a new hook function.
  3. Use useQuery for GET requests and useMutation for POST/PUT/DELETE requests.
  
  Example:
  export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: UpdateProfileDto) => userService.updateProfile(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: userKeys.profile() })
      },
    })
  }
*/
