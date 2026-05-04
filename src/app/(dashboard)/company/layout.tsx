'use client'

import React from 'react'
import { AppSidebar } from '@/app/(dashboard)/company/_components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/auth/use-auth'
import DashboardNavbar from '@/components/dashboard-navbar'
import { MobileRestriction } from '@/components/mobile-restriction'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, role, user } = useAuth({ middleware: 'company' })

  // Show nothing while checking auth (proxy handles initial redirect) or if pending approval/suspended/blocked
  if (
    isLoading ||
    role !== 'Company' ||
    user?.status === 'PendingApproval' ||
    user?.status === 'Suspended' ||
    user?.status === 'Blocked' ||
    user?.status === 'Rejected'
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
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
