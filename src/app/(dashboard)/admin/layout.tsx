'use client'

import { AppSidebar } from './_components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/auth/use-auth'
import DashboardNavbar from '@/components/dashboard-navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, role } = useAuth({ middleware: 'admin' })

  // Show nothing while checking auth (proxy handles initial redirect)
  if (isLoading || role !== 'Admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
