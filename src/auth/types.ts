/**
 * User roles
 */
export type UserRole = 'Admin' | 'Company' | 'SubAdmin'

/**
 * Middleware types for route protection
 */
export type AuthMiddleware = 'admin' | 'company' | 'guest'

export type CompanyStatus =
  | 'PendingApproval'
  | 'Active'
  | 'Rejected'
  | 'Suspended'
  | 'Blocked'

/**
 * Session user data from /Account/Me
 */
export type SessionUser = {
  role: UserRole
  name?: string
  status?: CompanyStatus
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
  status?: CompanyStatus
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
  status?: CompanyStatus
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
