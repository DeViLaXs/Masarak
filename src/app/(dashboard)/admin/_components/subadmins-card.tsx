'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Users, UserX, UserCheck } from 'lucide-react'
import { useSubadmins } from '@/hooks/use-subadmins'

export default function SubadminsCard() {
  const { useStatistics } = useSubadmins()
  const { data: response, isLoading } = useStatistics()

  const stats = response?.data

  return (
    <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            إجمالي المشرفين
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">
            {isLoading ? '...' : stats?.totalSubAdmins || 0}
          </h1>
          <div className="rounded-[12px] bg-blue-400/25 p-3 max-sm:hidden">
            <Users className="text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            مشرفين نشطين
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">
            {isLoading ? '...' : stats?.activeSubAdmins || 0}
          </h1>
          <div className="rounded-[12px] bg-green-400/25 p-3 max-sm:hidden">
            <UserCheck className="text-green-700" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            مشرفين معلقين
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">
            {isLoading ? '...' : stats?.suspendedSubAdmins || 0}
          </h1>
          <div className="rounded-[12px] bg-orange-400/25 p-3 max-sm:hidden">
            <UserX className="text-orange-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-nowrap max-sm:text-xs">
            مشرفين محظورين
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-500">
            {isLoading ? '...' : stats?.blockedSubAdmins || 0}
          </h1>
          <div className="rounded-[12px] bg-red-400/25 p-3 max-sm:hidden">
            <UserX className="text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
