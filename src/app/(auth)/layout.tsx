import AuthNavBar from './_components/auth-navbar'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-svh w-full flex-col">
      <AuthNavBar/>
      {children}
    </div>
  )
}
