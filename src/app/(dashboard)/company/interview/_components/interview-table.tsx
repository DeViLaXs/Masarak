'use client'

import React from 'react'
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
import { CalendarDays, CircleCheck, CircleX, FileText, Loader2, UserX, UserX2, X } from 'lucide-react'

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
          {new Date(row.original.interviewDate).toLocaleString('en-US', { dateStyle: "short", timeStyle: "short", })}
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
          'Canceled': 'ملغاة',
          'Rescheduled': 'معاد جدولتها',
          'No Show': 'لم يحضر'
        };
        const displayStatus = translations[status] || status;

        let badgeColor = ""
        if (status === 'Scheduled' || status === 'Rescheduled') badgeColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        if (status === 'Completed') badgeColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        if (status === 'Canceled' || status === 'No Show') badgeColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"

        return <Badge variant="secondary" className={`px-3 py-1 font-medium ${badgeColor}`}>{displayStatus}</Badge>
      }
    },
    {
      accessorKey: 'location',
      header: 'الموقع',
      cell: ({ row }) => {
        const loc = row.original.location
        if (!loc) return <span className="text-muted-foreground">غير متاح</span>
        if (loc.startsWith('http')) {
          return <a href={loc} target="_blank" rel="noreferrer" className="text-primary hover:underline">رابط الاجتماع</a>
        }
        return <span className="truncate max-w-[200px] block" title={loc}>{loc}</span>
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

              {/* <Tooltip>
                {intv.canComplete&& (
                <TooltipTrigger asChild>
                  <CircleCheck size={23} onClick={() => handleComplete(intv.interviewId)} className="rounded-full w-7 h-7 p-1 text-green-500 hover:bg-green-100 hover:text-green-800 transition duration-200 cursor-pointer" />
                </TooltipTrigger>
                )}
                <TooltipContent side="top" className="text-[12px]">مكتمل</TooltipContent>
              </Tooltip>

              <Tooltip>
                {intv.canCancel&& (
                <TooltipTrigger asChild>
                  <CircleX size={23} onClick={() => handleCancel(intv.interviewId)} className="rounded-full w-7 h-7 p-1 text-red-500 hover:bg-red-100 hover:text-red-800 transition duration-200 cursor-pointer" />
                </TooltipTrigger>
                )}
                <TooltipContent side="top" className="text-[10px]">إلغاء</TooltipContent>
              </Tooltip>

              <Tooltip>
                {intv.canMarkMissing&& (
                <TooltipTrigger asChild>
                  <UserX size={23} onClick={() => handleMissing(intv.interviewId)} className="rounded-full w-7 h-7 p-1 text-red-500 hover:bg-red-100 hover:text-red-800 transition duration-200 cursor-pointer" />
                </TooltipTrigger>
                )}
                <TooltipContent side="top" className="text-[9px]">لم يحضر</TooltipContent>
              </Tooltip>

              <Tooltip>
                {intv.canReschedule&& (
                <TooltipTrigger asChild>
                  <CalendarDays size={23} onClick={() => handleReschedule(intv)} className="rounded-full w-7 h-7 p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-800 transition duration-200 cursor-pointer" />
                </TooltipTrigger>
                )}
                <TooltipContent side="top" className="text-[9px]">إعادة جدولة</TooltipContent>
              </Tooltip> */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canComplete} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-green-600 hover:bg-green-100 hover:text-green-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleComplete(intv.interviewId)}>
                      <CircleCheck size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">مكتمل</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canCancel} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleCancel(intv.interviewId)}>
                      <CircleX size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">إلغاء</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canMarkMissing} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-orange-600 hover:bg-orange-100 hover:text-orange-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleMissing(intv.interviewId)}>
                      <UserX size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">لم يحضر</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!intv.canReschedule} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleReschedule(intv)}>
                      <CalendarDays size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">إعادة جدولة</TooltipContent>
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
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          <CardHeader className="border-b border-slate-100 dark:border-border pt-3 pb-2">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-foreground">
              جدول المقابلات
            </CardTitle>
          </CardHeader>

          <div className="bg-white dark:bg-transparent">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id} 
                          className="text-center bg-[#f8fafc] dark:bg-muted/50 dark:text-muted-foreground"
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-slate-50/80 dark:hover:bg-muted/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
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
          </div>
          <div className="flex items-center justify-end px-6 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                التالي
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
