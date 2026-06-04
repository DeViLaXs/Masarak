'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { 
  Calendar, 
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
  Building,
  UserCheck,
  CalendarDays,
  AlertTriangle,
  Circle,
  CheckCheck,
  CheckCircle
} from 'lucide-react'
import { applicationService, ApplicationListItemDto } from '@/services/application-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ScheduleRescheduleDialog } from '@/components/interview-dialog'
import LoadingScreen from '@/components/loading-screen'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const queryClient = useQueryClient()

  const [application, setApplication] = useState<ApplicationListItemDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchApplication = async () => {
    try {
      setLoading(true)
      // 1. Try to fetch directly by ID
      const data = await applicationService.getApplicationById(id)
      setApplication(data)
    } catch (err: any) {
      console.warn("Direct application fetch failed, falling back to list lookup:", err)
      try {
        // 2. Fallback: Query list and search for matching ID
        const res = await applicationService.getApplications({ page: 1, pageSize: 50 })
        const found = res.items.find(item => item.applicationId === id)
        if (found) {
          setApplication(found)
        } else {
          setApplication(null)
        }
      } catch (fallbackErr) {
        console.error("Fallback search failed:", fallbackErr)
        gooeyToast.error("فشل تحميل تفاصيل طلب التوظيف")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchApplication()
    }
  }, [id])

  const handleAction = async (action: 'reject' | 'hire') => {
    if (!application) return
    try {
      setActionLoading(true)
      if (action === 'reject') {
        await applicationService.reject(application.applicationId)
        gooeyToast.success("تم رفض طلب التوظيف بنجاح")
      } else if (action === 'hire') {
        await applicationService.hire(application.applicationId)
        gooeyToast.success("تم توظيف المرشح بنجاح")
      }
      
      // Invalidate query client cache for both applications and interviews lists
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      
      fetchApplication()
    } catch (err: any) {
      gooeyToast.error(err?.message || "فشلت العملية")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="جاري تحميل تفاصيل طلب التوظيف..." fullScreen={false} />
  }

  if (!application) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="size-16 text-destructive/80 animate-bounce" />
        <h3 className="text-xl font-bold text-foreground">لم يتم العثور على طلب التوظيف</h3>
        <p className="text-muted-foreground max-w-md">
          قد يكون هذا الطلب غير موجود أو تم حذفه، أو لا تملك الصلاحية الكافية لعرضه.
        </p>
        <Button onClick={() => router.push('/company/job-order')} variant="default" className="mt-2">
          العودة لإدارة الطلبات
        </Button>
      </div>
    )
  }

  // --- Translation Helper Mapping ---
  const statusTranslations: Record<string, string> = {
    'PendingReview': 'في قيد الانتظار',
    'Shortlisted': 'في انتظار المقابلة',
    'Rejected': 'مرفوض',
    'Hired': 'تم التوظيف',
    'Withdrawn': 'انسحب',
    'Interview': 'مقابلة',
    'MissingInterview': 'لم يحضر المقابلة',
    'Interviewed': 'تمت المقابلة',
  }

  // Matching percentage color scale
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
  
  const matchStyles = getMatchScoreStyles(application.matchingPercentage)
  

  // Status Badge styling helper
  const getStatusBadgeStyles = (status: string) => {
    let colors = "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200"
    let Icon = Clock

    if (status === 'PendingReview') {
      colors = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-905/40 dark:text-yellow-300"
      Icon = Clock
    } else if (status === 'Shortlisted' || status === 'Interview' || status === 'Interviewed') {
      colors = "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-950/40 dark:text-blue-300"
      Icon = status === 'Interview' ? CalendarDays : status === 'Interviewed' ? CheckCircle2 : UserCheck
    } else if (status === 'Hired') {
      colors = "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-950/40 dark:text-green-300"
      Icon = CheckCircle2
    } else if (status === 'Rejected' || status === 'Withdrawn' || status === 'MissingInterview') {
      colors = "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-950/40 dark:text-red-300"
      Icon = status === 'MissingInterview' ? UserX : CircleX
    }

    return { colors, Icon }
  }

  const statusInfo = getStatusBadgeStyles(application.applicationStatus)
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
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight">تفاصيل طلب التوظيف</h1>
              <p className="text-muted-foreground mt-1 text-sm">عرض معلومات طلب التوظيف وإجراءات إدارة المتقدمين</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/company/job-order')}
            className="text-muted-foreground hover:text-primary hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 w-fit self-end sm:self-auto rounded-full"
          >
            <ArrowRight className="ml-2 size-4" />
            العودة للطلبات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Candidate Profile Details Card */}
        <Card className="border-border/50 md:col-span-1 shadow-sm h-fit overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-background to-background/5 dark:from-primary/5 dark:via-background/20 dark:to-background h-20 w-full" />
          <CardContent className="pt-0 pb-6 flex flex-col items-center text-center -mt-10">
            {application.profilePhoto ? (
              <img src={application.profilePhoto} alt="Profile" className="size-20 rounded-full border-4 border-background object-cover shadow-md" />
            ) : (
              <div className="size-20 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center shadow-md">
                {application.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-lg font-bold text-foreground mt-3">{application.fullName}</h2>
           

            <div className="w-full border-t border-dashed border-border/60 my-5" />

            <div className="w-full space-y-4 text-right">
              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">البريد الإلكتروني</span>
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg text-sm text-foreground break-all justify-end">
                  <span>{application.email || 'غير متوفر'}</span>
                  <Mail className="size-4 text-primary shrink-0" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">الحالة الحالية للطلب</span>
                <Badge variant="secondary" className={cn("px-3 py-1 font-medium flex items-center gap-1.5 w-fit ml-auto", statusInfo.colors)}>
                  <StatusIcon size={14} className="shrink-0" />
                  <span>{statusTranslations[application.applicationStatus] || application.applicationStatus}</span>
                </Badge>
              </div>

              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">نسبة المطابقة بالذكاء الاصطناعي</span>
                <Badge variant="secondary" className={cn("px-3 py-1 font-medium flex items-center gap-1.5 w-fit ml-auto", matchStyles.classes)}>
                  {/* <span>{application.matchingPercentage !== null ? `${application.matchingPercentage} %` : 'غير متاح'}</span> */}
                  <span>{matchStyles.label}</span>
                </Badge>
              </div>

              {application.cvDownloadUrl && (
                <Button variant="outline" size="sm" className="w-full mt-2 gap-2 text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors" asChild>
                  <a href={application.cvDownloadUrl} target="_blank" rel="noreferrer" download>
                    <FileText className="size-4" />
                    تحميل السيرة الذاتية
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Application Info Section */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main Application Details */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="border-border/40 from-primary/10 via-background to-background dark:from-primary/5 relative overflow-hidden border bg-gradient-to-l p-6 shadow-sm">
              <CardTitle className="text-base font-bold flex items-center gap-2 justify-start">
                <Calendar className="size-4 text-primary" />
                تفاصيل تقديم الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* Date and Time */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">تاريخ التقديم</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <Clock className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {new Date(application.applicationDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">الوظيفة المتقدم لها</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <Building className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {application.jobTitle}
                    </span>
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>

          {/* Action Operations card */}
          {(application.canReject || application.canSchedule || application.canHire) && (
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-zinc-800/20 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2 justify-start">
                  <CheckCircle className="size-4 text-sky-500" />
                  إجراءات سريعة لطلب التوظيف
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3 justify-start sm:justify-end">
                  
                  {application.canHire && (
                    <Button 
                      disabled={actionLoading}
                      onClick={() => handleAction('hire')}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors gap-2"
                    >
                      {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <UserCheck className="size-4" />}
                      توظيف المرشح
                    </Button>
                  )}

                  {application.canSchedule && (
                    <Button 
                      disabled={actionLoading}
                      onClick={() => setDialogOpen(true)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:dark:bg-blue-950/40 font-semibold gap-2 transition-colors"
                    >
                      <CalendarDays className="size-4" />
                      تحديد موعد مقابلة
                    </Button>
                  )}

                  {application.canReject && (
                    <Button 
                      disabled={actionLoading}
                      onClick={() => handleAction('reject')}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 hover:dark:bg-red-950/40 font-semibold gap-2 transition-colors"
                    >
                      {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <CircleX className="size-4" />}
                      رفض الطلب
                    </Button>
                  )}

                </div>
              </CardContent>
            </Card>
          )}

        </div>

      </div>

      {/* Schedule Interview Dialog */}
      <ScheduleRescheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        applicationId={application.applicationId}
        onSuccess={() => {
          setDialogOpen(false)
          
          // Invalidate query client cache so list views reflect scheduling updates
          queryClient.invalidateQueries({ queryKey: ['applications'] })
          queryClient.invalidateQueries({ queryKey: ['interviews'] })
          
          fetchApplication()
        }}
      />

    </motion.div>
  )
}
