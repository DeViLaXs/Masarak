'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authKeys } from './query-keys'
import { authService } from '@/services/auth-service'
import type { LoginResponse, SessionUser, UseAuthOptions } from './types'
import type {
  ForgetPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from '@/services/auth-service'

/**
 * Unified authentication hook
 *
 * @example
 * ```tsx
 * const { user, isLoading, login, logout } = useAuth({
 *   middleware: 'admin',
 *   redirectTo: '/login'
 * });
 * ```
 */
export function useAuth(options: UseAuthOptions = {}) {
  const { middleware, redirectTo } = options
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch current user session
  const {
    data: user,
    isLoading: isSessionLoading,
    isError: isSessionError,
    error: sessionError,
  } = useQuery<SessionUser>({
    queryKey: authKeys.me(),
    queryFn: authService.me,
    retry: 0, // 🛡️ Absolute no retry for session check
    refetchOnWindowFocus: false,
    refetchOnMount: false, // 🛡️ Prevent loops on remount
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const role = user?.role ?? null
  const isAuthenticated = !!user && !isSessionError

  // Handle middleware-based redirects
  useEffect(() => {
    if (isSessionLoading) return

    const handleRedirect = () => {
      // If session error (401/403), user is not authenticated
      if (isSessionError) {
        // Clear is_logged_in cookie if it exists
        if (typeof document !== 'undefined') {
          document.cookie =
            'is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }

        // Protected routes should redirect to login
        if (middleware === 'admin' || middleware === 'company') {
          router.replace(redirectTo ?? '/login')
        }
        return
      }

      // User is authenticated
      if (isAuthenticated) {
        // Guest middleware means redirect authenticated users away
        if (middleware === 'guest') {
          const destination = role === 'Admin' ? '/admin' : '/company'
          router.replace(destination)
          return
        }

        // Check role-based access - redirect back to own dashboard
        if (middleware === 'admin' && role !== 'Admin') {
          router.replace('/company')
          return
        }

        if (middleware === 'company' && role !== 'Company') {
          router.replace('/admin')
          return
        }
      }
    }

    handleRedirect()
  }, [
    isSessionLoading,
    isSessionError,
    isAuthenticated,
    middleware,
    role,
    router,
    redirectTo,
  ])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: async () => {
      // Set a non-HttpOnly cookie for optimistic frontend checks
      if (typeof document !== 'undefined') {
        document.cookie = `is_logged_in=true; path=/; max-age=${30 * 24 * 60 * 60}; samesite=lax`
      }

      // Refetch user data and wait for it
      const userData = await queryClient.fetchQuery<SessionUser>({
        queryKey: authKeys.me(),
        queryFn: authService.me,
      })

      // Redirect based on role
      if (userData?.role === 'Admin') {
        router.push('/admin')
      } else if (userData?.role === 'Company') {
        router.push('/company')
      }
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
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

      router.replace('/')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
  })

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpDto) => authService.verifyOtp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })

  // Forget password mutation
  const forgetPasswordMutation = useMutation({
    mutationFn: (data: ForgetPasswordDto) => authService.forgetPassword(data),
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
  })

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: (email: string) => authService.resendOtp(email),
  })

  // Resend verification link mutation
  const resendLinkMutation = useMutation({
    mutationFn: (email: string) => authService.resendLink(email),
  })

  return {
    // State
    user,
    role,
    isLoading: isSessionLoading,
    isAuthenticated,
    isError: isSessionError,
    error: sessionError,

    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    verifyOtp: verifyOtpMutation.mutate,
    verifyOtpAsync: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,
    verifyOtpError: verifyOtpMutation.error,

    forgetPassword: forgetPasswordMutation.mutate,
    forgetPasswordAsync: forgetPasswordMutation.mutateAsync,
    isRequestingReset: forgetPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,

    resendOtp: resendOtpMutation.mutate,
    resendOtpAsync: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,

    resendLink: resendLinkMutation.mutate,
    resendLinkAsync: resendLinkMutation.mutateAsync,
    isResendingLink: resendLinkMutation.isPending,
  }
}
