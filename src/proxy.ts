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

  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path),
  )

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

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
