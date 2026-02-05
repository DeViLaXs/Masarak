import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import {
  Building2,
  User,
  Mails,
  CircleDollarSign,
  Clock,
  Verified,
  ShieldCheck,
  CircleX,
} from 'lucide-react'

export default function CompaniesCard() {
  return (
    <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            إجمالي الشركات
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">247</h1>
          <div className="rounded-[12px] bg-blue-400/25 p-3 max-sm:hidden">
            <Building2 className="text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            في انتظار التوثيق
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">18</h1>
          <div className="rounded-[12px] bg-orange-400/25 p-3 max-sm:hidden">
            <Clock className="text-orange-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            شركات موثقة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">195</h1>
          <div className="rounded-[12px] bg-green-400/25 p-3 max-sm:hidden">
            <ShieldCheck className="text-green-700" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            شركات مرفوضة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-500">34</h1>
          <div className="rounded-[12px] bg-red-400/25 p-3 max-sm:hidden">
            <CircleX className="text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
