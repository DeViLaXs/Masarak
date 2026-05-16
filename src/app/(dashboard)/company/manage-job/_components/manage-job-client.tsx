'use client'

import React, { useState, useMemo } from 'react'
import {
  useCompanyJobs,
  useUpdateJobStatus,
  useJobs,
  useJobLookups,
} from '@/hooks/use-jobs'
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
  UsersIcon,
  PlusIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  Loader2,
  CalendarIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import { Calendar } from '@/components/ui/calendar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { JobListItemDto } from '@/services/job-service'
import Link from 'next/link'

// --- Arabic Translation Helpers ---

const formatJobType = (type: string) => {
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

const formatLocationType = (type: string) => {
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

export default function ManageJobClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [statusTab, setStatusTab] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Fetch lookups
  const { jobTypes } = useJobLookups()

  // Fetch jobs
  const {
    data: jobsData,
    isPending,
    refetch,
  } = useCompanyJobs({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    status: statusTab !== 'all' ? statusTab : undefined,
    jobTypeId: jobTypeFilter !== 'all' ? parseInt(jobTypeFilter) : undefined,
  })

  // Mutations
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateJobStatus()
  const { updateJob, isUpdatingJob } = useJobs()

  // Handlers
  const handleStatusChange = (
    id: number,
    newStatus: 'Published' | 'Closed',
  ) => {
    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          refetch()
        },
      },
    )
  }

  const handleReschedule = (id: number, newDate: Date) => {
    updateJob(
      { id, data: { expirationDate: newDate.toISOString() } },
      {
        onSuccess: () => {
          updateStatus(
            { id, status: 'Published' },
            {
              onSuccess: () => {
                toast.success('تم إعادة الجدولة وتنشيط الوظيفة بنجاح')
                refetch()
              },
            },
          )
        },
      },
    )
  }

  const jobs = jobsData?.items || []
  const totalPages = jobsData?.totalPages || 1

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
    [isUpdating, isUpdatingJob],
  )

  // --- TanStack Table Instance ---

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-10 duration-500 p-3 md:p-8" dir="rtl">
      {/* Filters Card */}
      <Card className="border-border/40 rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
              <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
                <Combobox
                  value={{ id: statusTab, name: statusTab }}
                  onValueChange={(val: any) => {
                    setPage(1)
                    if (!val) setStatusTab('all')
                    else setStatusTab(val.id)
                  }}
                  filter={null}
                  itemToStringLabel={(item: any) => { 
                    if (!item) return ''
                    const map: any = {
                      'all': 'جميع الحالات',
                      'Published': 'نشطة',
                      'Closed': 'غير نشطة (مغلقة)',
                      'Expired': 'منتهية'
                    }
                    return map[item.id] || item.id
                  }}
                >
                  <ComboboxInput
                    placeholder="جميع الحالات"
                    className="bg-background w-full border-none focus:ring-0 px-3 text-sm h-full cursor-pointer"
                    readOnly
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 'all', name: 'all' }}>جميع الحالات</ComboboxItem>
                      <ComboboxItem value={{ id: 'Published', name: 'Published' }}>نشطة</ComboboxItem>
                      <ComboboxItem value={{ id: 'Closed', name: 'Closed' }}>غير نشطة (مغلقة)</ComboboxItem>
                      <ComboboxItem value={{ id: 'Expired', name: 'Expired' }}>منتهية</ComboboxItem>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden  border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
                <Combobox
                  value={{ id: jobTypeFilter, name: jobTypeFilter }}
                  onValueChange={(val: any) => {
                    setPage(1)
                    if (!val) setJobTypeFilter('all')
                    else setJobTypeFilter(val.id)
                  }}
                  filter={null}
                  itemToStringLabel={(item: any) => {
                    if (!item || item.id === 'all') return 'نوع الدوام'
                    const match = jobTypes?.find(t => t.id.toString() === item.id)
                    return match ? formatJobType(match.name) : 'نوع الدوام'
                  }}
                >
                  <ComboboxInput
                    placeholder="نوع الدوام"
                    className="bg-background w-full border-none outline-none focus:ring-0 px-4 text-sm h-full cursor-pointer"
                    readOnly
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 'all', name: 'all' }}>نوع الدوام</ComboboxItem>
                      {jobTypes?.map((type) => (
                        <ComboboxItem key={type.id} value={{ id: type.id.toString(), name: type.name }}>
                          {formatJobType(type.name)}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <div className="relative w-full md:max-w-md md:flex-1 xl:max-w-xl">
              <SearchIcon className="absolute top-1/2 right-4 size-4 -translate-y-1/2 " />
              <Input
                placeholder="البحث عن وظيفة..."
                className="pr-10 h-10 shadow-sm rounded-lg bg-background"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="w-full shrink-0 md:w-auto">
              <Button
                asChild
                className="h-10 w-full rounded-xl bg-primary px-6 font-medium text-white shadow-sm hover:bg-primary/80 md:w-auto"
              >
                <Link href="/company/add-job">
                  <PlusIcon className="ml-2 size-5" />
                  إضافة وظيفة جديدة
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table Card */}
      <Card className="border-border/40 shadow-sm overflow-hidden pt-2 pb-2">
      
        <div className="space-y-2">
          <CardHeader className="border-b border-slate-100 dark:border-border pt-3 pb-2">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-foreground">
              قائمة الوظائف
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
            </Table>
          </div>
          </div>
        
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isPending}
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
            disabled={page === totalPages || isPending}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  )
}
