import { Activity, Clock, Mail } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import Link from 'next/link'
import { Button } from '../../../../components/ui/button'
import { useAdmin } from '@/hooks/use-admin'

export default function HomeCard2() {
  const { useDashboardStatistics } = useAdmin()
  const { data: response, isLoading } = useDashboardStatistics()
  const stats = response?.data

  if (isLoading) {
    return (
      <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1" dir="rtl">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-border/40 bg-white shadow-sm dark:bg-card py-6">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32 rounded-full" />
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-3 w-36 rounded-full" />
              </div>
              <Skeleton className="size-10 lg:size-12 rounded-2xl" />
            </CardContent>
            <CardFooter className="pt-4">
              <Skeleton className="h-9 w-full rounded-xl" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const cardsData = [
    {
      title: 'طلبات التوثيق المعلقة',
      value: stats?.pendingVerificationRequests ?? 0,
      icon: Clock,
      colorClass: 'text-blue-500',
      bgColorClass: 'bg-white/15',
      gradientClass: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
      hoverShadowClass: 'hover:shadow-blue-500/20',
      description: 'طلبات بانتظار الاعتماد والمراجعة',
      btnText: 'مراجعة الطلبات',
      link: '/admin/companies',
    },
    {
      title: 'ملاحظات غير مقروءة',
      value: stats?.unreadFeedbacks ?? 0,
      icon: Mail,
      colorClass: 'text-orange-500',
      bgColorClass: 'bg-white/15',
      gradientClass: 'from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700',
      hoverShadowClass: 'hover:shadow-orange-500/20',
      description: 'رسائل جديدة بانتظار الرد',
      btnText: 'عرض الرسائل',
      link: '/admin/feedbacks',
    },
    {
      title: 'ملاحظات جديدة هذا الأسبوع',
      value: stats?.newFeedbacksThisWeek ?? 0,
      icon: Activity,
      colorClass: 'text-green-500',
      bgColorClass: 'bg-white/15',
      gradientClass: 'from-green-400 to-green-600 dark:from-green-500 dark:to-green-700',
      hoverShadowClass: 'hover:shadow-green-500/20',
      description: 'ملاحظات تم استقبالها مؤخراً',
      btnText: 'عرض التفاصيل',
      link: '/admin/feedbacks',
    },
  ]

  return (
    <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1" dir="rtl">
      {cardsData.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className={`group relative overflow-hidden bg-linear-to-br ${card.gradientClass} py-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.hoverShadowClass} border-none`}
          >
            {/* Hover glass overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <CardHeader className="relative z-10">
              <CardTitle size={'bold'} className="text-white text-base text-nowrap">
                {card.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 flex items-center justify-between pb-4">
              <div className="space-y-1 flex-1">
                <span className="text-3xl font-extrabold tracking-tight">{card.value}</span>
                <p className="text-white/80 text-xs text-nowrap">{card.description}</p>
              </div>
              <CardAction className={`rounded-2xl p-2.5 lg:p-3.5 transition-transform duration-300 group-hover:scale-110 ${card.bgColorClass}`}>
                <Icon className="text-white size-5 lg:size-6" />
              </CardAction>
            </CardContent>
            
            <CardFooter className="relative z-10 pt-2">
              <Link href={card.link} className="w-full">
                <Button
                  variant={'default'}
                  size={'sm'}
                  className="bg-white/10 w-full rounded-xl py-2 px-5 text-white hover:bg-white/20 border-none transition-colors duration-200"
                >
                  {card.btnText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
