'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { CompanyDto } from '@/services/admin-service'
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
import { Trash2, Check, X, Ban } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'

const ActionCell = ({ company }: { company: CompanyDto }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<
    'Approve' | 'Suspend' | 'Reject' | 'Delete' | null
  >(null)

  const {
    updateCompanyStatus,
    deleteCompany,
    isUpdatingStatus,
    isDeletingCompany,
  } = useAdmin()

  const handleActionClick = (
    type: 'Approve' | 'Suspend' | 'Reject' | 'Delete',
  ) => {
    setActionType(type)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    if (!actionType) return

    try {
      if (actionType === 'Approve') {
        await updateCompanyStatus({
          id: company.id,
          data: { status: 'Active' },
        })
      } else if (actionType === 'Reject') {
        await updateCompanyStatus({
          id: company.id,
          data: { status: 'Rejected' },
        })
      } else if (actionType === 'Suspend') {
        await updateCompanyStatus({
          id: company.id,
          data: { status: 'Suspended' },
        })
      } else if (actionType === 'Delete') {
        await deleteCompany(company.id)
      }
    } finally {
      setDialogOpen(false)
      setActionType(null)
    }
  }

  const isProcessing = isUpdatingStatus || isDeletingCompany

  const getDialogContent = () => {
    switch (actionType) {
      case 'Approve':
        return {
          title: 'تأكيد التوثيق',
          description: `هل أنت متأكد من رغبتك في توثيق الحساب الخاص بشركة "${company.companyName}"؟ ستتمكن الشركة من استخدام جميع ميزات المنصة.`,
          confirmText: 'نعم، توثيق',
          variant: 'default' as const,
        }
      case 'Suspend':
        return {
          title: 'تأكيد التعليق',
          description: `هل أنت متأكد من رغبتك في تعليق الحساب الخاص بشركة "${company.companyName}"؟ لن تتمكن الشركة من تسجيل الدخول أو نشر وظائف.`,
          confirmText: 'نعم، تعليق',
          variant: 'destructive' as const,
        }
      case 'Reject':
        return {
          title: 'تأكيد الرفض',
          description: `هل أنت متأكد من رغبتك في رفض الحساب الخاص بشركة "${company.companyName}"؟ سيكون هذا الإجراء مرئياً للشركة.`,
          confirmText: 'نعم، رفض',
          variant: 'destructive' as const,
        }
      case 'Delete':
        return {
          title: 'تأكيد الحظر / الحذف التلقائي',
          description: `هل أنت متأكد من رغبتك في حظر الحساب الخاص بشركة "${company.companyName}"؟ لن يتمكنوا من الوصول إلى حسابهم نهائياً.`,
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
        title="توثيق"
        className="h-8 w-8 text-green-500 hover:bg-green-50 hover:text-green-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Approve')}
        disabled={isProcessing || company.status === 'Active'}
      >
        <Check className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="تعليق"
        className="h-8 w-8 text-orange-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Suspend')}
        disabled={
          isProcessing ||
          company.status === 'Suspended' ||
          company.status === 'Inactive'
        }
      >
        <Ban className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="رفض"
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Reject')}
        disabled={isProcessing || company.status === 'Rejected'}
      >
        <X className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="حظر / حذف"
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => handleActionClick('Delete')}
        disabled={isProcessing || company.status === 'Blocked'}
      >
        <Trash2 className="h-4 w-4" />
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

export const columns: ColumnDef<CompanyDto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
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
    accessorKey: 'companyName',
    header: 'اسم الشركة',
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex items-center gap-3 text-right">
          <Avatar className="h-9 w-9 border">
            <AvatarImage
              src={company.logoUrl || '/User-icon.webp'}
              alt={company.companyName}
            />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {company.companyName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {company.companyName}
            </span>
            <span className="text-muted-foreground text-xs">
              {company.industry}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'البريد الإلكتروني',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right">
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'رقم الهاتف',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right" dir="ltr">
        {row.getValue('phoneNumber')}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ التسجيل',
    cell: ({ row }) => {
      const dateStr = row.getValue('createdAt') as string
      try {
        const date = new Date(dateStr)
        return (
          <div className="text-muted-foreground text-right">
            {date.toLocaleDateString('en-CA')}
          </div>
        )
      } catch {
        return <div className="text-muted-foreground text-right">{dateStr}</div>
      }
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center">الحالة</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      switch (status) {
        case 'Active':
          return (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                موثقة
              </span>
            </div>
          )
        case 'PendingApproval':
          return (
            <div className="flex items-center justify-center">
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                في انتظار التوثيق
              </span>
            </div>
          )
        case 'Suspended':
          return (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                معلّقة
              </span>
            </div>
          )
        case 'Inactive':
          return (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                غير نشطة
              </span>
            </div>
          )
        case 'Rejected':
          return (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                مرفوضة
              </span>
            </div>
          )
        case 'Blocked':
          return (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                محظورة
              </span>
            </div>
          )
        default:
          return <div className="text-center">{status}</div>
      }
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">الإجراءات</div>,
    cell: ({ row }) => <ActionCell company={row.original} />,
  },
]
