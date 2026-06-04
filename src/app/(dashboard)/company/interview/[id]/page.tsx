'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  MapPin,
  Video,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
  CircleX,
  UserX,
  FileText,
  Loader2,
  User,
  Mail,
  ExternalLink,
  MessageSquare,
  Building,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { interviewService, InterviewListItemDto, ScheduleInterviewDTO } from '@/services/interview-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ScheduleRescheduleDialog } from '@/components/interview-dialog'
import { cn } from '@/lib/utils'
import LoadingScreen from '@/components/loading-screen'
import { motion } from 'framer-motion'

export default function InterviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const queryClient = useQueryClient()

  const [interview, setInterview] = useState<InterviewListItemDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogInitialData, setDialogInitialData] = useState<ScheduleInterviewDTO | null>(null)

  const fetchInterview = async () => {
    try {
      setLoading(true)
      // 1. Attempt to fetch details directly from the single item endpoint
      const data = await interviewService.getInterviewById(id)
      setInterview(data)
    } catch (err: any) {
      console.warn("Direct fetch failed, falling back to list query:", err)
      try {
        // 2. Fallback: query the interviews list and find the item by id
        const res = await interviewService.getInterviews({ page: 1, pageSize: 50 })
        const found = res.items.find(item => item.interviewId === id)
        if (found) {
          setInterview(found)
        } else {
          setInterview(null)
        }
      } catch (fallbackErr) {
        console.error("Fallback search failed:", fallbackErr)
        gooeyToast.error("فشل تحميل تفاصيل المقابلة")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchInterview()
    }
  }, [id])

  const handleAction = async (action: 'complete' | 'cancel' | 'missing') => {
    if (!interview) return
    try {
      setActionLoading(true)
      if (action === 'complete') {
        await interviewService.complete(interview.interviewId)
        gooeyToast.success("تم إكمال المقابلة بنجاح")
      } else if (action === 'cancel') {
        await interviewService.cancel(interview.interviewId)
        gooeyToast.success("تم إلغاء المقابلة بنجاح")
      } else if (action === 'missing') {
        await interviewService.missing(interview.interviewId)
        gooeyToast.success("تم تسجيل غياب المرشح")
      }
      
      // Invalidate both interview list and application details queries
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      
      fetchInterview()
    } catch (err: any) {
      gooeyToast.error(err?.message || "فشلت العملية")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="جاري تحميل تفاصيل المقابلة..." fullScreen={false} />
  }

  if (!interview) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="size-16 text-destructive/80 animate-bounce" />
        <h3 className="text-xl font-bold text-foreground">لم يتم العثور على المقابلة</h3>
        <p className="text-muted-foreground max-w-md">
          قد تكون هذه المقابلة غير موجودة أو تم حذفها، أو لا تملك الصلاحية الكافية لعرضها.
        </p>
        <Button onClick={() => router.push('/company/interview')} variant="default" className="mt-2">
          العودة لجدول المقابلات
        </Button>
      </div>
    )
  }

  // --- Translation Helper Mapping ---
  const typeTranslations: Record<string, string> = {
    'Online': 'عن بُعد',
    'InPerson': 'حضورياً',
    'Phone': 'هاتفية',
  }

  const statusTranslations: Record<string, string> = {
    'Scheduled': 'مجدولة',
    'Completed': 'مكتملة',
    'Cancelled': 'ملغاة',
    'Rescheduled': 'معاد جدولتها',
    'NoShow': 'لم يحضر',
    'Confirmed': 'مؤكدة',
    'MissingInterview': 'لم يحضر',
    'Withdrawn': 'انسحب',
  }

  // Get matching percentage color dynamically based on exact rules
  const getMatchScoreStyles = (score: number | null | undefined) => {
    if (score === null || score === undefined) return { label: 'غير متاح', classes: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300' }
    if (score >= 0 && score <= 24) {
      return { label: `${score}% - متدني`, classes: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' }
    } else if (score >= 25 && score <= 49) {
      return { label: `${score}% - مقبول`, classes: 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300' }
    } else if (score >= 50 && score <= 74) {
      return { label: `${score}% - جيد جداً`, classes: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' }
    } else {
      return { label: `${score}% - ممتاز`, classes: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' }
    }
  }

  const matchStyles = getMatchScoreStyles(interview.matchingPercentage)

  // Status Badge styling helper
  const getStatusBadgeStyles = (status: string) => {
    let colors = "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200"
    let Icon = Clock

    if (status === 'Scheduled' || status === 'Confirmed') {
      colors = "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
      Icon = status === 'Confirmed' ? CheckCircle2 : Clock
    } else if (status === 'Rescheduled') {
      colors = "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
      Icon = RotateCcw
    } else if (status === 'Completed') {
      colors = "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
      Icon = CheckCircle2
    } else if (status === 'Cancelled' || status === 'NoShow' || status === 'MissingInterview' || status === 'Withdrawn') {
      colors = "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
      Icon = (status === 'NoShow' || status === 'MissingInterview') ? UserX : CircleX
    }

    return { colors, Icon }
  }

  const statusInfo = getStatusBadgeStyles(interview.interviewStatus)
  const StatusIcon = statusInfo.Icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="mx-auto w-full max-w-4xl space-y-6 pb-12 text-right dir-rtl"
    >

      {/* Header Banner Section */}
      <div className="border-border/40 from-primary/10 via-background to-background dark:from-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-l p-6 shadow-sm">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-12 items-center justify-center rounded-xl ring-1">
              <User className="size-6" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight">تفاصيل مقابلة المرشح</h1>
              <p className="text-muted-foreground mt-1 text-sm">عرض معلومات المرشح وجدول المقابلة والإجراءات</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/company/interview')}
            className="text-muted-foreground hover:text-primary hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 w-fit self-end sm:self-auto rounded-full"
          >
            <ArrowRight className="ml-2 size-4" />
            العودة للمقابلات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Candidate Profile Details Card */}
        <Card className="border-border/50 md:col-span-1 shadow-sm h-fit overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-background to-background/5 dark:from-primary/5 dark:via-background/20 dark:to-background h-20 w-full" />
          <CardContent className="pt-0 pb-6 flex flex-col items-center text-center -mt-10">
            <div className="size-20 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center shadow-md">
              {interview.candidateName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-foreground mt-3">{interview.candidateName}</h2>
            <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1.5 justify-center">
              <Building className="size-3.5" />
              {interview.jobTitle}
            </p>

            <div className="w-full border-t border-dashed border-border/60 my-5" />

            <div className="w-full space-y-4 text-right">
              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">البريد الإلكتروني</span>
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg text-sm text-foreground break-all justify-end">
                  <span>{interview.email || 'غير متوفر'}</span>
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">الحالة الحالية</span>
                <Badge variant="secondary" className={cn("px-3 py-1 font-medium flex items-center gap-1.5 w-fit ml-auto", statusInfo.colors)}>
                  <StatusIcon size={14} className="shrink-0" />
                  <span>{statusTranslations[interview.interviewStatus] || interview.interviewStatus}</span>
                </Badge>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Interview Info Section */}
        <div className="md:col-span-2 space-y-6">

          {/* Main Interview Details */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="border-border/40 from-primary/10 via-background to-background dark:from-primary/5 relative overflow-hidden border bg-gradient-to-l p-6 shadow-sm">
              <CardTitle className="text-base font-bold flex items-center gap-2 justify-start">
                <Calendar className="size-4 text-primary" />
                تفاصيل موعد ومكان المقابلة
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* Date and Time */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">التاريخ والوقت</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <Clock className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {new Date(interview.interviewDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Interview Type */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">نوع المقابلة</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <span className="font-semibold text-foreground text-sm">
                      {typeTranslations[interview.interviewType] || interview.interviewType}
                    </span>
                  </div>
                </div>

              </div>

              {/* Location or Meeting Link */}
              <div className="space-y-2">
                <span className="text-muted-foreground text-xs font-bold block">الموقع / رابط المقابلة</span>
                {interview.location ? (
                  interview.location.startsWith('http') ? (
                    <a
                      href={interview.location}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between bg-primary/5 hover:bg-primary/10 border border-primary/20 p-4 rounded-xl text-primary transition-colors text-right"
                    >
                      <ExternalLink className="size-4 shrink-0" />
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm truncate max-w-[400px] block" title={interview.location}>
                          رابط اجتماع المقابلة (اضغط للانضمام)
                        </span>
                        <Video className="size-5 text-sky-500 shrink-0" />
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-4 rounded-xl justify-start">
                      <MapPin className="size-5 text-sky-500 shrink-0" />
                      <span className="font-semibold text-foreground text-sm leading-relaxed text-right">
                        {interview.location}
                      </span>
                    </div>
                  )
                ) : (
                  <div className="text-muted-foreground bg-muted/10 p-4 rounded-xl border border-dashed border-border/60 text-sm text-center">
                    لا يوجد تفاصيل للموقع حالياً
                  </div>
                )}
              </div>

              {/* Additional Notes section */}
              {interview.notes && (
                <div className="space-y-2 pt-2">
                  <span className="text-muted-foreground text-xs font-bold block">ملاحظات أو توجيهات المقابلة</span>
                  <div className="flex items-start gap-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl justify-end">
                    <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed text-right w-full">
                      {interview.notes}
                    </span>
                    <MessageSquare className="size-5 text-yellow-600 shrink-0 mt-0.5" />
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Action Operations card */}
          {(interview.canComplete || interview.canCancel || interview.canMarkMissing || interview.canReschedule) && (
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-zinc-800/20 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2 justify-start">
                  <CheckCircle className="size-4 text-emerald-600" />
                  إجراءات سريعة للمقابلة
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3 justify-start sm:justify-end">

                  {interview.canComplete && (
                    <Button
                      disabled={actionLoading}
                      onClick={() => handleAction('complete')}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors gap-2"
                    >
                      {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      إكمال المقابلة
                    </Button>
                  )}

                  {interview.canMarkMissing && (
                    <Button
                      disabled={actionLoading}
                      onClick={() => handleAction('missing')}
                      variant="outline"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:dark:bg-orange-950/40 font-semibold gap-2 transition-colors"
                    >
                      {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <UserX className="size-4" />}
                      تسجيل عدم حضور
                    </Button>
                  )}

                  {interview.canReschedule && (
                    <Button
                      disabled={actionLoading}
                      onClick={() => {
                        let typeId = 1
                        if (interview.interviewType === 'InPerson') typeId = 2
                        else if (interview.interviewType === 'Phone') typeId = 3

                        setDialogInitialData({
                          interviewDate: interview.interviewDate,
                          interviewTypeId: typeId,
                          meetingLink: typeId === 1 ? interview.location : '',
                          countryId: interview.countryId || null,
                          governateId: interview.governateId || null,
                          addressLine: interview.addressLine || '',
                          addressId: interview.addressId || null,
                          notes: interview.notes || '',
                        })
                        setDialogOpen(true)
                      }}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:dark:bg-blue-950/40 font-semibold gap-2 transition-colors"
                    >
                      <RotateCcw className="size-4" />
                      إعادة جدولة
                    </Button>
                  )}

                  {interview.canCancel && (
                    <Button
                      disabled={actionLoading}
                      onClick={() => handleAction('cancel')}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 hover:dark:bg-red-950/40 font-semibold gap-2 transition-colors"
                    >
                      {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <CircleX className="size-4" />}
                      إلغاء المقابلة
                    </Button>
                  )}

                </div>
              </CardContent>
            </Card>
          )}

        </div>

      </div>

      {/* Reschedule modal dialog reuse */}
      <ScheduleRescheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        interviewId={interview.interviewId}
        initialData={dialogInitialData}
        onSuccess={() => {
          setDialogOpen(false)
          
          // Invalidate cache to ensure lists update immediately on navigation
          queryClient.invalidateQueries({ queryKey: ['interviews'] })
          queryClient.invalidateQueries({ queryKey: ['applications'] })
          
          fetchInterview()
        }}
      />

    </motion.div>
  )
}
