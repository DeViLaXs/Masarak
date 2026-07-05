'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Lightbulb, MailOpen, Mail } from 'lucide-react'
import { FeedbackStatisticsDTO } from '@/services/feedback-service'

interface FeedbackStatsProps {
  isLoading: boolean
  stats?: FeedbackStatisticsDTO
}

export function FeedbackStats({ isLoading, stats }: FeedbackStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" dir="rtl">
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
              <Skeleton className="size-12 rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cardsData = [
    {
      title: 'الشكاوى',
      value: stats?.complaintsCount ?? 0,
      icon: AlertCircle,
      colorClass: 'text-rose-500',
      bgColorClass: 'bg-rose-500/10 dark:bg-rose-500/25',
      borderColorClass: 'hover:border-rose-300 dark:hover:border-rose-950',
      gradientClass: 'from-rose-500/5 to-transparent',
      description: 'ملاحظات تتطلب معالجة وحل',
    },
    {
      title: 'اقتراح ميزة',
      value: stats?.featureRequestsCount ?? 0,
      icon: Lightbulb,
      colorClass: 'text-blue-500',
      bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
      borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
      gradientClass: 'from-blue-500/5 to-transparent',
      description: 'أفكار وميزات جديدة مقترحة',
    },
    {
      title: 'ملاحظات مقروءة',
      value: stats?.readFeedbacksCount ?? 0,
      icon: MailOpen,
      colorClass: 'text-emerald-500',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
      borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
      gradientClass: 'from-emerald-500/5 to-transparent',
      description: 'ملاحظات تم الاطلاع عليها',
    },
    {
      title: 'ملاحظات غير مقروءة',
      value: stats?.unreadFeedbacksCount ?? 0,
      icon: Mail,
      colorClass: 'text-amber-500',
      bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
      borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
      gradientClass: 'from-amber-500/5 to-transparent',
      description: 'رسائل جديدة في انتظار المراجعة',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" dir="rtl">
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
