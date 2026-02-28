'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Ban,
  CircleX,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = parseInt(params.id as string)

  const { useCompany } = useAdmin()
  const { data: response, isLoading, error } = useCompany(companyId)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-gray-500">جاري تحميل بيانات الشركة...</div>
      </div>
    )
  }

  if (error || !response?.data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-500">
          حدث خطأ أثناء تحميل بيانات الشركة.
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          العودة
        </Button>
      </div>
    )
  }

  const company = response.data

  const getStatusBadge = (status: string) => {
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
            <Ban className="h-4 w-4" /> معلّقة
          </span>
        )
      case 'Inactive':
        return (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            <CircleX className="h-4 w-4" /> غير نشطة
          </span>
        )
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            <XCircle className="h-4 w-4" /> مرفوضة
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="px-6 py-6 max-sm:p-4" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الشركة</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="h-fit md:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar className="mb-4 h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={company.logoUrl || '/User-icon.webp'}
                alt={company.companyName}
              />
              <AvatarFallback className="bg-blue-100 text-3xl text-blue-700">
                {company.companyName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              {company.companyName}
            </h2>
            <p className="mb-4 text-sm text-gray-500">{company.industry}</p>
            <div className="mb-6">{getStatusBadge(company.status)}</div>

            <div className="w-full space-y-4 border-t pt-4 text-right">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-blue-500" />
                <span dir="ltr">{company.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{company.address || 'العنوان غير متوفر'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-1 text-sm font-medium text-gray-500">
                  رقم السجل التجاري
                </div>
                <div className="font-medium text-gray-900">
                  {company.commercialRegisterNumber || 'غير متوفر'}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-1 text-sm font-medium text-gray-500">
                  الرقم الضريبي
                </div>
                <div className="font-medium text-gray-900">
                  {company.taxNumber || 'غير متوفر'}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-1 text-sm font-medium text-gray-500">
                  النوع
                </div>
                <div className="font-medium text-gray-900">
                  {company.companyType || 'غير متوفر'}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar className="h-4 w-4" />
                  تاريخ التسجيل
                </div>
                <div className="font-medium text-gray-900">
                  {new Date(company.createdAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border p-4">
              <h3 className="mb-2 font-medium text-gray-900">وصف الشركة</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {company.description ||
                  'لا يوجد وصف متاح لهذه الشركة حتى الآن.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
