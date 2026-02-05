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
    <div className="mt-4 grid grid-cols-3 gap-4 max-md:grid-cols-1">
      <Card className="bg-linear-to-r from-blue-500 to-blue-600 py-8">
        <CardHeader>
          <CardTitle size={'bold'} className="text-white">
            طلبات التوثيق المعلقة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="mt-2 mb-4 text-2xl font-bold text-white">18</h1>
          <CardAction className="rounded-[9px] bg-white/20 p-3">
            <Clock className="text-white" />
          </CardAction>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant={'default'}
              size={'sm'}
              className="bg-white/10 px-5 text-white hover:bg-white/20"
            >
              مراجعة الطلبات
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="bg-linear-to-r from-orange-400 to-orange-600 py-8">
        <CardHeader>
          <CardTitle size={'bold'} className="text-white">
            رسائل غير مقروءة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="mt-2 mb-4 text-2xl font-bold text-white">23</h1>
          <CardAction className="rounded-[9px] bg-white/20 p-3">
            <Mail className="text-white" />
          </CardAction>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant={'default'}
              size={'sm'}
              className="bg-white/15 px-5 text-white hover:bg-white/20"
            >
              عرض الرسائل
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="bg-linear-to-r from-green-400 to-green-600 py-8">
        <CardHeader>
          <CardTitle size={'bold'} className="text-white">
            نشاط اليوم
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="mt-2 mb-4 text-2xl font-bold text-white">47</h1>
          <CardAction className="rounded-[9px] bg-white/20 p-3">
            <Activity className="text-white" />
          </CardAction>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant={'default'}
              size={'sm'}
              className="bg-white/20 px-5 text-white hover:bg-white/20"
            >
              عرض التفاصيل
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
