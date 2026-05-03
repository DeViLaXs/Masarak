'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  SearchIcon,
  ChevronDownIcon,
  CalendarIcon,
  Clock,
  MapPin,
  Loader2,
  Video,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserX,
  CalendarCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import type { InterviewListItemDto } from '@/services/interview-service'
import {
  useInterviewStats,
  useInterviewsList,
  useUpdateInterviewStatus,
  useRescheduleInterview,
} from '@/hooks/use-interviews'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ============== Types ==============

type InterviewStatus = 1 | 2 | 3 | 4 | 5 | 6

// ============== Status Config ==============

const statusConfig: Record<
  InterviewStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  1: {
    label: 'مجدولة',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    icon: CalendarIcon,
  },
  2: {
    label: 'مكتملة',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    icon: CheckCircle2,
  },
  3: {
    label: 'ملغاة',
    className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    icon: XCircle,
  },
  4: {
    label: 'أُعيد جدولتها',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    icon: RotateCcw,
  },
  5: {
    label: 'لم يحضر',
    className: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20',
    icon: UserX,
  },
  6: {
    label: 'مؤكدة',
    className: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
    icon: CalendarCheck,
  },
}

// ============== Component ==============

export default function InterviewPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [rescheduleTime, setRescheduleTime] = useState('10:00')
  const pageSize = 10

  // ============== Queries ==============
  
  const { data: statsData } = useInterviewStats()

  const { data: interviewsData, isLoading } = useInterviewsList({
    searchTerm: debouncedSearch || undefined,
    statusId: statusFilter !== 'all' ? Number(statusFilter) : undefined,
    page,
    pageSize,
  })

  // ============== Mutations ==============
  
  const statusMutation = useUpdateInterviewStatus()
  const rescheduleMutation = useRescheduleInterview()

  const isUpdating = statusMutation.isPending || rescheduleMutation.isPending
  const paginatedInterviews = interviewsData?.items || []
  const totalPages = interviewsData?.totalPages || 1
  const totalCount = interviewsData?.totalCount || 0

  // Handlers
  const handleStatusChange = useCallback((interviewId: number, newStatusId: InterviewStatus) => {
    statusMutation.mutate(
      { id: interviewId, statusId: newStatusId },
      {
        onSuccess: () => toast.success('تم تحديث حالة المقابلة بنجاح'),
        onError: () => toast.error('حدث خطأ أثناء تحديث الحالة'),
      }
    )
  }, [statusMutation])

  const handleReschedule = useCallback((interviewId: number, newDate: Date, time: string) => {
    rescheduleMutation.mutate(
      { id: interviewId, newDate, time },
      {
        onSuccess: () => toast.success('تمت إعادة جدولة المقابلة بنجاح'),
        onError: () => toast.error('حدث خطأ أثناء إعادة الجدولة'),
      }
    )
  }, [rescheduleMutation])

  // ============== Column Definitions ==============

  const columns = useMemo<ColumnDef<InterviewListItemDto>[]>(
    () => [
      {
        accessorKey: 'candidateName',
        size: 220,
        header: () => <div className="font-medium">المرشح</div>,
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <div className="truncate text-sm font-bold text-slate-900">
              {row.original.candidateName}
            </div>
            <div className="truncate text-xs text-slate-500 mt-0.5">
              {row.original.candidateEmail}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'jobTitle',
        size: 180,
        header: () => <div className="font-medium">الوظيفة</div>,
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate text-sm text-slate-700">
            {row.original.jobTitle}
          </div>
        ),
      },
      {
        accessorKey: 'interviewDate',
        size: 130,
        header: () => <div className="text-center font-medium">التاريخ</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm font-medium whitespace-nowrap text-slate-600">
            <div className="flex items-center justify-center gap-1.5">
              <CalendarIcon className="size-3.5 text-slate-400" />
              {row.original.interviewDate ? format(new Date(row.original.interviewDate), 'yyyy/MM/dd') : '-'}
            </div>
          </div>
        ),
      },
      {
        id: 'interviewTime',
        size: 100,
        header: () => <div className="text-center font-medium">الوقت</div>,
        cell: ({ row }) => {
          const timeStr = row.original.interviewDate ? format(new Date(row.original.interviewDate), 'HH:mm') : '-'
          return (
            <div className="text-center text-sm font-medium whitespace-nowrap text-slate-600">
              <div className="flex items-center justify-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" />
                {timeStr}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'location',
        size: 180,
        header: () => <div className="font-medium">الموقع</div>,
        cell: ({ row }) => {
          const isRemote = row.original.interviewTypeName === 'Online'
          return (
            <div className="max-w-[180px] truncate text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                {isRemote ? (
                  <Video className="size-3.5 shrink-0 text-blue-500" />
                ) : (
                  <MapPin className="size-3.5 shrink-0 text-slate-400" />
                )}
                <span className="truncate" title={row.original.location || row.original.interviewTypeName}>
                  {row.original.location || row.original.interviewTypeName}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'statusId',
        size: 140,
        header: () => <div className="text-center font-medium">الحالة</div>,
        cell: ({ row }) => {
          const sid = row.original.statusId as InterviewStatus
          const s = statusConfig[sid] || { label: row.original.statusName, className: 'bg-slate-50 text-slate-700', icon: CalendarIcon }
          const Icon = s.icon
          return (
            <div className="text-center">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.className}`}
              >
                <Icon className="size-3" />
                {s.label}
              </span>
            </div>
          )
        },
      },
      {
        id: 'actions',
        size: 200,
        header: () => <div className="text-center font-medium">الإجراءات</div>,
        cell: ({ row }) => {
          const interview = row.original
          const sid = interview.statusId as InterviewStatus

          // Completed, Cancelled, No Show → read-only
          if (sid === 2 || sid === 3 || sid === 5) {
            return (
              <div className="text-center text-xs text-slate-400">
                لا توجد إجراءات
              </div>
            )
          }

          const currentInterviewTime = interview.interviewDate ? format(new Date(interview.interviewDate), 'HH:mm') : '10:00'

          return (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              {/* Confirm — only for Scheduled & Rescheduled */}
              {(sid === 1 || sid === 4) && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(interview.interviewId, 6)}
                  className="text-indigo-600 transition-colors hover:text-indigo-700 hover:underline disabled:opacity-50"
                >
                  تأكيد
                </button>
              )}

              {/* Complete — for Scheduled, Confirmed, Rescheduled */}
              {(sid === 1 || sid === 6 || sid === 4) && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(interview.interviewId, 2)}
                  className="text-emerald-600 transition-colors hover:text-emerald-700 hover:underline disabled:opacity-50"
                >
                  مكتملة
                </button>
              )}

              {/* Cancel — for Scheduled, Confirmed, Rescheduled */}
              {(sid === 1 || sid === 6 || sid === 4) && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(interview.interviewId, 3)}
                  className="text-red-500 transition-colors hover:text-red-600 hover:underline disabled:opacity-50"
                >
                  إلغاء
                </button>
              )}

              {/* No Show — for Scheduled, Confirmed, Rescheduled */}
              {(sid === 1 || sid === 6 || sid === 4) && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(interview.interviewId, 5)}
                  className="text-slate-500 transition-colors hover:text-slate-600 hover:underline disabled:opacity-50"
                >
                  لم يحضر
                </button>
              )}

              {/* Reschedule — for Scheduled, Confirmed, Rescheduled */}
              {(sid === 1 || sid === 6 || sid === 4) && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      disabled={isUpdating}
                      className="flex items-center gap-1 text-amber-600 transition-colors hover:text-amber-700 hover:underline disabled:opacity-50"
                    >
                      <RotateCcw className="size-3" />
                      إعادة جدولة
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto p-0 z-[100] bg-white border border-slate-200 shadow-xl rounded-xl">
                    <div className="p-3 border-b border-slate-100">
                      <label className="text-xs font-medium text-slate-600 block mb-1.5">
                        الوقت الجديد
                      </label>
                      <Input
                        type="time"
                        defaultValue={currentInterviewTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="p-3">
                      <Calendar
                        mode="single"
                        selected={interview.interviewDate ? new Date(interview.interviewDate) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            handleReschedule(interview.interviewId, date, rescheduleTime || currentInterviewTime)
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-0 border-0"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )
        },
        enableSorting: false,
      },
    ],
    [isUpdating, rescheduleTime, handleReschedule, handleStatusChange],
  )

  // ============== Table Instance ==============

  const table = useReactTable({
    data: paginatedInterviews,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  // Mapping string '1' to number 1 for statsData access
  const getStatCount = (sid: InterviewStatus) => {
    if (!statsData) return 0
    switch (sid) {
      case 1: return statsData.scheduled
      case 2: return statsData.completed
      case 3: return statsData.cancelled
      case 4: return statsData.rescheduled
      case 5: return statsData.noShow
      case 6: return statsData.confirmed
      default: return 0
    }
  }

  const allCount = statsData 
    ? statsData.scheduled + statsData.completed + statsData.cancelled + statsData.rescheduled + statsData.noShow + statsData.confirmed
    : 0

  return (
    <div className="mx-auto block max-w-[1200px] space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">إدارة المقابلات</h1>
        <p className="text-sm text-muted-foreground">
          جدولة ومتابعة مقابلات المرشحين
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {([1, 6, 2, 4, 3, 5] as InterviewStatus[]).map((sid) => {
          const cfg = statusConfig[sid]
          const Icon = cfg.icon
          const count = getStatCount(sid)
          return (
            <button
              key={sid}
              onClick={() => {
                setStatusFilter(statusFilter === String(sid) ? 'all' : String(sid))
                setPage(1)
              }}
              className={`rounded-xl border p-3 text-center transition-all hover:shadow-md ${
                statusFilter === String(sid)
                  ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50/50'
                  : 'bg-white hover:bg-slate-50/50'
              }`}
            >
              <Icon className={`mx-auto mb-1 size-5 ${
                sid === 1 ? 'text-blue-600' :
                sid === 2 ? 'text-emerald-600' :
                sid === 3 ? 'text-red-600' :
                sid === 4 ? 'text-amber-600' :
                sid === 5 ? 'text-slate-600' :
                'text-indigo-600'
              }`} />
              <div className="text-lg font-bold text-slate-800">
                {count}
              </div>
              <div className="text-xs text-slate-500">{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Filters Card */}
      <Card className="border-border/40 rounded-2xl bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="h-10 w-full appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 pr-4 pl-10 text-sm transition-colors outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-48"
                >
                  <option value="all">جميع الحالات ({allCount})</option>
                  <option value="1">مجدولة ({getStatCount(1)})</option>
                  <option value="6">مؤكدة ({getStatCount(6)})</option>
                  <option value="2">مكتملة ({getStatCount(2)})</option>
                  <option value="4">أُعيد جدولتها ({getStatCount(4)})</option>
                  <option value="3">ملغاة ({getStatCount(3)})</option>
                  <option value="5">لم يحضر ({getStatCount(5)})</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="relative w-full md:max-w-md md:flex-1 xl:max-w-xl">
              <SearchIcon className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="البحث عن مرشح أو وظيفة..."
                className="h-10 w-full rounded-full border-slate-200 bg-slate-50/50 pr-11 pl-4 shadow-none focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Table Card */}
      <Card className="border-border/40 overflow-hidden rounded-2xl bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-6 pt-6 pb-4">
          <CardTitle className="text-xl font-bold text-slate-800">
            قائمة المقابلات
            <span className="mr-2 text-sm font-normal text-slate-400">
              ({totalCount} مقابلة)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative min-h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          )}
          <div className="overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-[#f8fafc] text-slate-500"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="px-6 py-4 text-right"
                        style={{
                          width: header.getSize(),
                          minWidth: header.getSize(),
                        }}
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
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[300px] p-8 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <CalendarIcon className="mb-4 size-12 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-700">
                          لا توجد مقابلات
                        </h3>
                        <p className="mt-1 text-sm">
                          لم يتم العثور على أي مقابلات مطابقة لبحثك.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-6 py-4"
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            السابق
          </Button>
          <div className="flex items-center gap-2 px-4 text-sm font-medium text-slate-500">
            <span>{page}</span>
            <span>من</span>
            <span>{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  )
}
