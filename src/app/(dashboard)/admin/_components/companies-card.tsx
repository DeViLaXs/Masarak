'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import { Building2, Clock, ShieldCheck, CircleX } from 'lucide-react'
import { useAdmin } from '@/hooks/use-admin'

export default function CompaniesCard() {
  const { useStatistics } = useAdmin()
  const { data: response, isLoading } = useStatistics()

  const stats = response?.data || {
    totalCompanies: 0,
    pendingVerification: 0,
    verified: 0,
    rejected: 0,
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2" dir="rtl">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-border/40 bg-white shadow-sm dark:bg-card">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 rounded-full" />
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-3 w-28 rounded-full" />
              </div>
              <Skeleton className="hidden lg:block size-12 rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cardsData = [
    {
      title: 'إجمالي الشركات',
      value: stats.totalCompanies,
      icon: Building2,
      colorClass: 'text-blue-500',
      bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
      borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
      gradientClass: 'from-blue-500/5 to-transparent',
      description: 'جميع الشركات المسجلة بالمنصة',
    },
    {
      title: 'في انتظار التوثيق',
      value: stats.pendingVerification,
      icon: Clock,
      colorClass: 'text-amber-500',
      bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
      borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
      gradientClass: 'from-amber-500/5 to-transparent',
      description: 'طلبات تنتظر المراجعة والتوثيق',
    },
    {
      title: 'شركات موثقة',
      value: stats.verified,
      icon: ShieldCheck,
      colorClass: 'text-emerald-500',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
      borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
      gradientClass: 'from-emerald-500/5 to-transparent',
      description: 'شركات تم التحقق من ثبوتيتها',
    },
    {
      title: 'شركات مرفوضة',
      value: stats.rejected,
      icon: CircleX,
      colorClass: 'text-rose-500',
      bgColorClass: 'bg-rose-500/10 dark:bg-rose-500/25',
      borderColorClass: 'hover:border-rose-300 dark:hover:border-rose-950',
      gradientClass: 'from-rose-500/5 to-transparent',
      description: 'شركات تم رفض طلب توثيقها',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2" dir="rtl">
      {cardsData.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className={`group relative overflow-hidden border-border/40 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-card ${card.borderColorClass}`}
          >
            {/* Subtle Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold max-sm:text-[11px] text-nowrap">
                {card.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 flex items-center justify-between pt-2">
              <div className="space-y-1 flex-1">
                <span className={`text-3xl font-extrabold tracking-tight ${card.colorClass}`}>
                  {card.value}
                </span>
                <p className="text-muted-foreground text-[10px] font-normal leading-none text-nowrap">
                  {card.description}
                </p>
              </div>
              
              <div className={`hidden lg:flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${card.bgColorClass}`}>
                <Icon className={`size-6 ${card.colorClass}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
