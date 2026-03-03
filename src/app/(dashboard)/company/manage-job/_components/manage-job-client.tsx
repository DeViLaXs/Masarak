'use client'

import React, { useState } from 'react'
import { useCompanyJobs, useUpdateJobStatus } from '@/hooks/use-jobs'
import { useDebounce } from 'use-debounce'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import {
  SearchIcon,
  UsersIcon,
  PlusIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManageJobClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [statusTab, setStatusTab] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Fetch jobs
  const { data: jobsData, isPending } = useCompanyJobs({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    status: statusTab !== 'all' ? statusTab : undefined,
  })

  // Mutations
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateJobStatus()

  // Handlers
  const handleStatusChange = (
    id: number,
    newStatus: 'Published' | 'Closed',
  ) => {
    updateStatus({ id, status: newStatus })
  }

  const jobs = jobsData?.items || []
  const totalPages = jobsData?.totalPages || 1

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/20 ring-inset">
            نشطة
          </span>
        )
      case 'Closed':
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-500/20 ring-inset">
            غير نشطة
          </span>
        )
      case 'Expired':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-500/20 ring-inset">
            منتهية
          </span>
        )
      case 'Filled':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-500/20 ring-inset">
            تم التعيين
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
            {status}
          </span>
        )
    }
  }

  const formatJobType = (type: string) => {
    if (type === 'FullTime') return 'دوام كامل'
    if (type === 'PartTime') return 'دوام جزئي'
    if (type === 'Remote') return 'عن بعد'
    if (type === 'Hybrid') return 'هجين'
    return type
  }

  return (
    <div className="mx-auto block max-w-[1200px] space-y-6 pb-20">
      {/* Header section */}
      {/* <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            إدارة الوظائف
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            إدارة وتتبع جميع الوظائف المنشورة
          </p>
        </div>
      </div> */}

      {/* Filters Card */}
      <Card className="border-border/40 rounded-2xl bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
              <div className="relative">
                <select
                  value={statusTab}
                  onChange={(e) => {
                    setStatusTab(e.target.value)
                    setPage(1)
                  }}
                  className="h-10 w-full appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 pr-4 pl-10 text-sm transition-colors outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-40"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="Published">نشطة</option>
                  <option value="Closed">غير نشطة (مغلقة)</option>
                  <option value="Expired">منتهية</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              </div>
              <div className="relative">
                <select
                  value={jobTypeFilter}
                  onChange={(e) => {
                    setJobTypeFilter(e.target.value)
                    setPage(1)
                  }}
                  className="h-10 w-full appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 pr-4 pl-10 text-sm transition-colors outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-40"
                >
                  <option value="all">نوع الدوام</option>
                  <option value="FullTime">دوام كامل</option>
                  <option value="PartTime">دوام جزئي</option>
                  <option value="Remote">عن بعد</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="relative w-full md:max-w-md md:flex-1 xl:max-w-xl">
              <SearchIcon className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="البحث عن وظيفة..."
                className="h-10 w-full rounded-full border-slate-200 bg-slate-50/50 pr-11 pl-4 shadow-none focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="w-full shrink-0 md:w-auto">
              <Button
                asChild
                className="h-10 w-full rounded-xl bg-[#3b82f6] px-6 font-medium text-white shadow-sm hover:bg-blue-600 md:w-auto"
              >
                <a href="/company/add-job">
                  <PlusIcon className="ml-2 size-5" />
                  إضافة وظيفة جديدة
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table Card */}
      <Card className="border-border/40 overflow-hidden rounded-2xl bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-6 pt-6 pb-4">
          <CardTitle className="text-xl font-bold text-slate-800">
            قائمة الوظائف
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#f8fafc] font-medium text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">عنوان الوظيفة</th>
                  <th className="px-6 py-4 text-center font-medium">
                    نوع الدوام
                  </th>
                  <th className="px-6 py-4 text-center font-medium whitespace-nowrap">
                    الراتب
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    تاريخ النشر
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    انتهاء الصلاحية
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    المتقدمين
                  </th>
                  <th className="px-6 py-4 text-center font-medium">الحالة</th>
                  <th className="px-6 py-4 text-center font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isPending ? (
                  <tr>
                    <td colSpan={8} className="h-[300px] p-8 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="mb-4 size-8 animate-spin text-blue-500" />
                        <p>جاري جلب بيانات الوظائف...</p>
                      </div>
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-[300px] p-8 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <BriefcaseIcon className="mb-4 size-12 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-700">
                          لا توجد وظائف
                        </h3>
                        <p className="mt-1 text-sm">
                          لم يتم العثور على أي نتائج مطابقة لبحثك.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      <td className="max-w-[250px] px-6 py-4">
                        <div className="mb-1 truncate text-base font-bold text-slate-900">
                          {job.title}
                        </div>
                        <div
                          className="truncate text-xs text-slate-500"
                          title={job.description}
                        >
                          {job.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {formatJobType(job.jobType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium whitespace-nowrap text-slate-600">
                        {job.minSalary.toLocaleString()} -{' '}
                        {job.maxSalary.toLocaleString()} ريال
                      </td>
                      <td className="px-6 py-4 text-center font-medium whitespace-nowrap text-slate-500">
                        {format(new Date(job.postedDate), 'yyyy-MM-dd')}
                      </td>
                      <td className="px-6 py-4 text-center font-medium whitespace-nowrap text-slate-500">
                        {format(new Date(job.expirationDate), 'yyyy-MM-dd')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="mt-1 flex flex-col items-center justify-center gap-1 text-center font-bold text-slate-700">
                          <UsersIcon className="size-4 text-slate-400" />
                          <span>{job.applicantsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-sm font-semibold opacity-80 transition-opacity group-hover:opacity-100">
                          <a
                            href={`/company/manage-job/${job.id}`}
                            className="text-[#3b82f6] transition-colors hover:text-blue-700 hover:underline"
                          >
                            تعديل
                          </a>
                          {job.status === 'Published' && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(job.id, 'Closed')
                              }
                              className="text-amber-500 transition-colors hover:text-amber-600 hover:underline disabled:opacity-50"
                            >
                              إخفاء
                            </button>
                          )}
                          {(job.status === 'Closed' ||
                            job.status === 'Expired') && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(job.id, 'Published')
                              }
                              className="text-emerald-500 transition-colors hover:text-emerald-600 hover:underline disabled:opacity-50"
                            >
                              تنشيط
                            </button>
                          )}
                          <button
                            className="text-red-500 transition-colors hover:text-red-600 hover:underline disabled:opacity-50"
                            onClick={() =>
                              toast.error('ميزة الحذف غير متوفرة حالياً')
                            }
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isPending}
          >
            السابق
          </Button>
          <div className="flex items-center gap-2 px-4 text-sm font-medium text-slate-500">
            <span>{page}</span>
            <span>من</span>
            <span>{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isPending}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  )
}
