'use client'

import React, { useState, useEffect } from 'react'
import { interviewService, InterviewListItemDto, InterviewFiltersDto } from '@/services/interview-service'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Search, CalendarRange } from 'lucide-react'
import { ScheduleRescheduleDialog } from '@/components/interview-dialog'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import { InterviewTable } from './_components/interview-table'

export default function InterviewsPage() {
  const [data, setData] = useState<InterviewListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<InterviewFiltersDto | null>(null)

  // Query state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [interviewStatusId, setInterviewStatusId] = useState<number | undefined>()
  const [jobId, setJobId] = useState<number | undefined>()
  const [totalPages, setTotalPages] = useState(1)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | undefined>()
  const [selectedInterviewData, setSelectedInterviewData] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await interviewService.getInterviews({
        page,
        pageSize,
        search,
        interviewStatusId,
        jobId,
      })
      setData(res.items || [])
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      toast.error('فشل في تحميل المقابلات')
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const res = await interviewService.getFilters()
      setFilters(res)
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchData()
  }, [page, pageSize, search, interviewStatusId, jobId])

  const handleCancel = async (id: number) => {
    try {
      await interviewService.cancel(id)
      toast.success('تم إلغاء المقابلة بنجاح')
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في إلغاء المقابلة')
    }
  }

  const handleComplete = async (id: number) => {
    try {
      await interviewService.complete(id)
      toast.success('تم تعيين المقابلة كمكتملة')
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في إكمال المقابلة')
    }
  }

  const handleMissing = async (id: number) => {
    try {
      await interviewService.missing(id)
      toast.success('تم تسجيل المرشح كغائب')
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في تسجيل الغياب')
    }
  }



  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-7xl space-y-8 pb-10 duration-500 p-6 md:p-8" dir="rtl">

      {/* Header Banner */}
     
      <Card className="border-border/50 overflow-hidden shadow-sm transition-all hover:shadow-md p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 flex-col md:flex-row w-full gap-4 items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو الوظيفة..."
                className="pr-10 h-10 shadow-sm rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    'Canceled': 'ملغاة',
                    'Rescheduled': 'معاد جدولتها',
                    'No Show': 'لم يحضر'
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
                        'Canceled': 'ملغاة',
                        'Rescheduled': 'معاد جدولتها',
                        'No Show': 'لم يحضر'
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
          </div>
        </div>
      </Card>

      <InterviewTable
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
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
            countryId: null,
            governateId: null,
            addressLine: typeId === 2 ? intv.location : '',
            notes: '',
          })
          setDialogOpen(true)
        }}
      />

      {dialogOpen && (
        <ScheduleRescheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          interviewId={selectedInterviewId}
          initialData={selectedInterviewData}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}
