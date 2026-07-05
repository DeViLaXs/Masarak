'use client'

import React, { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { motion } from 'framer-motion'
import { Search, X, FileText, CheckCircle2, XCircle, Undo2, UserX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox'
import {
  useEmploymentRecordsFilters,
  useEmploymentRecords,
  useEmploymentRecordsStatistics,
} from '@/hooks/use-applications'
import { JobHistoryTable } from './_components/job-history-table'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
} as const

const statusTranslations: Record<string, string> = {
  PendingReview: 'قيد الانتظار',
  Shortlisted: 'انتظار المقابلة',
  Rejected: 'مرفوض',
  Hired: 'تم التوظيف',
  Withdrawn: 'انسحب',
  Interview: 'مقابلة',
  MissingInterview: 'لم يحضر المقابلة',
  Interviewed: 'تمت المقابلة',
}

export default function JobHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [applicationStatusId, setApplicationStatusId] = useState<
    number | undefined
  >()
  const [jobId, setJobId] = useState<number | undefined>()
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<any[]>([])

  const { data: filtersData } = useEmploymentRecordsFilters()
  const { data: listData, isPending: loading } = useEmploymentRecords({
    search: debouncedSearch || undefined,
    applicationStatusId,
    jobId,
    page,
    pageSize: 10,
  })
  const { data: statsData, isPending: statsPending } = useEmploymentRecordsStatistics()

  const data = listData?.items || []
  const totalPages = listData?.totalPages || 1
  const filters = filtersData || null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-6 py-1 max-sm:px-4 pb-8 space-y-4"
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
                  <Skeleton className="size-12 rounded-2xl md:hidden lg:block" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1" dir="rtl">
            {[
              {
                title: 'إجمالي السجلات',
                value: statsData?.totalRecords ?? 0,
                icon: FileText,
                colorClass: 'text-blue-500',
                bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
                borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
                gradientClass: 'from-blue-500/5 to-transparent',
                description: 'إجمالي السجلات التاريخية',
              },
              {
                title: 'تم التوظيف',
                value: statsData?.hiredRecords ?? 0,
                icon: CheckCircle2,
                colorClass: 'text-emerald-500',
                bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
                borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
                gradientClass: 'from-emerald-500/5 to-transparent',
                description: 'مرشحين تم توظيفهم',
              },
              {
                title: 'المرفوض',
                value: statsData?.rejectedRecords ?? 0,
                icon: XCircle,
                colorClass: 'text-red-500',
                bgColorClass: 'bg-red-500/10 dark:bg-red-500/25',
                borderColorClass: 'hover:border-red-300 dark:hover:border-red-950',
                gradientClass: 'from-red-500/5 to-transparent',
                description: 'طلبات توظيف تم رفضها',
              },
              {
                title: 'منسحب',
                value: statsData?.withdrawnRecords ?? 0,
                icon: Undo2,
                colorClass: 'text-purple-500',
                bgColorClass: 'bg-purple-500/10 dark:bg-purple-500/25',
                borderColorClass: 'hover:border-purple-300 dark:hover:border-purple-950',
                gradientClass: 'from-purple-500/5 to-transparent',
                description: 'مرشحين انسحبوا من العملية',
              },
              {
                title: 'لم يحضر المقابلة',
                value: statsData?.missingInterviewRecords ?? 0,
                icon: UserX,
                colorClass: 'text-amber-500',
                bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
                borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
                gradientClass: 'from-amber-500/5 to-transparent',
                description: 'مرشحين لم يحضروا المقابلات',
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
                    <div className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 md:hidden lg:flex ${card.bgColorClass}`}>
                      <Icon className={`size-6 ${card.colorClass}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/50 mb-3 p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full flex-1 flex-col items-center gap-4 md:flex-row">
              <div className="relative w-full md:w-80">
                <Search className="text-muted-foreground absolute top-2.5 right-3 h-5 w-5" />
                <Input
                  placeholder="ابحث بالاسم أو الوظيفة..."
                  className="bg-background h-10 rounded-lg pr-10 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                />
              </div>

              <div className="bg-background dark:bg-input/30 border-input focus-within:ring-primary/20 focus-within:border-primary flex h-10 w-full items-center overflow-hidden rounded-lg border shadow-sm transition-all focus-within:ring-2 md:w-[200px]">
                <Combobox
                  value={
                    applicationStatusId === undefined
                      ? { id: 0, name: 'جميع الحالات' }
                      : filters?.statuses.find(
                          (status) => status.id === applicationStatusId,
                        ) || null
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
                    return statusTranslations[item.name] || item.name
                  }}
                >
                  <ComboboxInput
                    placeholder="جميع الحالات"
                    className="bg-transparent h-full w-full cursor-pointer border-none px-3 text-sm focus:ring-0"
                    readOnly
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 0, name: 'جميع الحالات' }}>
                        جميع الحالات
                      </ComboboxItem>
                      {filters?.statuses.map((status) => (
                        <ComboboxItem key={status.id} value={status}>
                          {statusTranslations[status.name] || status.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div className="bg-background dark:bg-input/30 border-input focus-within:ring-primary/20 focus-within:border-primary flex h-10 w-full items-center overflow-hidden rounded-lg border shadow-sm transition-all focus-within:ring-2 md:w-[200px]">
                <Combobox
                  value={
                    jobId === undefined
                      ? { id: 0, name: 'جميع الوظائف' }
                      : filters?.jobs.find((job) => job.id === jobId) || null
                  }
                  onValueChange={(val: any) => {
                    setPage(1)
                    if (!val || val.id === 0) setJobId(undefined)
                    else setJobId(val.id)
                  }}
                  filter={null}
                  itemToStringLabel={(item: any) => (item ? item.name : '')}
                >
                  <ComboboxInput
                    placeholder="جميع الوظائف"
                    className="bg-transparent h-full w-full cursor-pointer border-none px-3 text-sm focus:ring-0"
                    readOnly
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 0, name: 'جميع الوظائف' }}>
                        جميع الوظائف
                      </ComboboxItem>
                      {filters?.jobs.map((job) => (
                        <ComboboxItem key={job.id} value={job}>
                          {job.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {sorting.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSorting([])}
                  className="h-10 shrink-0 whitespace-nowrap px-2 text-xs text-red-600 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="ml-1 h-3 w-3" />
                  مسح الفرز
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="border-border/40 dark:bg-card overflow-hidden rounded-3xl border bg-white shadow-sm">
          <JobHistoryTable
            data={data}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalCount={listData?.totalCount || 0}
            pageSize={10}
            setPage={setPage}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
