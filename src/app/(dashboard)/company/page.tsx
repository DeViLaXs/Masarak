'use client'

import React from 'react'
import FeedbackCard from './_components/home-card'
import { useJobDistribution, useApplicationsTrend } from '@/hooks/use-company'
import { DashboardPieChart, DashboardBarMultipleChart } from '@/components/dashboard-charts'

export default function CompanyPage() {
  const { data: jobDistribution, isLoading: isJobDistributionLoading } = useJobDistribution()
  const { data: applicationsTrend, isLoading: isApplicationsTrendLoading } = useApplicationsTrend('weekly')

  return (
    <div className="px-6 py-1 max-sm:px-4 pb-8">
      <FeedbackCard />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
        <div className="md:col-span-1">
          <DashboardPieChart
            title={jobDistribution?.data?.title ?? 'توزيع الوظائف'}
            description={jobDistribution?.data?.description ?? 'التوزيع الحالي'}
            data={jobDistribution?.data?.items}
            isLoading={isJobDistributionLoading}
          />
        </div>
        <div className="md:col-span-2">
          <DashboardBarMultipleChart
            title={applicationsTrend?.data?.title ?? 'إحصائيات التقديمات'}
            description={applicationsTrend?.data?.description ?? 'آخر 7 أيام'}
            data={applicationsTrend?.data?.items}
            series={applicationsTrend?.data?.series}
            xKey={applicationsTrend?.data?.xKey ?? 'label'}
            isLoading={isApplicationsTrendLoading}
          />
        </div>
      </div>
    </div>
  )
}
