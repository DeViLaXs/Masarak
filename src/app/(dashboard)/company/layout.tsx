'use client'

import { AppSidebar } from '@/app/(dashboard)/company/_components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import NavBar from '@/components/navbar'
import { useAuth } from '@/auth/use-auth'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, role } = useAuth({ middleware: 'company' })

  // Show nothing while checking auth (proxy handles initial redirect)
  if (isLoading || role !== 'Company') {
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
        <NavBar />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
