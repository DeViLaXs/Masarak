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

  // Show loading only while checking auth, then redirect if authenticated
  // For unauthenticated users: isLoading becomes false quickly after 401 response
  // For authenticated users: stays in loading until redirect happens
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  // If authenticated (and not loading), show loading while redirect is happening
  if (isAuthenticated) {
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
