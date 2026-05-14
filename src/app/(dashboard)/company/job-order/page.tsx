'use client'

import React, { useState, useEffect } from 'react'
import { applicationService, ApplicationListItemDto, ApplicationFiltersDto } from '@/services/application-service'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { ScheduleRescheduleDialog } from '@/components/interview-dialog'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import { JobOrderTable } from './_components/job-order-table'

export default function ApplicationsPage() {
  const [data, setData] = useState<ApplicationListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ApplicationFiltersDto | null>(null)

  // Query state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [applicationStatusId, setApplicationStatusId] = useState<number | undefined>()
  const [jobId, setJobId] = useState<number | undefined>()
  const [totalPages, setTotalPages] = useState(1)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<number | undefined>()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await applicationService.getApplications({
        page,
        pageSize,
        search,
        applicationStatusId,
        jobId,
      })
      setData(res.items || [])
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      toast.error('فشل في تحميل الطلبات')
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const res = await applicationService.getFilters()
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
  }, [page, pageSize, search, applicationStatusId, jobId])

  const handleReject = async (id: number) => {
    try {
      await applicationService.reject(id)
      toast.success('تم رفض الطلب بنجاح')
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في رفض الطلب')
    }
  }

  const handleHire = async (id: number) => {
    try {
      await applicationService.hire(id)
      toast.success('تم توظيف المرشح بنجاح')
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0] || 'فشل في توظيف المرشح')
    }
  }



  return (
    <div className=" mx-auto w-full max-w-7xl space-y-8 pb-10 duration-500 p-3 md:p-8" dir="rtl">

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

            <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
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
                  className=" w-full border-none focus:ring-0 px-3 text-sm h-full cursor-pointer "
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

            <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
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

      <JobOrderTable
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        handleReject={handleReject}
        handleHire={handleHire}
        handleSchedule={(id) => {
          setSelectedAppId(id)
          setDialogOpen(true)
        }}
      />

      {dialogOpen && (
        <ScheduleRescheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          applicationId={selectedAppId}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}

