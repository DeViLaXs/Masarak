'use client'

import { useAuth } from '@/auth/use-auth'
import NavBar from '@/components/navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import LoadingScreen from '@/components/loading-screen'

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

  
  if (!isLoggedOutOptimistic && (isLoading || isAuthenticated) && !isError) {
    return <LoadingScreen />
  }

  return (
    <div className="bg-background relative flex min-h-svh w-full flex-col overflow-x-hidden">
     
      
        {children}
      
    </div>
  )
}
