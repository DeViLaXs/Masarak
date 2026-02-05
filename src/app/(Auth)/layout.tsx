import AuthNavBar from './_components/auth-navbar'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-background flex min-h-svh flex-col w-full'>
      <AuthNavBar />
      {children}
    </div>
  )
}
