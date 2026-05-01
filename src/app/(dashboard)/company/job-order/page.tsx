'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, User, Briefcase, Calendar, Clock, Download, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox'
import { applicationService } from '@/services/application-service'
import { useApplications, useUpdateApplicationStatus } from '@/hooks/use-applications'
import { useCompanyJobs } from '@/hooks/use-jobs'

const statuses = [
  { id: 1, name: 'قيد المراجعة' },
  { id: 3, name: 'مرفوض' },
  { id: 4, name: 'مقبول' },
]

export default function JobOrderPage() {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [jobId, setJobId] = useState<string>('all')
  const [statusId, setStatusId] = useState<string>('all')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data: jobsData, isLoading: isLoadingJobs } = useCompanyJobs({ pageSize: 100 })

  const { data: applicationsData, isLoading: isLoadingApplications } = useApplications({
    SearchTerm: debouncedSearch || undefined,
    JobId: jobId !== 'all' ? Number(jobId) : undefined,
    StatusId: statusId !== 'all' ? Number(statusId) : undefined,
    Page: 1,
    PageSize: 50,
  })

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' })
    const diff = new Date().getTime() - new Date(dateString).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'اليوم'
    if (days === 1) return 'أمس'
    return rtf.format(-days, 'day')
  }

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1:
        return (
          <Badge
            variant="secondary"
            className="bg-[#fef9c3] text-[#854d0e] hover:bg-[#fef9c3]/80 rounded-full px-3 py-1 font-medium text-xs mb-4 border-none shadow-none"
          >
            قيد المراجعة
          </Badge>
        )
      case 3:
        return (
          <Badge
            variant="secondary"
            className="bg-[#fee2e2] text-[#991b1b] hover:bg-[#fee2e2]/80 rounded-full px-3 py-1 font-medium text-xs mb-4 border-none shadow-none"
          >
            مرفوض
          </Badge>
        )
      case 4:
        return (
          <Badge
            variant="secondary"
            className="bg-[#d1fae5] text-[#065f46] hover:bg-[#d1fae5]/80 rounded-full px-3 py-1 font-medium text-xs mb-4 border-none shadow-none"
          >
            مقبول
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold">طلبات التوظيف</h1>
        <p className="text-sm text-muted-foreground">
          مراجعة وإدارة طلبات المتقدمين للوظائف
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="البحث في الطلبات..."
            className="pr-9 bg-background w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Combobox
          defaultValue="all"
          value={jobId}
          onValueChange={(val) => setJobId(val as string)}
        >
          <ComboboxInput
            placeholder="جميع الوظائف"
            className="w-full md:w-[200px]"
            showTrigger
          />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxItem value="all">جميع الوظائف</ComboboxItem>
              {jobsData?.items.map((job) => (
                <ComboboxItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Combobox
          defaultValue="all"
          value={statusId}
          onValueChange={(val) => setStatusId(val as string)}
        >
          <ComboboxInput
            placeholder="جميع الحالات"
            className="w-full md:w-[200px]"
            showTrigger
          />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxItem value="all">جميع الحالات</ComboboxItem>
              {statuses.map((status) => (
                <ComboboxItem key={status.id} value={status.id.toString()}>
                  {status.name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {isLoadingApplications ? (
          <div className="flex justify-center items-center p-12 text-muted-foreground">
            <Loader2 className="animate-spin size-8" />
          </div>
        ) : applicationsData?.items && applicationsData.items.length > 0 ? (
          applicationsData.items.map((application) => (
            <Card key={application.applicationId} className="rounded-xl shadow-sm border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="size-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground leading-none">
                          {application.candidateName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {application.candidateEmail}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="size-3.5" />
                          <span>{application.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          <span>{formatDate(application.applicationDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          <span>{getRelativeTime(application.applicationDate)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/90 max-w-2xl leading-relaxed mt-2">
                        {application.candidateDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between min-w-[200px]">
                    {getStatusBadge(application.statusId)}

                    <div className="flex items-center gap-2 mt-auto">
                      {application.resumeUrl && (
                        <Button
                          size="sm"
                          className="bg-[#3b82f6] text-white hover:bg-[#2563eb] h-8 px-3 text-xs"
                          asChild
                        >
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="size-3.5" />
                            تحميل السيرة
                          </a>
                        </Button>
                      )}
                      
                      {application.statusId === 1 && (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#10b981] hover:bg-[#059669] text-white h-8 px-3 text-xs"
                            disabled={isUpdating}
                            onClick={() => {
                              updateStatus(
                                { id: application.applicationId, status: 4 },
                                {
                                  onSuccess: () => toast.success('تم تحديث حالة الطلب بنجاح'),
                                  onError: () => toast.error('حدث خطأ أثناء تحديث الحالة'),
                                }
                              )
                            }}
                          >
                            <Check className="size-3.5" />
                            قبول
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            disabled={isUpdating}
                            onClick={() => {
                              updateStatus(
                                { id: application.applicationId, status: 3 },
                                {
                                  onSuccess: () => toast.success('تم تحديث حالة الطلب بنجاح'),
                                  onError: () => toast.error('حدث خطأ أثناء تحديث الحالة'),
                                }
                              )
                            }}
                          >
                            <X className="size-3.5" />
                            رفض
                          </Button>
                        </>
                      )}

                      {application.statusId === 4 && (
                        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium h-8 px-3 bg-[#9ca3af] text-white cursor-not-allowed">
                          تم القبول
                        </div>
                      )}
                      {application.statusId === 3 && (
                        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium h-8 px-3 bg-[#f87171] text-white cursor-not-allowed">
                          تم الرفض
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-xl shadow-sm">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Briefcase className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">لا توجد طلبات</h3>
            <p className="text-sm text-muted-foreground mt-1">
              لم يتم العثور على أي طلبات توظيف تطابق بحثك.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
