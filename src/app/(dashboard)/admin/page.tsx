'use client'
import HomeCard1 from '@/app/(dashboard)/admin/_components/home-card-1'
import HomeCard2 from '@/app/(dashboard)/admin/_components/home-card-2'
import { useAuth } from '@/auth/use-auth'
import { useAdmin } from '@/hooks/use-admin'
import { DashboardPieChart, DashboardBarMultipleChart } from '@/components/dashboard-charts'

export default function AdminPage() {
  const { user } = useAuth()
  const { useCompanyStatusDistribution, useCompanyRegistrations } = useAdmin()

  const { data: statusResponse, isLoading: isStatusLoading } = useCompanyStatusDistribution()
  const { data: registrationsResponse, isLoading: isRegistrationsLoading } = useCompanyRegistrations('weekly')

  console.log(user)

  return (
    <div className="px-6 py-1 max-sm:px-4 pb-8">
      <HomeCard1 />
      <HomeCard2 />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
        <div className="md:col-span-1">
          <DashboardPieChart
            title={statusResponse?.data?.title ?? 'توزيع حالات الشركة'}
            description={statusResponse?.data?.description ?? 'التوزيع الحالي'}
            data={statusResponse?.data?.items}
            isLoading={isStatusLoading}
          />
        </div>
        <div className="md:col-span-2">
          <DashboardBarMultipleChart
            title={registrationsResponse?.data?.title ?? 'تسجيل الشركات'}
            description={registrationsResponse?.data?.description ?? 'آخر 7 أيام'}
            data={registrationsResponse?.data?.items}
            series={registrationsResponse?.data?.series}
            xKey={registrationsResponse?.data?.xKey ?? 'label'}
            isLoading={isRegistrationsLoading}
          />
        </div>
      </div>
    </div>
  )
}
