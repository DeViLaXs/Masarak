'use client'

import React, { useMemo } from 'react'
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import {
    UsersIcon,
    BriefcaseIcon,
    Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { JobListItemDto } from '@/services/job-service'
import { Card } from '@/components/ui/card'

// --- Arabic Translation Helpers ---

export const formatJobType = (type: string) => {
    const map: Record<string, string> = {
        FullTime: 'دوام كامل',
        PartTime: 'دوام جزئي',
        Remote: 'عن بعد',
        Hybrid: 'هجين',
        Contract: 'عقد',
        Freelance: 'عمل حر',
        Internship: 'تدريب',
    }
    return map[type] || type
}

export const formatLocationType = (type: string) => {
    const map: Record<string, string> = {
        OnSite: 'حضوري',
        Remote: 'عن بعد',
        Hybrid: 'هجين',
    }
    return map[type] || type
}

const statusMap: Record<string, { label: string; className: string }> = {
    Published: {
        label: 'نشطة',
        className:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    Closed: {
        label: 'غير نشطة',
        className: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    },
    Expired: {
        label: 'منتهية',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    Filled: {
        label: 'تم التعيين',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
}

interface ManageJobTableProps {
    data: JobListItemDto[]
    isPending: boolean
    page: number
    totalPages: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    isUpdating: boolean
    isUpdatingJob: boolean
    handleStatusChange: (id: number, newStatus: 'Published' | 'Closed') => void
    handleReschedule: (id: number, newDate: Date) => void
}

export function ManageJobTable({
    data,
    isPending,
    page,
    totalPages,
    setPage,
    isUpdating,
    isUpdatingJob,
    handleStatusChange,
    handleReschedule,
}: ManageJobTableProps) {

    // --- Column Definitions ---

    const columns = useMemo<ColumnDef<JobListItemDto>[]>(
        () => [
            {
                accessorKey: 'title',
                size: 250,
                header: () => <div className="font-medium">عنوان الوظيفة</div>,
                cell: ({ row }) => (
                    <div className="max-w-[250px]">
                        <div className="mb-1 truncate text-base text-foreground">
                            {row.original.title}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'jobType',
                size: 120,
                header: () => <div className="text-center font-medium">نوع الدوام</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold ">
                            {formatJobType(row.original.jobType)}
                        </span>
                    </div>
                ),
            },
            {
                id: 'salary',
                size: 160,
                header: () => <div className="text-center font-medium">الراتب</div>,
                cell: ({ row }) => (
                    <div className="text-center font-medium whitespace-nowrap text-slate-600">
                        {row.original.minSalary.toLocaleString()} -{' '}
                        {row.original.maxSalary.toLocaleString()} ريال
                    </div>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'postedDate',
                size: 120,
                header: () => (
                    <div className="text-center font-medium">تاريخ النشر</div>
                ),
                cell: ({ row }) => (
                    <div className="text-center font-medium whitespace-nowrap text-slate-500">
                        {format(new Date(row.original.postedDate), 'yyyy-MM-dd')}
                    </div>
                ),
            },
            {
                accessorKey: 'expirationDate',
                size: 130,
                header: () => (
                    <div className="text-center font-medium">انتهاء الصلاحية</div>
                ),
                cell: ({ row }) => (
                    <div className="text-center font-medium whitespace-nowrap text-slate-500">
                        {format(new Date(row.original.expirationDate), 'yyyy-MM-dd')}
                    </div>
                ),
            },
            {
                accessorKey: 'applicantsCount',
                size: 90,
                header: () => <div className="text-center font-medium">المتقدمين</div>,
                cell: ({ row }) => (
                    <div className="mt-1 flex flex-col items-center justify-center gap-1 text-center font-bold text-slate-700">
                        <UsersIcon className="size-4 text-slate-400" />
                        <span>{row.original.applicantsCount}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                size: 110,
                header: () => <div className="text-center font-medium">الحالة</div>,
                cell: ({ row }) => {
                    const s = statusMap[row.original.status]
                    return (
                        <div className="text-center">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s?.className || 'bg-slate-100 text-slate-800'}`}
                            >
                                {s?.label || row.original.status}
                            </span>
                        </div>
                    )
                },
            },
            {
                id: 'actions',
                size: 160,
                header: () => <div className="text-center font-medium">الإجراءات</div>,
                cell: ({ row }) => {
                    const job = row.original
                    return (
                        <div className="flex items-center justify-center gap-3 text-sm font-semibold opacity-80 transition-opacity group-hover:opacity-100">
                            <a
                                href={`/company/manage-job/${job.id}`}
                                className="text-[#3b82f6] transition-colors hover:text-blue-700 hover:underline"
                            >
                                تعديل
                            </a>

                            {job.status === 'Published' && (
                                <button
                                    disabled={isUpdating || isUpdatingJob}
                                    onClick={() => handleStatusChange(job.id, 'Closed')}
                                    className="text-amber-500 transition-colors hover:text-amber-600 hover:underline disabled:opacity-50"
                                >
                                    إغلاق
                                </button>
                            )}

                            {job.status === 'Closed' && (
                                <button
                                    disabled={isUpdating || isUpdatingJob}
                                    onClick={() => handleStatusChange(job.id, 'Published')}
                                    className="text-emerald-500 transition-colors hover:text-emerald-600 hover:underline disabled:opacity-50"
                                >
                                    تنشيط
                                </button>
                            )}

                            {job.status === 'Expired' && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            disabled={isUpdating || isUpdatingJob}
                                            className="flex items-center gap-1 text-emerald-500 transition-colors hover:text-emerald-600 hover:underline disabled:opacity-50"
                                        >
                                            إعادة جدولة
                                            {isUpdatingJob && (
                                                <Loader2 className="size-3 animate-spin" />
                                            )}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(job.expirationDate)}
                                            onSelect={(date) => {
                                                if (date) {
                                                    handleReschedule(job.id, date)
                                                }
                                            }}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    )
                },
                enableSorting: false,
            },
        ],
        [isUpdating, isUpdatingJob, handleStatusChange, handleReschedule],
    )

    // --- TanStack Table Instance ---

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: totalPages,
    })

    return (
        <Card className="border-border/40 shadow-sm overflow-hidden pt-2 pb-2">
            <div className="space-y-2">
                <div className='pb-2'></div>

                <div className="bg-white dark:bg-transparent max-h-[460px] overflow-y-auto relative w-full overflow-x-auto">
                    <table className="w-full caption-bottom text-sm">
                        <TableHeader className="sticky top-0 z-10 bg-slate-50 dark:bg-muted/50  shadow-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="text-center bg-[#f8fafc] dark:bg-muted dark:text-muted-foreground sticky top-0 z-10"
                                                style={{
                                                    width: header.getSize(),
                                                    minWidth: header.getSize(),
                                                }}
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
                            {isPending ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-[300px] p-8 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                            <Loader2 className="mb-4 size-8 animate-spin text-blue-500" />
                                            <p>جاري جلب بيانات الوظائف...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-[300px] p-8 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                            <BriefcaseIcon className="mb-4 h-12 w-12 text-slate-200 dark:text-slate-700" />
                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                لا توجد وظائف متاحة
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="text-center"
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
                    </table>
                </div>

                {/* Pagination */}

                <div className="flex items-center justify-end px-6 pt-2 border-t">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isPending}
                        >
                            السابق
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || isPending}
                        >
                            التالي
                        </Button>
                    </div>
                </div>

            </div>
        </Card >
    )
}
