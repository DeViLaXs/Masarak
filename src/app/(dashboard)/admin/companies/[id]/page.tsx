'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  Building,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  Ban,
  ShieldCheck,
  ShieldAlert,
  Calendar,
} from 'lucide-react'

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = Number(params.id)

  const { useCompany, updateCompanyStatus, isUpdatingStatus } = useAdmin()
  const [pendingStatus, setPendingStatus] = useState<'Active' | 'Suspended' | 'Rejected' | 'Blocked' | null>(null)
  const { data: response, isLoading } = useCompany(companyId)

  const company = response?.data

  const statusTranslations: Record<string, string> = {
    'Active': 'موثقة',
    'PendingApproval': 'في انتظار التوثيق',
    'Suspended': 'معلّقة',
    'Rejected': 'مرفوضة',
    'Blocked': 'محظورة',
    'Inactive': 'غير نشطة',
  }

  const getStatusBadgeStyles = (status: string) => {
    let colors = "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200"
    let Icon = Clock

    if (status === 'PendingApproval') {
      colors = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-950/40 dark:text-yellow-300"
      Icon = Clock
    } else if (status === 'Active') {
      colors = "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-950/40 dark:text-green-300"
      Icon = CheckCircle2
    } else if (status === 'Suspended') {
      colors = "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-950/40 dark:text-orange-300"
      Icon = AlertCircle
    } else if (status === 'Rejected' || status === 'Blocked') {
      colors = "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-950/40 dark:text-red-300"
      Icon = XCircle
    }

    return { colors, Icon }
  }

  const handleStatusChange = async (newStatus: 'Active' | 'Suspended' | 'Rejected' | 'Blocked') => {
    try {
      setPendingStatus(newStatus)
      await updateCompanyStatus({
        id: companyId,
        data: { status: newStatus }
      })

      let message = "تم تحديث حالة الشركة بنجاح"
      if (newStatus === 'Active') message = "تم توثيق الشركة بنجاح"
      else if (newStatus === 'Suspended') message = "تم تعليق حساب الشركة بنجاح"
      else if (newStatus === 'Rejected') message = "تم رفض طلب الشركة بنجاح"
      else if (newStatus === 'Blocked') message = "تم حظر الشركة بنجاح"

      gooeyToast.success(message)
    } catch (err: any) {
      gooeyToast.error(err?.message || "فشلت عملية تحديث الحالة")
    } finally {
      setPendingStatus(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          جاري تحميل تفاصيل الشركة...
        </p>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center" dir="rtl">
        <AlertCircle className="size-16 text-destructive/80 animate-bounce" />
        <h3 className="text-xl font-bold text-foreground">لم يتم العثور على الشركة</h3>
        <p className="text-muted-foreground max-w-md">
          قد تكون هذه الشركة غير موجودة أو تم حذفها، أو لا تملك الصلاحية الكافية لعرضها.
        </p>
        <Button onClick={() => router.push('/admin/companies')} variant="default" className="mt-2">
          العودة لإدارة الشركات
        </Button>
      </div>
    )
  }

  const registeredDate = company.createdAt
    ? new Date(company.createdAt).toLocaleDateString('en-CA')
    : 'غير محدد'

  const statusInfo = getStatusBadgeStyles(company.status)
  const StatusIcon = statusInfo.Icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="mx-auto w-full max-w-4xl space-y-6 pb-12 text-right dir-rtl"
      dir="rtl"
    >
      {/* Header Banner Section */}
      <div className="border-border/40 from-primary/10 via-background to-background dark:from-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-l p-6 shadow-sm">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-12 items-center justify-center rounded-xl ring-1">
              <Building2 className="size-6" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight">تفاصيل الشركة</h1>
              <p className="text-muted-foreground mt-1 text-sm">عرض معلومات الشركة وتفاصيل الحساب وإجراءات الإدارة</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/companies')}
            className="text-muted-foreground hover:text-primary hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 w-fit self-end sm:self-auto rounded-full"
          >
            <ArrowRight className="ml-2 size-4" />
            العودة إلى الشركات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Right Column: Profile Card */}
        <Card className="border-border/50 md:col-span-1 shadow-sm h-fit overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-background to-background/5 dark:from-primary/5 dark:via-background/20 dark:to-background h-20 w-full" />
          <CardContent className="pt-0 pb-6 flex flex-col items-center text-center -mt-10">
            <Avatar className="size-20 rounded-full border-4 border-background object-cover shadow-md">
              <AvatarImage
                src={company.logoUrl || '/User-icon.webp'}
                alt={company.companyName}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center shadow-md w-full h-full">
                {company.companyName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold text-foreground mt-3">{company.companyName}</h2>


            <div className="w-full border-t border-dashed border-border/60 my-5" />

            <div className="w-full space-y-4 text-right">
              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">البريد الإلكتروني</span>
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg text-sm text-foreground break-all justify-end" dir="ltr">
                  <span className="truncate">{company.email || 'غير متوفر'}</span>
                  <Mail className="size-4 text-primary shrink-0" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">الحالة الحالية للحساب</span>
                <Badge variant="secondary" className={cn("px-3 py-1 font-medium flex items-center gap-1.5 w-fit ml-auto", statusInfo.colors)}>
                  <StatusIcon size={14} className="shrink-0" />
                  <span>{statusTranslations[company.status] || company.status}</span>
                </Badge>
              </div>

              <div>
                <span className="text-muted-foreground text-xs font-semibold block mb-1">تأكيد البريد الإلكتروني</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "px-3 py-1 font-medium flex items-center gap-1.5 w-fit ml-auto",
                    company.emailConfirmed
                      ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300"
                  )}
                >
                  {company.emailConfirmed ? (
                    <>
                      <ShieldCheck size={14} className="shrink-0" />
                      <span>مؤكد</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={14} className="shrink-0" />
                      <span>غير مؤكد</span>
                    </>
                  )}
                </Badge>
              </div>

             
                <div>
                  <span className="text-muted-foreground text-xs font-semibold block mb-1">عدد الوظائف المنشورة</span>
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg text-sm text-foreground justify-start">
                    <Building className="size-4 text-primary shrink-0" />
                     {company.totalJobs === 0 ? "0" :
                    <span className="font-semibold">{company.totalJobs}</span>}
                  </div>
                </div>
              
            </div>
          </CardContent>
        </Card>

        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="border-border/40 from-primary/10 via-background to-background dark:from-primary/5 relative overflow-hidden border bg-gradient-to-l p-6 shadow-sm">
              <CardTitle className="text-base font-bold flex items-center gap-2 justify-start">
                <Building2 className="size-4 text-primary" />
                المعلومات الأساسية وتفاصيل السجل
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">رقم الهاتف</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <Phone className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm" dir="ltr">
                      {company.phoneNumber || 'غير محدد'}
                    </span>
                  </div>
                </div>

                {/* Industry */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">مجال العمل / القطاع</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <Briefcase className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {company.industry || 'غير محدد'}
                    </span>
                  </div>
                </div>

                {/* Registration Date */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">تاريخ التسجيل</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <Calendar className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {registeredDate}
                    </span>
                  </div>
                </div>



                {/* Location (City & Governorate) */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-bold block">المنطقة والمحافظة</span>
                  <div className="flex items-center gap-3 bg-muted/20 border border-border/50 p-3.5 rounded-xl justify-start">
                    <MapPin className="size-5 text-sky-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {company.city && company.governate
                        ? `${company.city} - ${company.governate}`
                        : company.city || company.governate || 'غير محدد'}
                    </span>
                  </div>
                </div>


              </div>


            </CardContent>
          </Card>



          {/* Quick Management Actions Card */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-zinc-800/20 py-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 justify-start">
                <ShieldCheck className="size-4 text-sky-500" />
                إجراءات سريعة لإدارة الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-start">
                {/* PendingApproval actions */}
                {company.status === 'PendingApproval' && (
                  <>
                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Active')}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors gap-2"
                    >
                      {pendingStatus === 'Active' ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      توثيق الحساب
                    </Button>

                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Suspended')}
                      variant="outline"
                      className="bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-200 hover:dark:bg-orange-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Suspended' ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
                      تعليق الحساب
                    </Button>

                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Rejected')}
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700 hover:text-red-200 hover:dark:bg-red-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Rejected' ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                      رفض الطلب
                    </Button>

                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Blocked')}
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700 hover:text-red-200 hover:dark:bg-red-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Blocked' ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                      حظر الحساب
                    </Button>
                  </>
                )}

                {/* Active actions */}
                {company.status === 'Active' && (
                  <>
                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Suspended')}
                      variant="outline"
                      className="bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-200 hover:dark:bg-orange-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Suspended' ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
                      تعليق الحساب
                    </Button>
                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Blocked')}
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700 hover:text-red-200 hover:dark:bg-red-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Blocked' ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                      حظر الحساب
                    </Button>
                  </>
                )}

                {/* Suspended actions */}
                {company.status === 'Suspended' && (
                  <>
                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Active')}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors gap-2"
                    >
                      {pendingStatus === 'Active' ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      تنشيط الحساب
                    </Button>

                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Blocked')}
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700 hover:text-red-200 hover:dark:bg-red-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Blocked' ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                      حظر الحساب
                    </Button>
                  </>
                )}

                {/* Blocked actions */}
                {company.status === 'Blocked' && (
                  <>
                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Active')}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors gap-2"
                    >
                      {pendingStatus === 'Active' ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      تنشيط الحساب
                    </Button>

                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Suspended')}
                      variant="outline"
                      className="bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-200 hover:dark:bg-orange-950/40 font-semibold gap-2 transition-colors"
                    >
                      {pendingStatus === 'Suspended' ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
                      تعليق الحساب
                    </Button>

                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

