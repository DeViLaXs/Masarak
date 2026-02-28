'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { SubAdminDto, useSubadmins } from '@/hooks/use-subadmins'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserX, Check, Ban } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState } from 'react'

const ActionCell = ({ subadmin }: { subadmin: SubAdminDto }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<
    'Approve' | 'Suspend' | 'Delete' | null
  >(null)

  const { updateStatus, deleteSubadmin, isUpdatingStatus, isDeleting } =
    useSubadmins()
  const isProcessing = isUpdatingStatus || isDeleting

  const handleActionClick = (type: 'Approve' | 'Suspend' | 'Delete') => {
    setActionType(type)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    if (!actionType) return

    try {
      if (actionType === 'Approve') {
        await updateStatus({ id: subadmin.id, data: { status: 'Active' } })
      } else if (actionType === 'Suspend') {
        await updateStatus({ id: subadmin.id, data: { status: 'Suspended' } })
      } else if (actionType === 'Delete') {
        await deleteSubadmin(subadmin.id)
      }
    } finally {
      setDialogOpen(false)
      setActionType(null)
    }
  }

  const getDialogContent = () => {
    switch (actionType) {
      case 'Approve':
        return {
          title: 'تأكيد التنشيط',
          description: `هل أنت متأكد من رغبتك في تنشيط حساب المشرف الفرعي "${subadmin.name}"؟`,
          confirmText: 'نعم، تنشيط',
          variant: 'default' as const,
        }
      case 'Suspend':
        return {
          title: 'تأكيد التعليق',
          description: `هل أنت متأكد من رغبتك في تعليق حساب المشرف الفرعي "${subadmin.name}"؟ لن يتمكن من تسجيل الدخول.`,
          confirmText: 'نعم، تعليق',
          variant: 'destructive' as const,
        }
      case 'Delete':
        return {
          title: 'تأكيد الحظر',
          description: `هل أنت متأكد من رغبتك في حظر حساب المشرف الفرعي "${subadmin.name}"؟`,
          confirmText: 'نعم، احظر',
          variant: 'destructive' as const,
        }
      default:
        return {
          title: '',
          description: '',
          confirmText: '',
          variant: 'default' as const,
        }
    }
  }

  const dialogContent = getDialogContent()

  return (
    <div
      className="flex items-center justify-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        title="تنشيط"
        className="h-8 w-8 text-green-500 hover:bg-green-50 hover:text-green-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Approve')}
        disabled={isProcessing || subadmin.status === 'Active'}
      >
        <Check className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="تعليق"
        className="h-8 w-8 text-orange-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Suspend')}
        disabled={isProcessing || subadmin.status === 'Suspended'}
      >
        <Ban className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="حظر"
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Delete')}
        disabled={isProcessing || subadmin.status === 'Blocked'}
      >
        <UserX className="h-4 w-4" />
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              {dialogContent.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right text-base text-gray-500">
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row items-center gap-3 sm:justify-end">
            <AlertDialogCancel disabled={isProcessing}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirm()
              }}
              className="mt-0 sm:mt-0"
              variant={dialogContent.variant}
              disabled={isProcessing}
            >
              {isProcessing ? 'جاري المعالجة...' : dialogContent.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const columns: ColumnDef<SubAdminDto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="w-[50px]">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[50px]" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <div className="min-w-[200px] text-right">اسم المشرف</div>,
    cell: ({ row }) => {
      const subadmin = row.original
      return (
        <div className="flex min-w-[200px] items-center gap-3 text-right">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
              {subadmin.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-foreground font-medium">{subadmin.name}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: () => (
      <div className="min-w-[150px] text-right">البريد الإلكتروني</div>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground min-w-[150px] truncate text-right">
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: () => <div className="min-w-[120px] text-right">رقم الهاتف</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground min-w-[120px] text-right" dir="ltr">
        {row.getValue('phoneNumber')}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="min-w-[120px] text-right">تاريخ الإضافة</div>,
    cell: ({ row }) => {
      const dateStr = row.getValue('createdAt') as string
      try {
        const date = new Date(dateStr)
        return (
          <div className="text-muted-foreground min-w-[120px] text-right">
            {date.toLocaleDateString('en-CA')}
          </div>
        )
      } catch {
        return (
          <div className="text-muted-foreground min-w-[120px] text-right">
            {dateStr}
          </div>
        )
      }
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="w-[120px] text-center">الحالة</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      switch (status) {
        case 'Active':
          return (
            <div className="flex w-[120px] items-center justify-center">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                نشط
              </span>
            </div>
          )
        case 'Suspended':
          return (
            <div className="flex w-[120px] items-center justify-center">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                معلّق
              </span>
            </div>
          )
        case 'Blocked':
          return (
            <div className="flex w-[120px] items-center justify-center">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                محظور
              </span>
            </div>
          )
        default:
          return <div className="w-[120px] text-center">{status}</div>
      }
    },
  },
  {
    id: 'actions',
    header: () => <div className="w-[120px] text-center">الإجراءات</div>,
    cell: ({ row }) => (
      <div className="w-[120px]">
        <ActionCell subadmin={row.original} />
      </div>
    ),
  },
]
