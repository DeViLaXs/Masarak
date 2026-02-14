// import { NextResponse, type NextRequest } from 'next/server'
// import { cookies } from 'next/headers'

// /**
//  * Protected routes that require authentication
//  */
// const protectedPaths = ['/admin', '/company']

// /**
//  * Auth pages that should redirect authenticated users to dashboard
//  */
// const authPaths = [
//   '/login',
//   '/register',
//   '/otp',
//   '/forget-password',
//   '/new-password',
//   '/check-email',
// ]

// /**
//  * Optimistic cookie-only checks for route protection.
//  * No backend calls - just checks if access_token cookie exists.
//  * Session validation happens client-side via useAuth hook.
//  */
// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Try getting cookies from header and request
//   const cookieStore = await cookies()
//   const hasAccessTokenInStore = cookieStore.has('access_token')
//   const hasAccessTokenInRequest = request.cookies.has('access_token')

//   const hasToken = hasAccessTokenInStore || hasAccessTokenInRequest

//   // Check if current path is protected
//   const isProtectedRoute = protectedPaths.some((path) =>
//     pathname.startsWith(path),
//   )

//   // Check if current path is an auth page
//   const isAuthPage = authPaths.some((path) => pathname === path)

//   // Protected routes → redirect to login if no cookie
//   if (isProtectedRoute && !hasToken) {
//     const loginUrl = new URL('/login', request.url)
//     loginUrl.searchParams.set('callbackUrl', pathname)
//     return NextResponse.redirect(loginUrl)
//   }

//   // Role-based cross-dashboard protection (immediate redirect)
//   const userRole =
//     cookieStore.get('user_role')?.value ||
//     request.cookies.get('user_role')?.value

//   if (userRole) {
//     if (pathname.startsWith('/company') && userRole === 'Admin') {
//       return NextResponse.redirect(new URL('/admin', request.url))
//     }
//     if (pathname.startsWith('/admin') && userRole === 'Company') {
//       return NextResponse.redirect(new URL('/company', request.url))
//     }
//   }

//   // Auth pages → redirect to dashboard if has cookie
//   if (isAuthPage && hasToken) {
//     if (userRole === 'Admin') {
//       return NextResponse.redirect(new URL('/admin', request.url))
//     }

//     // Default to company dashboard
//     return NextResponse.redirect(new URL('/company', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/admin/:path*',
//     '/company/:path*',
//     '/login',
//     '/register',
//     '/otp',
//     '/forget-password',
//     '/new-password',
//     '/check-email',
//   ],
// }
import { NextResponse, type NextRequest } from 'next/server'

const protectedPaths = ['/admin', '/company']

const authPaths = [
  '/login',
  '/register',
  '/otp',
  '/forget-password',
  '/new-password',
  '/check-email',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // تحقق فقط من وجود access_token
  const token = request.cookies.get('access_token')?.value
  const hasToken = Boolean(token)
  console.log(hasToken)

  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  const isAuthPage = authPaths.some((path) =>
    pathname.startsWith(path)
  )

  // 🔒 1) منع الدخول للروابط المحمية بدون تسجيل دخول
  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 🚫 2) منع المستخدم المسجل من الرجوع لصفحات تسجيل الدخول
  if (isAuthPage && hasToken) {
    // لا يمكن تحديد role هنا → frontend سيتولى redirect بعد fetch من /auth/me
    return NextResponse.next()
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
