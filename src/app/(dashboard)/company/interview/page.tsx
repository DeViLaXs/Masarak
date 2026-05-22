'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { interviewKeys, useInterviewsList, useInterviewFilters, useCancelInterview, useCompleteInterview, useMissingInterview } from '@/hooks/use-interviews'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { Search, X } from 'lucide-react'
import { ScheduleRescheduleDialog } from '@/components/interview-dialog'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import { InterviewTable } from './_components/interview-table'
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

export default function InterviewsPage() {
  const queryClient = useQueryClient()

  // State for search
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)

  // Filters state
  const [interviewStatusId, setInterviewStatusId] = useState<number | undefined>()
  const [jobId, setJobId] = useState<number | undefined>()

  // Pagination state
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | undefined>()
  const [selectedInterviewData, setSelectedInterviewData] = useState<any>(null)

  // Sorting state
  const [sorting, setSorting] = useState<any[]>([])

  // Queries
  const { data: filtersData } = useInterviewFilters()
  const { data: listData, isPending: loading } = useInterviewsList({
    searchTerm: debouncedSearch || undefined,
    statusId: interviewStatusId,
    page,
    pageSize,
    jobId,
  })

  // Mutations
  const { mutateAsync: cancelInterview } = useCancelInterview()
  const { mutateAsync: completeInterview } = useCompleteInterview()
  const { mutateAsync: missingInterview } = useMissingInterview()

  const data = listData?.items || []
  const totalPages = listData?.totalPages || 1
  const filters = filtersData || null

  const handleCancel = async (id: number) => {
    try {
      await cancelInterview(id)
      toast.success('تم إلغاء المقابلة بنجاح')
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في إلغاء المقابلة')
    }
  }

  const handleComplete = async (id: number) => {
    try {
      await completeInterview(id)
      toast.success('تم تعيين المقابلة كمكتملة')
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في إكمال المقابلة')
    }
  }

  const handleMissing = async (id: number) => {
    try {
      await missingInterview(id)
      toast.success('تم تسجيل المرشح كغائب')
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في تسجيل الغياب')
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

      {/* Header Banner */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 sticky top-22 mb-3 shadow-sm transition-all hover:shadow-md p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 flex-col md:flex-row w-full gap-4 items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو الوظيفة..."
                className="pr-10 h-10 shadow-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
              <Combobox
                value={
                  interviewStatusId === undefined
                    ? { id: 0, name: 'جميع الحالات' }
                    : filters?.statuses.find(s => s.id === interviewStatusId) || null
                }
                onValueChange={(val: any) => {
                  setPage(1)
                  if (!val || val.id === 0) setInterviewStatusId(undefined)
                  else setInterviewStatusId(val.id)
                }}
                filter={null}
                itemToStringLabel={(item: any) => {
                  if (!item) return ''
                  if (item.name === 'جميع الحالات') return 'جميع الحالات'
                  const translations: Record<string, string> = {
                    'Scheduled': 'مجدولة',
                    'Completed': 'مكتملة',
                    'Cancelled': 'ملغاة',
                    'Rescheduled': 'معاد جدولتها',
                    'NoShow': 'لم يحضر',
                    'Confirmed': 'مؤكدة',
                    'MissingInterview': 'لم يحضر',
                    'Withdrawn': 'منسحب'
                  };
                  return translations[item.name] || item.name
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
                    {filters?.statuses.map(s => {
                      const translations: Record<string, string> = {
                        'Scheduled': 'مجدولة',
                        'Completed': 'مكتملة',
                        'Cancelled': 'ملغاة',
                        'Rescheduled': 'معاد جدولتها',
                        'NoShow': 'لم يحضر',
                        'Confirmed': 'مؤكدة',
                        'MissingInterview': 'لم يحضر',
                        'Withdrawn': 'منسحب'
                      };
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

            <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
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
            </div>

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

      <motion.div variants={itemVariants}>
        <div className="border-border/40 dark:bg-card overflow-hidden rounded-3xl border h-full bg-white shadow-sm">
        <InterviewTable
          data={data}
          loading={loading}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          sorting={sorting}
          setSorting={setSorting}
          handleCancel={handleCancel}
          handleComplete={handleComplete}
          handleMissing={handleMissing}
          handleReschedule={(intv) => {
            setSelectedInterviewId(intv.interviewId)
            let typeId = 1
            if (intv.interviewType === 'InPerson') typeId = 2
            else if (intv.interviewType === 'Phone') typeId = 3

            setSelectedInterviewData({
              interviewDate: intv.interviewDate,
              interviewTypeId: typeId,
              meetingLink: typeId === 1 ? intv.location : '',
              countryId: intv.countryId || null,
              governateId: intv.governateId || null,
              addressLine: intv.addressLine || '',
              addressId: intv.addressId || null,
              notes: '',
            })
            setDialogOpen(true)
          }}
        />
        </div>
      </motion.div>

      {dialogOpen && (
        <ScheduleRescheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          interviewId={selectedInterviewId}
          initialData={selectedInterviewData}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: interviewKeys.all })
          }}
        />
      )}
    </motion.div>
  )
}
