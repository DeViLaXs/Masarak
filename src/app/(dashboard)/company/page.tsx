'use client'
import React from 'react'
import FeedbackCard from './_components/home-card'
import { useAuth } from '@/auth/use-auth'

export default function CompanyPage() {
  const { user, isLoading } = useAuth({
    middleware: 'company',
    redirectTo: '/login',
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="px-6 py-1 max-sm:px-4">
      <FeedbackCard />
    </div>
  )
}
