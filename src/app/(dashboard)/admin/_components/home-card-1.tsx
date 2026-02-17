import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Building2, User, Mails, CircleDollarSign } from 'lucide-react'

export default function HomeCard1() {
  return (
    <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="max-sm:text-xs">إجمالي الشركات</CardTitle>
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
          <CardTitle className="max-sm:text-xs">المستخدمين النشطين </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">1456</h1>
          <div className="rounded-[12px] bg-orange-400/25 p-3 max-sm:hidden">
            <User className="text-orange-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="max-sm:text-xs">إجمالي الرسائل</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">156</h1>
          <div className="rounded-[12px] bg-green-400/25 p-3 max-sm:hidden">
            <Mails className="text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="max-sm:text-xs">إيرادات الشهر</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-500">285K</h1>
          <div className="rounded-[12px] bg-purple-400/25 p-3 max-sm:hidden">
            <CircleDollarSign className="text-purple-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="max-sm:text-xs"> الشهر</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-500">285K</h1>
          <div className="rounded-[12px] bg-purple-400/25 p-3 max-sm:hidden">
            <CircleDollarSign className="text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
