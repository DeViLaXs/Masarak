'use client'
import { useAuth } from '@/auth/use-auth'
import AuthNavBar from './_components/auth-navbar'
import React, { useEffect, useState } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth({ middleware: 'guest' })

  // Check for access_token cookie immediately (client-side only)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const tokenExists = document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('access_token='))
      setHasToken(tokenExists)
    }
  }, [])

  // Show loading if token exists (being verified) OR if authenticated (being redirected)
  if (hasToken || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-svh w-full flex-col">
      <AuthNavBar />
      {children}
    </div>
  )
}
