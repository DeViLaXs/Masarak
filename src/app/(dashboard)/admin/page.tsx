'use client'
import HomeCard1 from '@/app/(dashboard)/admin/_components/home-card-1'
import HomeCard2 from '@/app/(dashboard)/admin/_components/home-card-2'
import { useAuth } from '@/auth/use-auth'

export default function AdminPage() {
  const { user, isLoading } = useAuth()

  console.log(user)

  return (
    <div className='px-6 max-sm:px-4 py-1'>
      <HomeCard1 />
      <HomeCard2 />
      {/* <h1>{test.data}</h1> */}
    </div>
  )
}
