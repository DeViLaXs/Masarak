'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useJob, useJobApplicants } from '@/hooks/use-jobs'
import { useApplicationFilters } from '@/hooks/use-applications'
import { useDebounce } from 'use-debounce'
import { 
  UsersIcon, 
  ArrowRight, 
  Search, 
  X, 
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import LoadingScreen from '@/components/loading-screen'
import { motion } from 'framer-motion'
import { SortingState } from '@tanstack/react-table'
import { ApplicantsTable } from './_components/applicants-table'

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

const statusTranslations: Record<string, string> = {
  'PendingReview': 'قيد الانتظار',
  'Shortlisted': 'انتظار المقابلة',
  'Rejected': 'مرفوض',
  'Hired': 'تم التوظيف',
  'Withdrawn': 'انسحب',
  'Interview': 'مقابلة',
  'MissingInterview': 'لم يحضر المقابلة',
  'Interviewed': 'تمت المقابلة',
}

export default function JobApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params.id)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [statusId, setStatusId] = useState<number | undefined>()
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: job, isLoading: isJobLoading } = useJob(jobId)
  const { data: filters } = useApplicationFilters()
  const { data: applicantsData, isPending: isApplicantsLoading } = useJobApplicants(jobId, {
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    applicationStatusId: statusId,
  })

  const applicants = applicantsData?.items || []
  const totalPages = applicantsData?.totalPages || 1
  const totalCount = applicantsData?.totalCount || 0
  const pageSize = applicantsData?.pageSize || 10

  if (isJobLoading) {
    return <LoadingScreen message="جاري تحميل تفاصيل الوظيفة..." fullScreen={false} />
  }

  if (!job) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center" dir="rtl">
        <AlertTriangle className="size-16 text-destructive/80 animate-bounce" />
        <h3 className="text-xl font-bold text-foreground">لم يتم العثور على الوظيفة</h3>
        <p className="text-muted-foreground max-w-md">
          قد تكون هذه الوظيفة غير موجودة أو تم حذفها، أو لا تملك الصلاحية الكافية لعرضها.
        </p>
        <Button onClick={() => router.push('/company/manage-job')} variant="default" className="mt-2">
          العودة لإدارة الوظائف
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-6 py-1 max-sm:px-4 pb-8 space-y-4"
      dir="rtl"
    >
      {/* Header Banner Section */}
      <motion.div variants={itemVariants}>
        <div className="border-border/40 from-primary/10 via-background to-background dark:from-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-l p-6 shadow-sm">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-12 items-center justify-center rounded-xl ring-1">
                <UsersIcon className="size-6" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl font-extrabold tracking-tight">المتقدمين للوظيفة</h1>
                <p className="text-muted-foreground mt-1 text-sm">{job.title}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push('/company/manage-job')}
              className="text-muted-foreground hover:text-primary hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 w-fit self-end sm:self-auto rounded-full"
            >
              <ArrowRight className="ml-2 size-4" />
              العودة للوظائف
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 flex-col md:flex-row w-full gap-4 items-center">
              
              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم أو البريد..."
                  className="bg-background pr-10 h-10 shadow-sm rounded-lg"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                />
              </div>

              {/* Status Combobox */}
              <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background dark:bg-input/30 border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
                <Combobox
                  value={
                    statusId === undefined
                      ? { id: 0, name: 'جميع الحالات' }
                      : filters?.statuses.find(s => s.id === statusId) || null
                  }
                  onValueChange={(val: any) => {
                    setPage(1)
                    if (!val || val.id === 0) setStatusId(undefined)
                    else setStatusId(val.id)
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
                    className="bg-transparent w-full border-none focus:ring-0 px-3 text-sm h-full cursor-pointer"
                    readOnly
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 0, name: 'جميع الحالات' }}>
                        جميع الحالات
                      </ComboboxItem>
                      {filters?.statuses.map(s => (
                        <ComboboxItem key={s.id} value={s}>
                          {statusTranslations[s.name] || s.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Clear Sorting Button */}
              {sorting.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSorting([])} 
                  className="text-xs text-red-600 hover:text-red-500 hover:bg-red-50 hover:border-red-500 whitespace-nowrap h-10 px-2 shrink-0"
                >
                  <X className="w-3 h-3 ml-1" />
                  مسح الفرز
                </Button>
              )}

            </div>
          </div>
        </Card>
      </motion.div>

      {/* Applicants Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 dark:bg-card overflow-hidden rounded-3xl border bg-white shadow-sm">
          <ApplicantsTable
            data={applicants}
            loading={isApplicantsLoading}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </motion.div>
    </motion.div>
  )
}
