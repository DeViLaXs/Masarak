'use client'
import HomeCard1 from '@/app/(dashboard)/admin/_components/home-card-1'
import HomeCard2 from '@/app/(dashboard)/admin/_components/home-card-2'
import { useAuth } from '@/auth/use-auth'

export default function AdminPage() {
  const { user, isLoading } = useAuth({
    middleware: 'admin',
    redirectTo: '/login',
  })

  console.log(user)

  // Don't render page content until auth check is complete
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="px-6 py-1 max-sm:px-4">
      <HomeCard1 />
      <HomeCard2 />
      {/* <h1>{test.data}</h1> */}
    </div>
  )
}
