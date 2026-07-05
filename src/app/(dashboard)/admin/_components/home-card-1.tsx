import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import { Building2, Briefcase, MessagesSquare, CalendarDays } from 'lucide-react'
import { useAdmin } from '@/hooks/use-admin'

export default function HomeCard1() {
  const { useDashboardStatistics } = useAdmin()
  const { data: response, isLoading } = useDashboardStatistics()
  const stats = response?.data

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
              <Skeleton className="size-10 lg:size-12 rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cardsData = [
    {
      title: 'إجمالي الشركات',
      value: stats?.totalCompanies ?? 0,
      icon: Building2,
      colorClass: 'text-blue-500',
      bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
      borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
      gradientClass: 'from-blue-500/5 to-transparent',
      description: 'شركات مسجلة في المنصة',
    },
    {
      title: 'إجمالي الوظائف المنشورة',
      value: stats?.totalPublishedJobs ?? 0,
      icon: Briefcase,
      colorClass: 'text-amber-500',
      bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
      borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
      gradientClass: 'from-amber-500/5 to-transparent',
      description: 'فرص عمل معلنة للجميع',
    },
    {
      title: 'إجمالي الملاحظات',
      value: stats?.totalFeedbacks ?? 0,
      icon: MessagesSquare,
      colorClass: 'text-emerald-500',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
      borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
      gradientClass: 'from-emerald-500/5 to-transparent',
      description: 'شكاوى واقتراحات مستلمة',
    },
    {
      title: 'الشركات المسجلة هذا الشهر',
      value: stats?.companiesRegisteredThisMonth ?? 0,
      icon: CalendarDays,
      colorClass: 'text-purple-500',
      bgColorClass: 'bg-purple-500/10 dark:bg-purple-500/25',
      borderColorClass: 'hover:border-purple-300 dark:hover:border-purple-950',
      gradientClass: 'from-purple-500/5 to-transparent',
      description: 'شركات جديدة انضمت مؤخراً',
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
              
              <div className={`flex size-10 lg:size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${card.bgColorClass}`}>
                <Icon className={`size-5 lg:size-6 ${card.colorClass}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
