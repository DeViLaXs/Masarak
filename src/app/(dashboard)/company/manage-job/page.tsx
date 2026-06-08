'use client'

import React, { useState } from 'react'
import {
    useCompanyJobs,
    useUpdateJobStatus,
    useJobs,
    useJobLookups,
    useJobStatistics,
} from '@/hooks/use-jobs'
import { useDebounce } from 'use-debounce'
import {
    SearchIcon,
    PlusIcon,
    X,
    Briefcase,
    Activity,
    Clock,
    FileText,
    CheckCircle2,
} from 'lucide-react'
import { gooeyToast } from "@/components/ui/goey-toaster"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxTrigger, ComboboxValue } from '@/components/ui/combobox'
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
    const { data: statsData, isPending: statsPending } = useJobStatistics()

    // Mutations
    const updateStatusMutation = useUpdateJobStatus()
    const updateStatus = updateStatusMutation.mutate
    const { updateJob, isUpdatingJob, updateJobVariables } = useJobs()

    const updatingStatusJobId = updateStatusMutation.isPending ? updateStatusMutation.variables?.id : undefined
    const updatingJobJobId = isUpdatingJob ? updateJobVariables?.id : undefined

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
            {
                id,
                data: {
                    expirationDate: new Date(
                        Date.UTC(
                            newDate.getFullYear(),
                            newDate.getMonth(),
                            newDate.getDate(),
                            12,
                            0,
                            0,
                        )
                    ).toISOString(),
                },
            },
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
            {/* Stats Cards Section */}
            <motion.div variants={itemVariants}>
                {statsPending ? (
                    <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1" dir="rtl">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i} className="relative overflow-hidden border-border/40 bg-white shadow-sm dark:bg-card">
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-4 w-24 rounded-full" />
                                </CardHeader>
                                <CardContent className="flex items-center justify-between pt-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-16 rounded-lg" />
                                        <Skeleton className="h-3 w-28 rounded-full" />
                                    </div>
                                    <Skeleton className="size-12 rounded-2xl" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1" dir="rtl">
                        {[
                            {
                                title: 'إجمالي الوظائف',
                                value: statsData?.totalJobs ?? 0,
                                icon: Briefcase,
                                colorClass: 'text-blue-500',
                                bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/25',
                                borderColorClass: 'hover:border-blue-300 dark:hover:border-blue-950',
                                gradientClass: 'from-blue-500/5 to-transparent',
                                description: 'إجمالي الوظائف المنشورة',
                            },
                            {
                                title: 'الوظائف النشطة',
                                value: statsData?.activeJobs ?? 0,
                                icon: Activity,
                                colorClass: 'text-emerald-500',
                                bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/25',
                                borderColorClass: 'hover:border-emerald-300 dark:hover:border-emerald-950',
                                gradientClass: 'from-emerald-500/5 to-transparent',
                                description: 'الوظائف المتاحة للتقديم حالياً',
                            },
                            {
                                title: 'الوظائف المنتهية',
                                value: statsData?.expiredJobs ?? 0,
                                icon: Clock,
                                colorClass: 'text-red-500',
                                bgColorClass: 'bg-red-500/10 dark:bg-red-500/25',
                                borderColorClass: 'hover:border-red-300 dark:hover:border-red-950',
                                gradientClass: 'from-red-500/5 to-transparent',
                                description: 'الوظائف المنتهية',
                            },
                            {
                                title: 'وظائف بدوام كامل',
                                value: statsData?.fullTimeJobs ?? 0,
                                icon: CheckCircle2,
                                colorClass: 'text-purple-500',
                                bgColorClass: 'bg-purple-500/10 dark:bg-purple-500/25',
                                borderColorClass: 'hover:border-purple-300 dark:hover:border-purple-950',
                                gradientClass: 'from-purple-500/5 to-transparent',
                                description: 'الوظائف بنظام الدوام الكامل',
                            },
                            {
                                title: 'وظائف بدوام جزئي',
                                value: statsData?.partTimeJobs ?? 0,
                                icon: FileText,
                                colorClass: 'text-amber-500',
                                bgColorClass: 'bg-amber-500/10 dark:bg-amber-500/25',
                                borderColorClass: 'hover:border-amber-300 dark:hover:border-amber-950',
                                gradientClass: 'from-amber-500/5 to-transparent',
                                description: 'الوظائف بنظام الدوام الجزئي',
                            },
                        ].map((card, idx) => {
                            const Icon = card.icon
                            return (
                                <Card
                                    key={idx}
                                    className={`group relative overflow-hidden border-border/40 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-card ${card.borderColorClass}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                                    <CardHeader className="relative z-10 pb-2">
                                        <CardTitle className="text-muted-foreground text-xs font-semibold max-sm:text-[11px] text-nowrap">
                                            {card.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10 flex items-center justify-between pt-2">
                                        <div className="space-y-1 flex-1">
                                            <span className={`text-3xl font-extrabold tracking-tight ${card.colorClass}`}>
                                                {card.value}
                                            </span>
                                            <p className="text-muted-foreground text-[10px] font-normal leading-none text-nowrap">
                                                {card.description}
                                            </p>
                                        </div>
                                        <div className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${card.bgColorClass}`}>
                                            <Icon className={`size-6 ${card.colorClass}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* Filters Card */}
            <motion.div variants={itemVariants}>
                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md p-5 mb-2">
                    <CardContent>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
                                <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background dark:bg-input/30 border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
                                    <Combobox
                                        value={{ id: statusTab, name: statusTab }}
                                        onValueChange={(val: any) => {
                                            setPage(1)
                                            if (!val) setStatusTab('all')
                                            else setStatusTab(val.id)
                                        }}
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
                                        <ComboboxTrigger className="flex h-full w-full items-center justify-between gap-3 bg-transparent px-3 text-sm shadow-none border-none outline-none focus:ring-0 cursor-pointer">
                                            <ComboboxValue placeholder="جميع الحالات" />
                                        </ComboboxTrigger>
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
                                <div className="w-full md:w-[200px] shadow-sm rounded-lg overflow-hidden bg-background dark:bg-input/30 border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-10 flex items-center">
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
                                            className="bg-transparent w-full border-none outline-none focus:ring-0 px-4 text-sm h-full cursor-pointer"
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
                        totalCount={jobsData?.totalCount || 0}
                        pageSize={10}
                        setPage={setPage}
                        updatingStatusJobId={updatingStatusJobId}
                        updatingJobJobId={updatingJobJobId}
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
