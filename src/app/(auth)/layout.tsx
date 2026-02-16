'use client'

import { useAuth } from '@/auth/use-auth'
import AuthNavBar from './_components/auth-navbar'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated, isError } = useAuth({
    middleware: 'guest',
  })

  // 🛡️ Prevent flash: Show spinner while loading session OR if already authenticated
  // But STOP showing it if an error occurs (which means the user is not authenticated)
  if ((isLoading || isAuthenticated) && !isError) {
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
