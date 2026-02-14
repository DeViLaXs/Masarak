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
    return <div>Loading...</div>
  }

  return (
    <div className="px-6 py-1 max-sm:px-4">
      <FeedbackCard />
    </div>
  )
}
