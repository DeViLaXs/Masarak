'use client'

import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Ban, Check, Inbox, UserX } from 'lucide-react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useSubadmins, type SubAdminDto } from '@/hooks/use-subadmins'

interface SubadminsTableProps {
  data: SubAdminDto[]
  rowSelection: Record<string, boolean>
  onRowSelectionChange: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
}

const ActionCell = ({ subadmin }: { subadmin: SubAdminDto }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [actionType, setActionType] = React.useState<
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
    <TooltipProvider>
      <div
        className="flex items-center justify-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip delayDuration={700} disableHoverableContent={true}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-500 hover:bg-green-50 hover:text-green-600 disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => handleActionClick('Approve')}
              disabled={isProcessing || subadmin.status === 'Active'}
            >
              <Check className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">تنشيط</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={700} disableHoverableContent={true}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-orange-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => handleActionClick('Suspend')}
              disabled={isProcessing || subadmin.status === 'Suspended'}
            >
              <Ban className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">تعليق</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={700} disableHoverableContent={true}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => handleActionClick('Delete')}
              disabled={isProcessing || subadmin.status === 'Blocked'}
            >
              <UserX className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">حظر</TooltipContent>
        </Tooltip>
      </div>

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
    </TooltipProvider>
  )
}

const columns: ColumnDef<SubAdminDto>[] = [
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
      <div className="min-w-[150px] truncate text-right">
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: () => <div className="min-w-[120px] text-right">رقم الهاتف</div>,
    cell: ({ row }) => (
      <div className="min-w-[120px] text-right" dir="ltr">
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
          <div className="min-w-[120px] text-right">
            {date.toLocaleDateString('en-CA')}
          </div>
        )
      } catch {
        return (
          <div className="min-w-[120px] text-right">
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
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200">
                نشط
              </span>
            </div>
          )
        case 'Suspended':
          return (
            <div className="flex w-[120px] items-center justify-center">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900 dark:text-orange-200">
                معلّق
              </span>
            </div>
          )
        case 'Blocked':
          return (
            <div className="flex w-[120px] items-center justify-center">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200">
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

export function SubadminsTable({
  data,
  rowSelection,
  onRowSelectionChange,
}: SubadminsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange,
    state: {
      rowSelection,
    },
  })

  return (
    <div className="max-h-full overflow-y-auto">
      <Table>
        <TableHeader className="dark:bg-muted/50 sticky top-0 z-10 bg-slate-50 shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-5 text-center font-medium text-slate-700"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="group h-16 transition-colors hover:bg-slate-50 dark:hover:bg-black/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-5 text-center align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-[300px] p-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-400 dark:text-slate-500">
                  <Inbox className="h-12 w-12 text-slate-200 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    لا توجد مشرفين متاحين
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
