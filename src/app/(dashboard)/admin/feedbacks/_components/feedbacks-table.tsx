'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import type { ColumnDef } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  AlertCircleIcon,
  CheckCircle2,
  LightbulbIcon,
  Loader2,
  MessageSquare,
  Monitor,
  SearchIcon,
  Smartphone,
  Trash2,
  User,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import type { FeedbackResponseDTO } from '@/services/feedback-service'

interface FeedbacksTableProps {
  feedbacks: FeedbackResponseDTO[]
  isLoading: boolean
  isMarking: boolean
  isDeleting: boolean
  selectedType?: number
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  onOpenFeedback: (feedback: FeedbackResponseDTO) => void
  onMarkAsRead: (id: number) => void
  onDeleteRequest: (id: number) => void
}

const getTypeIcon = (typeName: string) => {
  if (typeName === 'FeatureRequest') return <LightbulbIcon className="size-4" />
  if (typeName === 'Complaint') return <AlertCircleIcon className="size-4" />
  return <MessageSquare className="size-4" />
}

const getBadgeVariant = (typeName: string) => {
  if (typeName === 'FeatureRequest') return 'default'
  if (typeName === 'Complaint') return 'destructive'
  return 'secondary'
}

const getReviewerTypeName = (type?: string) => {
  const t = (type || '').trim().toLowerCase()
  if (t === 'company') return 'شركة'
  if (t === 'candidate') return 'مستخدم'
  return type || 'مجهول'
}

const getReviewerIcon = (type?: string) => {
  const t = (type || '').trim().toLowerCase()
  if (t === 'company') return <Monitor className="size-4" />
  if (t === 'candidate') return <User className="size-4" />
  return <Smartphone className="size-4" />
}

const getFeedbackTypeLabel = (typeName: string) => {
  if (typeName === 'FeatureRequest') return 'اقتراح'
  if (typeName === 'Complaint') return 'شكوى'
  return typeName
}

export function FeedbacksTable({
  feedbacks,
  isLoading,
  isMarking,
  isDeleting,
  selectedType,
  sorting,
  setSorting,
  onOpenFeedback,
  onMarkAsRead,
  onDeleteRequest,
}: FeedbacksTableProps) {
  const columns = React.useMemo<ColumnDef<FeedbackResponseDTO>[]>(
    () => [
      {
        accessorKey: 'reviewerName',
        header: 'المرسل',
        cell: ({ row }) => {
          const feedback = row.original

          return (
            <div className="flex w-full items-center justify-start gap-3">
              <Avatar className="border-border/50 size-10 border shadow-sm transition-transform group-hover:scale-105">
                <AvatarImage
                  src={feedback.logoUrl && !feedback.logoUrl.includes('User-icon.webp') ? feedback.logoUrl : undefined}
                  alt={feedback.reviewerName}
                  className="object-cover"
                />
                <AvatarFallback
                  className={cn(
                    'text-sm font-bold',
                    !feedback.isRead
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {feedback.reviewerName?.charAt(0).toUpperCase() || 'م'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-right">
                <span className="text-foreground line-clamp-1 font-semibold">
                  {feedback.reviewerName}
                </span>
                <span className="text-muted-foreground mt-0.5 text-xs">
                  {feedback.reviewerEmail}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'feedbackTypeName',
        header: 'النوع',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge
              variant={getBadgeVariant(row.original.feedbackTypeName)}
              className="flex w-fit items-center gap-1.5"
            >
              {getTypeIcon(row.original.feedbackTypeName)}
              <span>{getFeedbackTypeLabel(row.original.feedbackTypeName)}</span>
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: 'reviewerType',
        header: 'نوع المرسل',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="bg-muted/30 flex w-fit items-center gap-1.5"
            >
              {getReviewerIcon(row.original.reviewerType)}
              <span>{getReviewerTypeName(row.original.reviewerType)}</span>
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: 'message',
        header: 'الرسالة',
        cell: ({ row }) => {
          const message = row.original.message || ''

          return (
            <p className=" mx-auto line-clamp-2 max-w-[400px] text-center text-sm leading-relaxed">
              {message.length > 50 ? `${message.substring(0, 30)}...` : message}
            </p>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'التاريخ',
        cell: ({ row }) => (
          <span className="text-sm">
            {new Date(row.original.createdAt).toLocaleDateString('en-CA')}
          </span>
        ),
      },
      {
        accessorKey: 'isRead',
        header: 'الحالة',
        cell: ({ row }) =>
          row.original.isRead ? (
            
              <Badge variant="secondary" className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-black dark:bg-gray-700 dark:text-white">
                <span>مقروءة</span>
              </Badge>
            
          ) : (

            <Badge variant="secondary" className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-800  dark:bg-blue-900 dark:text-blue-200">
             <div className="bg-primary size-1.5 animate-pulse rounded-full" />
              <span>جديدة</span>
            </Badge>
          ),
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const feedback = row.original

          return (
            <TooltipProvider>
              <div className="flex items-center justify-center gap-2">
                <Tooltip delayDuration={700} disableHoverableContent={true}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:bg-primary/10 hover:text-primary relative z-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAsRead(feedback.id)
                      }}
                      disabled={isMarking || feedback.isRead}
                    >
                      <CheckCircle2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">تحديد كمقروءة</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={700} disableHoverableContent={true}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive relative z-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteRequest(feedback.id)
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">حذف الملاحظة</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )
        },
        enableSorting: false,
      },
    ],
    [isDeleting, isMarking, onDeleteRequest, onMarkAsRead],
  )

  const columnAlignments: Record<string, 'right' | 'center'> = {
    reviewerName: 'center',
    feedbackTypeName: 'center',
    reviewerType: 'center',
    message: 'center',
    createdAt: 'center',
    isRead: 'center',
  }

  const table = useReactTable({
    data: feedbacks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: true,
    maxMultiSortColCount: columns.length,
    state: {
      sorting,
    },
  })

  if (!isLoading && feedbacks.length === 0) {
    return (
      <div className="flex min-h-[385px] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="relative flex size-16 items-center justify-center">
          <SearchIcon className="size-12 text-slate-200 dark:text-slate-700" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium tracking-tight text-slate-600 dark:text-slate-400">
            لا توجد ملاحظات
          </p>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            {selectedType
              ? 'لم يتم العثور على ملاحظات تطابق النوع المحدد. حاول إزالة التصفية.'
              : 'صندوق الملاحظات فارغ حالياً. ستظهر ملاحظات الشركات هنا فور إرسالها.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-full overflow-y-auto">
      <Table>
        <TableHeader className="dark:bg-muted/50 sticky top-0 z-10 bg-slate-50 shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-5 font-medium text-slate-700 ${columnAlignments[header.column.id] === 'right' ? 'text-right' : 'text-center'
                    }`}
                >
                  {header.isPlaceholder
                    ? null
                    : header.column.getCanSort() ? (
                      <div
                        className={`flex items-center gap-1 cursor-pointer select-none hover:text-primary transition-colors group ${columnAlignments[header.column.id] === 'right' ? 'justify-start' : 'justify-center'
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
                {columns.map((column, colIndex) => {
                  const colId = (column.id || (column as any).accessorKey) as string
                  return (
                    <TableCell
                      key={colIndex}
                      className={`px-5 align-middle ${colId && columnAlignments[colId] === 'right' ? 'text-right' : 'text-center'
                        }`}
                    >
                      <Skeleton className="h-5 w-2/3 mx-auto rounded-md" />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className=
                " h-16 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-black/20"


                onClick={() => {
                  onOpenFeedback(row.original)
                  if (!row.original.isRead) onMarkAsRead(row.original.id)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`px-5 align-middle ${columnAlignments[cell.column.id] === 'right' ? 'text-right' : 'text-center'
                      }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )))}
        </TableBody>
      </Table>
    </div>
  )
}
