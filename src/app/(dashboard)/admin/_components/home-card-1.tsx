import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Building2, User, Mails, CircleDollarSign } from 'lucide-react'

export default function HomeCard1() {
  const cardsData = [
    {
      title: 'إجمالي الشركات',
      value: '247',
      icon: Building2,
      colorClass: 'text-blue-500',
      bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
      borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
      gradientClass: 'from-blue-500/5 to-transparent',
      description: 'شركات مسجلة في المنصة',
    },
    {
      title: 'المستخدمين النشطين',
      value: '1456',
      icon: User,
      colorClass: 'text-amber-500',
      bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
      borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
      gradientClass: 'from-amber-500/5 to-transparent',
      description: 'مستخدمين نشطين حالياً',
    },
    {
      title: 'إجمالي الرسائل',
      value: '156',
      icon: Mails,
      colorClass: 'text-emerald-500',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
      borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
      gradientClass: 'from-emerald-500/5 to-transparent',
      description: 'تواصل واستفسارات نشطة',
    },
    {
      title: 'إيرادات الشهر',
      value: '285K',
      icon: CircleDollarSign,
      colorClass: 'text-purple-500',
      bgColorClass: 'bg-purple-500/10 dark:bg-purple-500/25',
      borderColorClass: 'hover:border-purple-300 dark:hover:border-purple-950',
      gradientClass: 'from-purple-500/5 to-transparent',
      description: 'الأرباح المحققة هذا الشهر',
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
              <CardTitle className="text-muted-foreground text-xs font-semibold max-sm:text-[11px]">
                {card.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 flex items-center justify-between pt-2">
              <div className="space-y-1">
                <span className={`text-3xl font-extrabold tracking-tight ${card.colorClass}`}>
                  {card.value}
                </span>
                <p className="text-muted-foreground text-[10px] font-normal leading-none">
                  {card.description}
                </p>
              </div>
              
              <div className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${card.bgColorClass}`}>
                <Icon className={`size-6 ${card.colorClass}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
