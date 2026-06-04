'use client'

import React from 'react'
import { AppSidebar } from './_components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/auth/use-auth'
import DashboardNavbar from '@/components/dashboard-navbar'
import { MobileRestriction } from '@/components/mobile-restriction'
import LoadingScreen from '@/components/loading-screen'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, role, user } = useAuth({ middleware: 'admin' })

  // Show nothing while checking auth (proxy handles initial redirect)
  if (
    isLoading ||
    (role !== 'Admin' && role !== 'SubAdmin') ||
    (role === 'SubAdmin' &&
      (user?.status === 'Suspended' || user?.status === 'Blocked'))
  ) {
    return <LoadingScreen />
  }

  return (
    <>
      <MobileRestriction />
      <div className="hidden md:block">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="max-h-svh overflow-y-auto">
            <DashboardNavbar />
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  )
}
