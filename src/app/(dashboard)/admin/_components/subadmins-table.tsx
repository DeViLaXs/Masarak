'use client'

import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Ban, Check, Inbox, UserX, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useSubadmins, type SubAdminDto } from '@/hooks/use-subadmins'
import { cn } from '@/lib/utils'
import { gooeyToast as toast } from '@/components/ui/goey-toaster'

interface SubadminsTableProps {
  data: SubAdminDto[]
  rowSelection: Record<string, boolean>
  onRowSelectionChange: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  isLoading?: boolean
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
        toast.success(`تم تنشيط حساب المشرف الفرعي "${subadmin.name}" بنجاح`)
      } else if (actionType === 'Suspend') {
        await updateStatus({ id: subadmin.id, data: { status: 'Suspended' } })
        toast.success(`تم تعليق حساب المشرف الفرعي "${subadmin.name}" بنجاح`)
      } else if (actionType === 'Delete') {
        await deleteSubadmin(subadmin.id)
        toast.success(`تم حظر حساب المشرف الفرعي "${subadmin.name}" بنجاح`)
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء تنفيذ العملية')
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
          variant: 'green' as const,
        }
      case 'Suspend':
        return {
          title: 'تأكيد التعليق',
          description: `هل أنت متأكد من رغبتك في تعليق حساب المشرف الفرعي "${subadmin.name}"؟ لن يتمكن من تسجيل الدخول.`,
          confirmText: 'نعم، تعليق',
          variant: 'orange' as const,
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
    size: 50,
    header: ({ table }) => (
      <div className="w-[50px] mx-auto">
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
      <div className="w-[50px] mx-auto" onClick={(e) => e.stopPropagation()}>
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
    size: 200,
    header: () => 'اسم المشرف',
    cell: ({ row }) => {
      const subadmin = row.original
      return (
        <div className="flex w-full min-w-[200px] items-center justify-start gap-3 text-right">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="/masarak-logo-light.png" alt={subadmin.name} className="object-contain" />
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
    size: 180,
    header: () => 'البريد الإلكتروني',
    cell: ({ row }) => (
      <div className="w-full min-w-[150px] truncate text-right">
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    size: 130,
    header: () => 'رقم الهاتف',
    cell: ({ row }) => (
      <div className="w-full min-w-[120px] text-right" dir="ltr">
        {row.getValue('phoneNumber')}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    size: 130,
    header: () => 'تاريخ الإضافة',
    cell: ({ row }) => {
      const dateStr = row.getValue('createdAt') as string
      try {
        const date = new Date(dateStr)
        return (
          <div className="w-full min-w-[120px] text-right">
            {date.toLocaleDateString('en-CA')}
          </div>
        )
      } catch {
        return (
          <div className="w-full min-w-[120px] text-right">
            {dateStr}
          </div>
        )
      }
    },
  },
  {
    accessorKey: 'status',
    size: 120,
    header: () => 'الحالة',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      switch (status) {
        case 'Active':
          return (
            <div className="flex w-[120px] items-center justify-center mx-auto">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200">
                نشط
              </span>
            </div>
          )
        case 'Suspended':
          return (
            <div className="flex w-[120px] items-center justify-center mx-auto">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900 dark:text-orange-200">
                معلّق
              </span>
            </div>
          )
        case 'Blocked':
          return (
            <div className="flex w-[120px] items-center justify-center mx-auto">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200">
                محظور
              </span>
            </div>
          )
        default:
          return <div className="w-[120px] text-center mx-auto">{status}</div>
      }
    },
  },
  {
    id: 'actions',
    size: 120,
    header: () => 'الإجراءات',
    cell: ({ row }) => (
      <div className="w-[120px] mx-auto">
        <ActionCell subadmin={row.original} />
      </div>
    ),
    enableSorting: false,
  },
]

const columnAlignments: Record<string, 'right' | 'center'> = {
  name: 'right',
  email: 'right',
  phoneNumber: 'right',
  createdAt: 'right',
  status: 'center',
}

export function SubadminsTable({
  data,
  rowSelection,
  onRowSelectionChange,
  sorting,
  setSorting,
  isLoading = false,
}: SubadminsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: true,
    maxMultiSortColCount: columns.length,
    onRowSelectionChange,
    state: {
      rowSelection,
      sorting,
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
                  className={`dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-5 font-medium text-slate-700 ${
                    columnAlignments[header.column.id] === 'right' ? 'text-right' : 'text-center'
                  }`}
                  style={{
                    width: header.getSize(),
                    minWidth: header.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : header.column.getCanSort() ? (
                        <div
                          className={`flex items-center gap-1 cursor-pointer select-none hover:text-primary transition-colors group ${
                            columnAlignments[header.column.id] === 'right' ? 'justify-start' : 'justify-center'
                          }`}
                          onClick={(e) => {
                            header.column.toggleSorting(undefined, true)
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <div className="flex items-center">
                            {{
                              asc: <ChevronDown className="h-4 w-4 text-blue-600 bg-blue-100 rounded-sm" />,
                              desc: <ChevronUp className="h-4 w-4 text-blue-600 bg-blue-100 rounded-sm" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="h-4 w-4 opacity-30 group-hover:opacity-50" />
                            )}
                            {header.column.getIsSorted() && sorting.length > 1 && (
                              <span className="text-[10px] font-bold bg-primary/10 text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center ml-0.5">
                                {header.column.getSortIndex() + 1}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className="h-16 text-center">
                {table.getVisibleFlatColumns().map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={`px-5 align-middle ${
                      columnAlignments[column.id] === 'right' ? 'text-right' : 'text-center'
                    }`}
                    style={{
                      width: column.getSize(),
                      minWidth: column.getSize(),
                    }}
                  >
                    <Skeleton className="h-5 w-2/3 mx-auto rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="group h-16 transition-colors hover:bg-slate-50 dark:hover:bg-black/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`px-5 align-middle ${
                      columnAlignments[cell.column.id] === 'right' ? 'text-right' : 'text-center'
                    }`}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                    }}
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
