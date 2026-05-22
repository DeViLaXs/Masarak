'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import type { ApplicationListItemDto } from '@/services/application-service'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  FileText,
  Loader2,
  Clock,
  CheckCircle2,
  UserCheck,
  CalendarDays,
  UserX,
  UserX2,
  CircleX,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

interface JobHistoryTableProps {
  data: ApplicationListItemDto[]
  loading: boolean
  page: number
  totalPages: number
  setPage: (page: number | ((p: number) => number)) => void
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

const statusTranslations: Record<string, string> = {
  PendingReview: 'قيد الانتظار',
  Shortlisted: 'انتظار المقابلة',
  Rejected: 'مرفوض',
  Hired: 'تم التوظيف',
  Withdrawn: 'انسحب',
  Interview: 'مقابلة',
  MissingInterview: 'لم يحضر المقابلة',
  Interviewed: 'تمت المقابلة',
}

export function JobHistoryTable({
  data,
  loading,
  page,
  totalPages,
  setPage,
  sorting,
  setSorting,
}: JobHistoryTableProps) {
  const router = useRouter()

  const columns: ColumnDef<ApplicationListItemDto>[] = [
    {
      accessorKey: 'fullName',
      header: 'الاسم',
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-3 pr-4">
          {row.original.profilePhoto ? (
            <img
              src={row.original.profilePhoto}
              alt="Profile"
              className="h-8 w-8 rounded-full border object-cover shadow-sm"
            />
          ) : (
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-xs font-semibold shadow-sm">
              {row.original.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-foreground text-center font-semibold">
            {row.original.fullName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'البريد الالكتروني',
      cell: ({ row }) => (
        <div className="flex w-full justify-center">
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'jobTitle',
      header: 'الوظيفة',
      cell: ({ row }) => (
        <span className="text-foreground font-medium">
          {row.original.jobTitle}
        </span>
      ),
    },
    {
      accessorKey: 'matchingPercentage',
      header: 'نسبة المطابقة',
      cell: ({ row }) => {
        const match = row.original.matchingPercentage
        if (match === null) {
          return <span className="text-muted-foreground">غير متاح</span>
        }

        let badgeColor = ''
        if (match >= 0 && match <= 24) {
          badgeColor =
            'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200'
        } else if (match >= 25 && match <= 49) {
          badgeColor =
            'bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900 dark:text-orange-200'
        } else if (match >= 50 && match <= 74) {
          badgeColor =
            'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-200'
        } else if (match >= 75 && match <= 100) {
          badgeColor =
            'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200'
        }

        return (
          <Badge
            variant="secondary"
            className={`px-2.5 py-0.5 font-medium ${badgeColor}`}
          >
            {match}%
          </Badge>
        )
      },
    },
    {
      accessorKey: 'applicationDate',
      header: 'تاريخ التقديم',
      cell: ({ row }) => (
        <span>
          {new Date(row.original.applicationDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'applicationStatus',
      header: 'الحالة',
      cell: ({ row }) => {
        const status = row.original.applicationStatus
        const displayStatus = statusTranslations[status] || status

        let badgeColor = ''
        let Icon = Clock

        if (status === 'PendingReview') {
          badgeColor =
            'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-200'
          Icon = Clock
        } else if (
          status === 'Shortlisted' ||
          status === 'Interview' ||
          status === 'Interviewed'
        ) {
          badgeColor =
            'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-200'
          Icon =
            status === 'Interview'
              ? CalendarDays
              : status === 'Interviewed'
                ? CheckCircle2
                : UserCheck
        } else if (status === 'Hired') {
          badgeColor =
            'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200'
          Icon = CheckCircle2
        } else if (
          status === 'Rejected' ||
          status === 'Withdrawn' ||
          status === 'MissingInterview'
        ) {
          badgeColor =
            'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-200'
          Icon =
            status === 'MissingInterview'
              ? UserX
              : status === 'Withdrawn'
                ? UserX2
                : CircleX
        }

        return (
          <Badge
            variant="secondary"
            className={`mx-auto flex w-fit items-center gap-1.5 px-3 py-1 font-medium ${badgeColor}`}
          >
            <Icon size={14} className="shrink-0" />
            <span>{displayStatus}</span>
          </Badge>
        )
      },
    },
    {
      id: 'cv',
      header: 'السيرة',
      cell: ({ row }) => {
        const url = row.original.cvDownloadUrl
        return url ? (
          <TooltipProvider>
            <Tooltip delayDuration={700} disableHoverableContent>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                  asChild
                >
                  <a href={url} target="_blank" rel="noreferrer" download>
                    <FileText className="h-5 w-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                تحميل السيرة الذاتية
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null
      },
    },
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
    <div className="max-h-full min-h-112.5 overflow-y-auto">
      <Table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-sm dark:bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-2 text-center font-medium text-slate-700"
                >
                  {header.isPlaceholder ? null : header.column.id !== 'cv' ? (
                    <div
                      className="group flex cursor-pointer select-none items-center justify-center gap-1 transition-colors hover:text-primary"
                      onClick={() => {
                        header.column.toggleSorting(undefined, true)
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <div className="flex items-center">
                        {{
                          asc: (
                            <ChevronDown className="h-4 w-4 rounded-sm bg-blue-100 text-blue-600" />
                          ),
                          desc: (
                            <ChevronUp className="h-4 w-4 rounded-sm bg-blue-100 text-blue-600" />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpDown className="h-4 w-4 opacity-30 group-hover:opacity-50" />
                        )}
                        {header.column.getIsSorted() && sorting.length > 1 && (
                          <span className="bg-primary/10 text-primary ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-bold">
                            {header.column.getSortIndex() + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
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
                  <Loader2 className="text-primary mb-4 size-8 animate-spin" />
                  <p>جاري جلب سجلات التوظيف...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-muted/50"
                onClick={() =>
                  router.push(`/company/job-order/${row.original.applicationId}`)
                }
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
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <FileText className="mb-4 h-12 w-12 text-slate-200 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    لا توجد سجلات توظيف
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end border-t px-6 pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  )
}
