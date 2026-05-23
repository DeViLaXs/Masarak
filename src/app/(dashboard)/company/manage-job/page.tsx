'use client'

import React, { useState } from 'react'
import {
    useCompanyJobs,
    useUpdateJobStatus,
    useJobs,
    useJobLookups,
} from '@/hooks/use-jobs'
import { useDebounce } from 'use-debounce'
import {
    SearchIcon,
    PlusIcon,
    X,
} from 'lucide-react'
import { gooeyToast } from "@/components/ui/goey-toaster"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
import Link from 'next/link'
import { ManageJobTable, formatJobType } from './_components/manage-job-table'
import { motion } from 'framer-motion'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        }
    }
} as const

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
} as const


export default function ManageJobPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch] = useDebounce(searchQuery, 500)
    const [statusTab, setStatusTab] = useState('all')
    const [jobTypeFilter, setJobTypeFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [sorting, setSorting] = useState<any[]>([])

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
                    if (newStatus === 'Published') {
                        gooeyToast.success('تم تنشيط الوظيفة بنجاح')
                    } else {
                        gooeyToast.success('تم إغلاق الوظيفة بنجاح')
                    }
                    refetch()
                },
                onError: () => {
                    gooeyToast.error('حدث خطأ أثناء تحديث حالة الوظيفة')
                }
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
                                gooeyToast.success('تم تعديل الموعد بنجاح')
                                refetch()
                            },
                            onError: () => {
                                gooeyToast.error('حدث خطأ أثناء تنشيط الوظيفة بعد الجدولة')
                            }
                        },
                    )
                },
                onError: () => {
                    gooeyToast.error('حدث خطأ أثناء إعادة جدولة الوظيفة')
                }
            },
        )
    }

    const jobs = jobsData?.items || []
    const totalPages = jobsData?.totalPages || 1

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mx-auto w-full max-w-7xl space-y-4 px-6"
            dir="rtl"
        >
            {/* Filters Card */}
            <motion.div variants={itemVariants}>
                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md p-5 mb-2">
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

                            <div className="flex items-center gap-2 w-36 md:max-w-md md:flex-1 xl:max-w-xl">
                                <div className="relative flex-1">
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
                                {sorting.length > 0 && (
                                    <Button variant="outline" size="sm" onClick={() => setSorting([])} className="text-xs text-red-600 hover:text-red-500 hover:bg-red-50 hover:border-red-500 whitespace-nowrap h-10 px-2 shrink-0">
                                        <X className="w-3 h-3 ml-1" />
                                        مسح الفرز
                                    </Button>
                                )}
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
            </motion.div>

            {/* ManageJobs Table Card */}
            <motion.div variants={itemVariants}>
                <div className="border-border/40 dark:bg-card overflow-hidden rounded-3xl border bg-white shadow-sm">
                    <ManageJobTable
                        data={jobs}
                        isPending={isPending}
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        isUpdating={isUpdating}
                        isUpdatingJob={isUpdatingJob}
                        handleStatusChange={handleStatusChange}
                        handleReschedule={handleReschedule}
                        sorting={sorting}
                        setSorting={setSorting}
                    />
                </div>
            </motion.div>
        </motion.div>
    )
}
