'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = Number(params.id)

  const { useCompany } = useAdmin()
  const { data: response, isLoading } = useCompany(companyId)

  const company = response?.data

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'Active':
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" /> موثقة
          </span>
        )
      case 'PendingApproval':
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            <AlertCircle className="h-4 w-4" /> في انتظار التوثيق
          </span>
        )
      case 'Suspended':
        return (
          <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
            <AlertCircle className="h-4 w-4" /> معلّقة
          </span>
        )
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            <XCircle className="h-4 w-4" /> مرفوضة
          </span>
        )
      case 'Blocked':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            <XCircle className="h-4 w-4" /> محظورة
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {status || 'غير معروف'}
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 px-6 py-4" dir="rtl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-[250px] md:col-span-1" />
          <Skeleton className="h-[250px] md:col-span-2" />
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div
        className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center"
        dir="rtl"
      >
        <div className="text-muted-foreground text-lg">
          لم يتم العثور على تفاصيل الشركة.
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          العودة
        </Button>
      </div>
    )
  }

  const registeredDate = company.createdAt
    ? new Date(company.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'غير محدد'

  return (
    <div className="space-y-6 px-6 py-4" dir="rtl">
      {/* Header / Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.push('/admin/companies')}
          variant="outline"
          className="gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الشركات
        </Button>
        <div className="flex items-center gap-3">
          {getStatusBadge(company.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Profile Card */}
        <Card className="shadow-sm md:col-span-1">
          <CardContent className="flex flex-col items-center pt-8">
            <Avatar className="border-muted mb-4 h-32 w-32 border-4">
              <AvatarImage
                src={company.logoUrl || '/User-icon.webp'}
                alt={company.companyName}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                {company.companyName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-foreground mb-1 text-center text-2xl font-bold">
              {company.companyName}
            </h2>
            <p className="text-muted-foreground mb-6 text-center">
              {company.industry || 'قطاع غير محدد'}
            </p>
          </CardContent>
        </Card>

        {/* Right Column: Details */}
        <div className="space-y-6 md:col-span-2">
          {/* Main Info */}
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="text-primary h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  البريد الإلكتروني
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium" dir="ltr">
                    {company.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </div>
                <p className="font-medium">
                  {company.phoneNumber}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4" />
                  مجال العمل
                </div>
                <p className="font-medium">{company.industry || 'غير محدد'}</p>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  تاريخ التسجيل
                </div>
                <p className="font-medium">{registeredDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
