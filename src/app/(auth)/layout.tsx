'use client'

import { useAuth } from '@/auth/use-auth'
import AuthNavBar from './_components/auth-navbar'
import React, { useEffect, useState } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated, isError } = useAuth({
    middleware: 'guest',
  })
  const [isLoggedOutOptimistic, setIsLoggedOutOptimistic] = useState(false)

  useEffect(() => {
    // Check if we are optimistically logged out
    if (typeof document !== 'undefined') {
      const isLoggedInCookie = document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('is_logged_in='))
      if (!isLoggedInCookie) {
        setIsLoggedOutOptimistic(true)
      }
    }
  }, [])

  // 🛡️ Prevent flash and loops:
  // 1. If we are optimistically logged out (no is_logged_in cookie), show form immediately
  // 2. Otherwise, if loading or authenticated (and no error yet), show spinner
  if (!isLoggedOutOptimistic && (isLoading || isAuthenticated) && !isError) {
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
