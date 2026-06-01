'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { applicationKeys, useApplications, useApplicationFilters, useRejectCandidate, useHireCandidate, useApplicationStatistics } from '@/hooks/use-applications'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { Search, X, FileText, Clock, UserRoundPlus, CheckCircle2, CalendarDays } from 'lucide-react'
import { ScheduleRescheduleDialog } from '@/components/interview-dialog'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import { JobOrderTable } from './_components/job-order-table'
import { motion } from 'framer-motion'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        }
    }
} as const

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
} as const

export default function ApplicationsPage() {
  const queryClient = useQueryClient()

  // State for search
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)

  // Filters state
  const [applicationStatusId, setApplicationStatusId] = useState<number | undefined>()
  const [jobId, setJobId] = useState<number | undefined>()

  // Pagination state
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<number | undefined>()

  // Sorting state
  const [sorting, setSorting] = useState<any[]>([])

  // Queries
  const { data: filtersData } = useApplicationFilters()
  const { data: listData, isPending: loading } = useApplications({
    search: debouncedSearch || undefined,
    applicationStatusId,
    page,
    pageSize,
    jobId,
  })
  const { data: statsData, isPending: statsPending } = useApplicationStatistics()

  // Mutations
  const { mutateAsync: rejectCandidate } = useRejectCandidate()
  const { mutateAsync: hireCandidate } = useHireCandidate()

  const data = listData?.items || []
  const totalPages = listData?.totalPages || 1
  const filters = filtersData || null

  const handleReject = async (id: number) => {
    try {
      await rejectCandidate(id)
      toast.success('تم رفض الطلب بنجاح')
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في رفض الطلب')
    }
  }

  const handleHire = async (id: number) => {
    try {
      await hireCandidate(id)
      toast.success('تم توظيف المرشح بنجاح')
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في توظيف المرشح')
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-7xl space-y-4 px-6"
      dir="rtl"
    >

      {/* Stats Cards Section */}
      <motion.div variants={itemVariants}>
        {statsPending ? (
          <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1" dir="rtl">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="relative overflow-hidden border-border/40 bg-white shadow-sm dark:bg-card">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24 rounded-full" />
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-3 w-28 rounded-full" />
                  </div>
                  <Skeleton className="size-12 rounded-2xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1" dir="rtl">
            {[
              {
                title: 'إجمالي الطلبات',
                value: statsData?.totalApplications ?? 0,
                icon: FileText,
                colorClass: 'text-blue-500',
                bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
                borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
                gradientClass: 'from-blue-500/5 to-transparent',
                description: 'طلبات التوظيف النشطة',
              },
              {
                title: 'قيد الانتظار',
                value: statsData?.pendingReviewApplications ?? 0,
                icon: Clock,
                colorClass: 'text-amber-500',
                bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
                borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
                gradientClass: 'from-amber-500/5 to-transparent',
                description: 'طلبات جديدة تحتاج لمراجعة',
              },
              {
                title: 'بانتظار المقابلة',
                value: statsData?.shortlistedApplications ?? 0,
                icon: UserRoundPlus,
                colorClass: 'text-emerald-500',
                bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
                borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
                gradientClass: 'from-emerald-500/5 to-transparent',
                description: 'مرشحين تم اختيارهم للمقابلة',
              },
              {
                title: 'تمت المقابلة',
                value: statsData?.interviewedApplications ?? 0,
                icon: CheckCircle2,
                colorClass: 'text-purple-500',
                bgColorClass: 'bg-purple-500/10 dark:bg-purple-500/25',
                borderColorClass: 'hover:border-purple-300 dark:hover:border-purple-950',
                gradientClass: 'from-purple-500/5 to-transparent',
                description: 'مرشحين تم إجراء مقابلة معهم',
              },
              {
                title: 'طلبات هذا الأسبوع',
                value: statsData?.applicationsThisWeek ?? 0,
                icon: CalendarDays,
                colorClass: 'text-red-500',
                bgColorClass: 'bg-red-500/10 dark:bg-red-500/25',
                borderColorClass: 'hover:border-red-300 dark:hover:border-red-950',
                gradientClass: 'from-red-500/5 to-transparent',
                description: 'طلبات جديدة هذا الأسبوع',
              },
            ].map((card, idx) => {
              const Icon = card.icon
              return (
                <Card
                  key={idx}
                  className={`group relative overflow-hidden border-border/40 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-card ${card.borderColorClass}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <CardHeader className="relative z-10 pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold max-sm:text-[11px] text-nowrap">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex items-center justify-between pt-2">
                    <div className="space-y-1 flex-1">
                      <span className={`text-3xl font-extrabold tracking-tight ${card.colorClass}`}>
                        {card.value}
                      </span>
                      <p className="text-muted-foreground text-[10px] font-normal leading-none text-nowrap">
                        {card.description}
                      </p>
                    </div>
                    <div className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${card.bgColorClass}`}>
                      <Icon className={`size-6 ${card.colorClass}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Header Banner */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md p-5 mb-3">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 flex-col md:flex-row w-full gap-4 items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو الوظيفة..."
                className="bg-background pr-10 h-10 shadow-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background dark:bg-input/30 border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
              <Combobox
                value={
                  applicationStatusId === undefined
                    ? { id: 0, name: 'جميع الحالات' }
                    : filters?.statuses.find(s => s.id === applicationStatusId) || null
                }
                onValueChange={(val: any) => {
                  setPage(1)
                  if (!val || val.id === 0) setApplicationStatusId(undefined)
                  else setApplicationStatusId(val.id)
                }}
                filter={null}
                itemToStringLabel={(item: any) => {
                  if (!item) return ''
                  if (item.name === 'جميع الحالات') return 'جميع الحالات'
                  const translations: Record<string, string> = {
                    'PendingReview': 'في قيد المراجعة',
                    'Shortlisted': 'في انتظار المقابلة',
                    'Rejected': 'مرفوض',
                    'Hired': 'تم التوظيف',
                    'Withdrawn': 'منسحب',
                    'Interview': 'مقابلة',
                    'MissingInterview': 'لم يحضر المقابلة',
                    'Interviewed': 'تمت المقابلة'
                  }
                  return translations[item.name] || item.name
                }}
              >
                <ComboboxInput
                  placeholder="جميع الحالات"
                  className="bg-transparent w-full border-none focus:ring-0 px-3 text-sm h-full cursor-pointer "
                  readOnly
                />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value={{ id: 0, name: 'جميع الحالات' }}>
                      جميع الحالات
                    </ComboboxItem>
                    {filters?.statuses.map(s => {
                      const translations: Record<string, string> = {
                        'PendingReview': 'في قيد المراجعة',
                        'Shortlisted': 'في انتظار المقابلة',
                        'Rejected': 'مرفوض',
                        'Hired': 'تم التوظيف',
                        'Withdrawn': 'منسحب',
                        'Interview': 'مقابلة',
                        'MissingInterview': 'لم يحضر المقابلة',
                        'Interviewed': 'تمت المقابلة'
                      }
                      return (
                        <ComboboxItem key={s.id} value={s}>
                          {translations[s.name] || s.name}
                        </ComboboxItem>
                      )
                    })}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background dark:bg-input/30 border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
              <Combobox
                value={
                  jobId === undefined
                    ? { id: 0, name: 'جميع الوظائف' }
                    : filters?.jobs.find(j => j.id === jobId) || null
                }
                onValueChange={(val: any) => {
                  setPage(1)
                  if (!val || val.id === 0) setJobId(undefined)
                  else setJobId(val.id)
                }}
                filter={null}
                itemToStringLabel={(item: any) => item ? item.name : ''}
              >
                <ComboboxInput
                  placeholder="جميع الوظائف"
                  className="bg-transparent w-full border-none focus:ring-0 px-3 text-sm h-full cursor-pointer"
                  readOnly
                />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value={{ id: 0, name: 'جميع الوظائف' }}>
                      جميع الوظائف
                    </ComboboxItem>
                    {filters?.jobs.map(j => (
                      <ComboboxItem key={j.id} value={j}>
                        {j.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div> */}

            {sorting.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setSorting([])} className="text-xs text-red-600 hover:text-red-500 hover:bg-red-50 hover:border-red-500 whitespace-nowrap h-10 px-2 shrink-0">
                <X className="w-3 h-3 ml-1" />
                مسح الفرز
              </Button>
            )}
          </div>
        </div>
      </Card>
      </motion.div>

      {/* Jobs Table Card */}
      
      <motion.div variants={itemVariants}>
        <div className="border-border/40 dark:bg-card overflow-hidden rounded-3xl border bg-white shadow-sm">
        <JobOrderTable
          data={data}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalCount={listData?.totalCount || 0}
          pageSize={pageSize}
          setPage={setPage}
          sorting={sorting}
          setSorting={setSorting}
          handleReject={handleReject}
          handleHire={handleHire}
          handleSchedule={(id) => {
            setSelectedAppId(id)
            setDialogOpen(true)
          }}
        />
        </div>
      </motion.div>

      {dialogOpen && (
        <ScheduleRescheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          applicationId={selectedAppId}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: applicationKeys.all })
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
          }}
        />
      )}
    </motion.div>
  )
}
