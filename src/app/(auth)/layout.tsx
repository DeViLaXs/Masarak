'use client'
import { useAuth } from '@/auth/use-auth'
import AuthNavBar from './_components/auth-navbar'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated } = useAuth({ middleware: 'guest' })

  // Only block if user is confirmed authenticated (not during loading)
  if (!isLoading && isAuthenticated) {
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
