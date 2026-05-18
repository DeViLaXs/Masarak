'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
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
import { CalendarDays, CircleCheck, CircleX, FileText, Loader2, UserX, UserX2, X, Clock, RotateCcw, CheckCircle2, AlertCircle, MapPin, Video, Phone, ExternalLink, Eye } from 'lucide-react'

interface InterviewTableProps {
  data: InterviewListItemDto[]
  loading: boolean
  page: number
  totalPages: number
  setPage: (page: number | ((p: number) => number)) => void
  handleCancel: (id: number) => void
  handleComplete: (id: number) => void
  handleMissing: (id: number) => void
  handleReschedule: (intv: InterviewListItemDto) => void
}

export function InterviewTable({
  data,
  loading,
  page,
  totalPages,
  setPage,
  handleCancel,
  handleComplete,
  handleMissing,
  handleReschedule
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
          'Scheduled': 'مجدولة',
          'Completed': 'مكتملة',
          'Cancelled': 'ملغاة',
          'Rescheduled': 'معاد جدولتها',
          'NoShow': 'لم يحضر',
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
        } else if (status === 'Rescheduled') {
          badgeColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          Icon = RotateCcw
        } else if (status === 'Completed') {
          badgeColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          Icon = CheckCircle2
        } else if (status === 'Cancelled' || status === 'NoShow' || status === 'MissingInterview' || status === 'Withdrawn') {
          badgeColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          Icon = (status === 'NoShow' || status === 'MissingInterview') ? UserX : status === 'Withdrawn' ? UserX2 : CircleX
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
  })

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden pt-2 pb-2">
      <div className="space-y-2">
        <div className='pb-2'>

        </div>

        <div className="bg-white dark:bg-transparent max-h-[460px] overflow-y-auto relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <TableHeader className="sticky top-0 z-10 bg-slate-50 dark:bg-muted shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-center bg-[#f8fafc] dark:bg-muted dark:text-muted-foreground sticky top-0 z-10"
                        style={{ minWidth: header.column.id === 'actions' ? '180px' : undefined }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[300px] p-8 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <Loader2 className="mb-4 size-8 animate-spin text-primary" />
                      <p>جاري جلب بيانات المقابلات...</p>
                    </div>
                  </TableCell>
                </TableRow>
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
          </table>
        </div>
        <div className="flex items-center justify-end px-6 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
