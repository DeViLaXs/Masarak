'use client'

import React, { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox'
import {
  useApplicationFilters,
  useEmploymentRecords,
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

  const { data: filtersData } = useApplicationFilters()
  const { data: listData, isPending: loading } = useEmploymentRecords({
    search: debouncedSearch || undefined,
    applicationStatusId,
    jobId,
    page,
    pageSize: 10,
  })

  const data = listData?.items || []
  const totalPages = listData?.totalPages || 1
  const filters = filtersData || null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-7xl space-y-4 px-6"
      dir="rtl"
    >
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

              <div className="bg-background border-input focus-within:ring-primary/20 focus-within:border-primary flex h-10 w-full items-center overflow-hidden rounded-lg border shadow-sm transition-all focus-within:ring-2 md:w-[200px]">
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

              <div className="bg-background border-input focus-within:ring-primary/20 focus-within:border-primary flex h-10 w-full items-center overflow-hidden rounded-lg border shadow-sm transition-all focus-within:ring-2 md:w-[200px]">
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
        <div className="border-border/40 dark:bg-card h-full overflow-hidden rounded-3xl border bg-white shadow-sm">
          <JobHistoryTable
            data={data}
            loading={loading}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
