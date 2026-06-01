'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { InterviewListItemDto } from '@/services/interview-service'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CalendarDays, CircleCheck, CircleX, FileText, Loader2, UserX, UserX2, X, Clock, RotateCcw, CheckCircle2, AlertCircle, MapPin, Video, Phone, ExternalLink, Eye, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

interface InterviewTableProps {
  data: InterviewListItemDto[]
  loading: boolean
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  setPage: (page: number | ((p: number) => number)) => void
  handleCancel: (id: number) => void
  handleComplete: (id: number) => void
  handleMissing: (id: number) => void
  handleReschedule: (intv: InterviewListItemDto) => void
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export function InterviewTable({
  data,
  loading,
  page,
  totalPages,
  totalCount,
  pageSize,
  setPage,
  handleCancel,
  handleComplete,
  handleMissing,
  handleReschedule,
  sorting,
  setSorting
}: InterviewTableProps) {
  const router = useRouter()
  const columns: ColumnDef<InterviewListItemDto>[] = [
    {
      accessorKey: 'candidateName',
      header: 'الاسم',
      cell: ({ row }) => <span className="font-semibold text-foreground pr-4">{row.original.candidateName}</span>
    },
    {
      accessorKey: 'jobTitle',
      header: 'الوظيفة',
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.jobTitle}</span>
    },
    {
      accessorKey: 'interviewDate',
      header: 'تاريخ ووقت المقابلة',
      cell: ({ row }) => (
        <span >
          {new Date(row.original.interviewDate).toLocaleString('en-US', { dateStyle: "medium", timeStyle: "short", })}
        </span>
      ),
    },
    {
      accessorKey: 'interviewType',
      header: 'النوع',
      cell: ({ row }) => {
        const type = row.original.interviewType;
        const translations: Record<string, string> = {
          'Online': 'عن بُعد',
          'InPerson': 'حضورياً',
          'Phone': 'هاتفية',
        };
        return <span className="text-foreground">{translations[type] || type}</span>;
      }
    },
    {
      accessorKey: 'interviewStatus',
      header: 'الحالة',
      cell: ({ row }) => {
        const status = row.original.interviewStatus;
        const translations: Record<string, string> = {
          'Scheduled': 'في انتظار الموافقة',
          'Completed': 'مكتملة',
          'Cancelled': 'ملغاة',
          'Confirmed': 'مؤكدة',
          'MissingInterview': 'لم يحضر',
          'Withdrawn': 'انسحب',
        };
        const displayStatus = translations[status] || status;

        let badgeColor = ""
        let Icon = Clock;

        if (status === 'Scheduled' || status === 'Confirmed') {
          badgeColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          Icon = status === 'Confirmed' ? CheckCircle2 : Clock
        } else if (status === 'Completed') {
          badgeColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          Icon = CheckCircle2
        } else if (status === 'Cancelled' || status === 'MissingInterview' || status === 'Withdrawn') {
          badgeColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          Icon = (status === 'MissingInterview') ? UserX : status === 'Withdrawn' ? UserX2 : CircleX
        }

        return (
          <Badge variant="secondary" className={`px-3 py-1 font-medium flex items-center gap-1.5 w-fit mx-auto ${badgeColor}`}>
            <Icon size={14} className="shrink-0" />
            <span>{displayStatus}</span>
          </Badge>
        )
      }
    },
    {
      accessorKey: 'location',
      header: 'الموقع',
      cell: ({ row }) => {
        const loc = row.original.location
        if (!loc) return <span className="text-muted-foreground">غير متاح</span>
        if (loc.startsWith('http')) {
          return (
            <a href={loc} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center justify-center gap-1.5">
              <Video size={14} />
              <span>رابط الاجتماع</span>
            </a>
          )
        }
        return (
          <div className="flex items-center justify-center gap-1.5 text-foreground mx-auto w-fit">
            <MapPin size={14} className="text-muted-foreground shrink-0" />
            <span className="truncate max-w-[200px] block">{loc.slice(0, 15) + "..."}</span>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => {
        const intv = row.original
        return (
          <TooltipProvider>
            <div className="flex items-center justify-center gap-2 ">
              <Tooltip disableHoverableContent={true} delayDuration={700}>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canComplete} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-green-600 hover:bg-green-100 hover:text-green-700 hover:dark:bg-green-700/30 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleComplete(intv.interviewId)}>
                      <CircleCheck size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">مكتمل</TooltipContent>
              </Tooltip>

              <Tooltip disableHoverableContent={true} delayDuration={700}>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canCancel} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-red-600 hover:bg-red-100 hover:dark:bg-red-800/30 hover:text-red-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleCancel(intv.interviewId)}>
                      <CircleX size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">إلغاء</TooltipContent>
              </Tooltip>

              <Tooltip disableHoverableContent={true} delayDuration={700}>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canMarkMissing} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-orange-600 hover:bg-orange-100 hover:dark:bg-orange-800/30 hover:text-orange-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleMissing(intv.interviewId)}>
                      <UserX size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">لم يحضر</TooltipContent>
              </Tooltip>

              <Tooltip disableHoverableContent={true} delayDuration={700}>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canReschedule} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 hover:dark:bg-blue-800/30 hover:text-blue-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleReschedule(intv)}>
                      <CalendarDays size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">إعادة جدولة</TooltipContent>
              </Tooltip>

            </div>
          </TooltipProvider>
        )
      }
    }
  ]

  const table = useReactTable({
    data,
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

  return (
    <div className="max-h-full overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-slate-50 dark:bg-muted shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-5 text-center font-medium text-slate-700"
                    style={{ minWidth: header.column.id === 'actions' ? '180px' : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.id !== 'actions' ? (
                        <div
                          className="flex items-center justify-center gap-1 cursor-pointer select-none hover:text-primary transition-colors group"
                          onClick={(e) => {
                            // Default to multi-sort if they click, so it's super easy
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
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className="h-16 text-center">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="px-5 text-center align-middle">
                    <Skeleton className="h-5 w-2/3 mx-auto rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-slate-50/80 dark:hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/company/interview/${row.original.interviewId}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-center"
                    onClick={(e) => {
                      if (cell.column.id === 'actions' || cell.column.id === 'location') {
                        e.stopPropagation()
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <FileText className="mb-4 h-12 w-12 text-slate-200 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    لا توجد مقابلات
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div
          className="border-border/60 text-muted-foreground flex items-center justify-between border-t px-6 py-3 text-sm"
          dir="rtl"
        >
          <div>
            عرض {(page - 1) * pageSize + 1} إلى{' '}
            {Math.min(page * pageSize, totalCount)} من أصل {totalCount} مقابلة
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              السابق
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    className="h-9 w-9 rounded-full p-0 shadow-sm"
                    disabled={loading}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              التالي
            </Button>
          </div>
        </div>
      )}

    </div >
  )
}
