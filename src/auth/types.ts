/**
 * User roles
 */
export type UserRole = 'Admin' | 'Company'| 'SubAdmin'

/**
 * Middleware types for route protection
 */
export type AuthMiddleware = 'admin' | 'company' | 'guest'

/**
 * Session user data from /Account/Me
 */
export type SessionUser = {
  role: UserRole
}

/**
 * Company login response from /Account/Login
 */
export type LoginResponse = {
  employerId: number
  email: string
  sasUrl?: string
  expiresAt?: string
  role: UserRole
  name: string
}

/**
 * Company registration response from /Account/Register
 */
export type RegisterResponse = {
  employerId: number
  email: string
  sasUrl?: string
  expiresAt?: string
  role: UserRole
  name: string
}

/**
 * Email verification response from /Account/VerifyEmail
 */
export type VerifyEmailResponse = LoginResponse

/**
 * useAuth hook options
 */
export type UseAuthOptions = {
  /** Role-based middleware: 'admin' | 'company' | 'guest' */
  middleware?: AuthMiddleware
  /** Custom redirect path on auth failure */
  redirectTo?: string
}
