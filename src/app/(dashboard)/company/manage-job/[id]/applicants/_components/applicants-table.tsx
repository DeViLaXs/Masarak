'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  UsersIcon,
  FileText,
  Clock,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  CalendarDays,
  CheckCircle2,
  UserCheck,
  UserX,
  UserX2,
  CircleX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { JobApplicantDto } from '@/services/job-service'

const statusTranslations: Record<string, string> = {
  'PendingReview': 'قيد الانتظار',
  'Shortlisted': 'انتظار المقابلة',
  'Rejected': 'مرفوض',
  'Hired': 'تم التوظيف',
  'Withdrawn': 'انسحب',
  'Interview': 'مقابلة',
  'MissingInterview': 'لم يحضر المقابلة',
  'Interviewed': 'تمت المقابلة',
}

interface ApplicantsTableProps {
  data: JobApplicantDto[]
  loading: boolean
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  setPage: (page: number | ((p: number) => number)) => void
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export function ApplicantsTable({
  data,
  loading,
  page,
  totalPages,
  totalCount,
  pageSize,
  setPage,
  sorting,
  setSorting,
}: ApplicantsTableProps) {
  const router = useRouter()

  const columns = useMemo<ColumnDef<JobApplicantDto>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'الاسم',
        cell: ({ row }) => (
          <div className="flex flex-row gap-3 items-center pr-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shadow-sm border border-primary/20 shrink-0">
              {row.original.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-foreground text-right">{row.original.fullName}</span>
          </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'البريد الالكتروني',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>
      },
      {
        accessorKey: 'matchingPercentage',
        header: 'نسبة المطابقة بـ AI',
        cell: ({ row }) => {
          const match = row.original.matchingPercentage
          if (match === null || match === undefined) {
            return <span className="text-muted-foreground">غير متاح</span>
          }

          let badgeColor = ""
          if (match >= 0 && match <= 24) {
            badgeColor = "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200"
          } else if (match >= 25 && match <= 49) {
            badgeColor = "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900 dark:text-orange-200"
          } else if (match >= 50 && match <= 74) {
            badgeColor = "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-200"
          } else if (match >= 75 && match <= 100) {
            badgeColor = "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200"
          }

          return (
            <Badge variant="secondary" className={`px-2.5 py-0.5 font-medium ${badgeColor}`}>
              {match}%
            </Badge>
          )
        }
      },
      {
        accessorKey: 'applicationDate',
        header: 'تاريخ التقديم',
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {new Date(row.original.applicationDate).toLocaleDateString('en-US', { dateStyle: "medium"})}
          </span>
        ),
      },
      {
        accessorKey: 'applicationStatus',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.original.applicationStatus
          const displayStatus = statusTranslations[status] || status

          let badgeColor = ""
          let Icon = Clock

          if (status === 'PendingReview') {
            badgeColor = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-200"
            Icon = Clock
          } else if (status === 'Shortlisted' || status === 'Interview' || status === 'Interviewed') {
            badgeColor = "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-200"
            Icon = status === 'Interview' ? CalendarDays : status === 'Interviewed' ? CheckCircle2 : UserCheck
          } else if (status === 'Hired') {
            badgeColor = "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200"
            Icon = CheckCircle2
          } else if (status === 'Rejected' || status === 'Withdrawn' || status === 'MissingInterview') {
            badgeColor = "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200"
            Icon = status === 'MissingInterview' ? UserX : status === 'Withdrawn' ? UserX2 : CircleX
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
        id: 'cv',
        header: 'السيرة',
        cell: ({ row }) => {
          const url = row.original.cvDownloadUrl
          return url ? (
            <TooltipProvider>
              <Tooltip delayDuration={700} disableHoverableContent={true}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8 rounded-full"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noreferrer" download onClick={(e) => e.stopPropagation()}>
                      <FileText className="w-5 h-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">تحميل السيرة الذاتية</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null
        }
      }
    ],
    []
  )

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
      <Table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-10 bg-slate-50 dark:bg-muted shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.id !== 'cv';
                return (
                  <TableHead
                    key={header.id}
                    className="dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-2 text-center font-medium text-slate-700"
                  >
                    {header.isPlaceholder ? null : isSortable ? (
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer select-none hover:text-primary transition-colors group"
                        onClick={() => header.column.toggleSorting(undefined, true)}
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
                      flexRender(header.column.columnDef.header, header.getContext())
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
              <TableRow key={rowIndex} className="h-16 text-center animate-pulse">
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
                className="hover:bg-slate-50/80 dark:hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/company/job-order/${row.original.applicationId}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-center"
                    onClick={(e) => {
                      if (cell.column.id === 'cv') {
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
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-6">
                  <UsersIcon className="mb-4 h-12 w-12 text-slate-200 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    لا يوجد متقدمين لهذه الوظيفة يطابقون خيارات البحث
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t px-6 py-3 text-sm" dir="rtl">
          <div>
            عرض {(page - 1) * pageSize + 1} إلى {Math.min(page * pageSize, totalCount)} من أصل {totalCount} متقدم
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              السابق
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
