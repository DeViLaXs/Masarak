import { Activity, Clock, Mail } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from '../../../../components/ui/card'
import Link from 'next/link'
import { Button } from '../../../../components/ui/button'

export default function HomeCard2() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1" dir="rtl">
      <Card className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 py-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 border-none">
        {/* Hover glass overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <CardHeader className="relative z-10">
          <CardTitle size={'bold'} className="text-white text-base">
            طلبات التوثيق المعلقة
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex items-center justify-between pb-4">
          <div className="space-y-1">
            <span className="text-3xl font-extrabold tracking-tight">18</span>
            <p className="text-blue-100 text-xs">طلبات بانتظار الاعتماد والمراجعة</p>
          </div>
          <CardAction className="rounded-2xl bg-white/15 p-3.5 transition-transform duration-300 group-hover:scale-110">
            <Clock className="text-white size-6" />
          </CardAction>
        </CardContent>
        <CardFooter className="relative z-10 pt-2">
          <Link href="/" className="w-full">
            <Button
              variant={'default'}
              size={'sm'}
              className="bg-white/10 w-full rounded-xl py-2 px-5 text-white hover:bg-white/20 border-none transition-colors duration-200"
            >
              مراجعة الطلبات
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="group relative overflow-hidden bg-linear-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 py-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 border-none">
        {/* Hover glass overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="relative z-10">
          <CardTitle size={'bold'} className="text-white text-base">
            رسائل غير مقروءة
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex items-center justify-between pb-4">
          <div className="space-y-1">
            <span className="text-3xl font-extrabold tracking-tight">23</span>
            <p className="text-orange-100 text-xs">رسائل واستفسارات جديدة</p>
          </div>
          <CardAction className="rounded-2xl bg-white/15 p-3.5 transition-transform duration-300 group-hover:scale-110">
            <Mail className="text-white size-6" />
          </CardAction>
        </CardContent>
        <CardFooter className="relative z-10 pt-2">
          <Link href="/" className="w-full">
            <Button
              variant={'default'}
              size={'sm'}
              className="bg-white/15 w-full rounded-xl py-2 px-5 text-white hover:bg-white/25 border-none transition-colors duration-200"
            >
              عرض الرسائل
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="group relative overflow-hidden bg-linear-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 py-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20 border-none">
        {/* Hover glass overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="relative z-10">
          <CardTitle size={'bold'} className="text-white text-base">
            نشاط اليوم
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex items-center justify-between pb-4">
          <div className="space-y-1">
            <span className="text-3xl font-extrabold tracking-tight">47</span>
            <p className="text-green-100 text-xs">عمليات وإجراءات تمت اليوم</p>
          </div>
          <CardAction className="rounded-2xl bg-white/15 p-3.5 transition-transform duration-300 group-hover:scale-110">
            <Activity className="text-white size-6" />
          </CardAction>
        </CardContent>
        <CardFooter className="relative z-10 pt-2">
          <Link href="/" className="w-full">
            <Button
              variant={'default'}
              size={'sm'}
              className="bg-white/20 w-full rounded-xl py-2 px-5 text-white hover:bg-white/30 border-none transition-colors duration-200"
            >
              عرض التفاصيل
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
