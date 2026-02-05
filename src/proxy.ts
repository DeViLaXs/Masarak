import { NextResponse, type NextRequest } from 'next/server'

/**
 * Protected routes that require authentication
 */
const protectedPaths = ['/admin', '/company']

/**
 * Auth pages that should redirect authenticated users to dashboard
 */
const authPaths = [
  '/login',
  '/register',
  '/otp',
  '/forget-password',
  '/new-password',
  '/check-email',
]

/**
 * Optimistic cookie-only checks for route protection.
 * No backend calls - just checks if access_token cookie exists.
 * Session validation happens client-side via useAuth hook.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('access_token')

  // Check if current path is protected
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path),
  )

  // Check if current path is an auth page
  const isAuthPage = authPaths.some((path) => pathname === path)

  // Protected routes → redirect to login if no cookie
  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Auth pages → redirect to dashboard if has cookie
  if (isAuthPage && hasToken) {
    // Default to company dashboard, useAuth will handle role-based redirect
    return NextResponse.redirect(new URL('/company', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/company/:path*',
    '/login',
    '/register',
    '/otp',
    '/forget-password',
    '/new-password',
    '/check-email',
  ],
}
