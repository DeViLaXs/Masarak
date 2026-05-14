'use client'

import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ApplicationListItemDto } from '@/services/application-service'
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
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FileText, Loader2, CircleX, CalendarDays, UserCheck } from 'lucide-react'

interface JobOrderTableProps {
  data: ApplicationListItemDto[]
  loading: boolean
  page: number
  totalPages: number
  setPage: (page: number | ((p: number) => number)) => void
  handleReject: (id: number) => void
  handleHire: (id: number) => void
  handleSchedule: (id: number) => void
}

export function JobOrderTable({
  data,
  loading,
  page,
  totalPages,
  setPage,
  handleReject,
  handleHire,
  handleSchedule
}: JobOrderTableProps) {
  const columns: ColumnDef<ApplicationListItemDto>[] = [
    {
      accessorKey: 'fullName',
      header: 'الاسم',
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center pr-4 ">
          {row.original.profilePhoto ? (
            <img src={row.original.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shadow-sm border border-primary/20">
              {row.original.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-semibold text-foreground text-center">{row.original.fullName}</span>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'البريد الالكتروني',
      cell: ({ row }) => <div className='w-full flex justify-center'><span className="text-muted-foreground">{row.original.email}</span></div>
    },
    {
      accessorKey: 'jobTitle',
      header: 'الوظيفة',
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.jobTitle}</span>
    },
    {
      accessorKey: 'matchingPercentage',
      header: 'نسبة المطابقة',
      cell: ({ row }) => {
        const match = row.original.matchingPercentage
        return match !== null ? (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {match}%
          </Badge>
        ) : (
          <span className="text-muted-foreground">غير متاح</span>
        )
      }
    },
    {
      accessorKey: 'applicationDate',
      header: 'التاريخ',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.original.applicationDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'applicationStatus',
      header: 'الحالة',
      cell: ({ row }) => {
        const status = row.original.applicationStatus;
        const translations: Record<string, string> = {
          'PendingReview': 'في قيد الانتظار',
          'Under Review': 'قيد المراجعة',
          'Shortlisted': 'في انتظار المقابلة',
          'Interviewing': 'في مرحلة المقابلة',
          'Rejected': 'مرفوض',
          'Hired': 'تم التوظيف',
          'Withdrawn': 'انسحب',

        };
        const displayStatus = translations[status] || status;

        let badgeColor = ""
        if (status === 'PendingReview' || status === 'Under Review') badgeColor = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-200"
        if (status === 'Shortlisted' || status === 'Interviewing') badgeColor = "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-200"
        if (status === 'Hired' || status === 'Accepted') badgeColor = "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200"
        if (status === 'Rejected' || status === 'Withdrawn') badgeColor = "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200"

        return <Badge variant="secondary" className={`px-3 py-1 font-medium ${badgeColor}`}>{displayStatus}</Badge>
      }
    },
    {
      id: 'cv',
      header: 'السيرة',
      cell: ({ row }) => {
        const url = row.original.cvDownloadUrl
        return url ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                  <a href={url} target="_blank" rel="noreferrer" download>
                    <FileText className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">تحميل السيرة الذاتية</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null
      }
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => {
        const app = row.original
        return (
          <TooltipProvider>
            <div className="flex gap-2 items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!app.canReject} variant="ghost" size="icon" onClick={() => handleReject(app.applicationId)} className="h-8 w-8 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed">
                      <CircleX size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">رفض</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!app.canSchedule} variant="ghost" size="icon" onClick={() => handleSchedule(app.applicationId)} className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed">
                      <CalendarDays size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">تحديد مقابلة</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled={!app.canHire} variant="ghost" size="icon" onClick={() => handleHire(app.applicationId)} className="h-8 w-8 rounded-full text-green-600 hover:bg-green-100 hover:text-green-700 disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed">
                      <UserCheck size={18} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">توظيف</TooltipContent>
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
    <Card className="border-border/40 shadow-sm overflow-hidden pt-2 pb-2">
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          <CardHeader className="border-b border-slate-100 dark:border-border pt-3 pb-2">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-foreground">
              طلبات التوظيف
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
                          style={{ minWidth: header.column.id === 'actions' ? '160px' : undefined }}
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
                          لا توجد طلبات توظيف
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
