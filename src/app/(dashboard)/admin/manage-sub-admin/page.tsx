'use client'

import { useState, useEffect } from 'react'
import SubadminsCard from '@/app/(dashboard)/admin/_components/subadmins-card'
import { DataTable } from '@/components/data-table'
import { columns } from '../_components/subadmin-columns'
import { useSubadmins } from '@/hooks/use-subadmins'
import { useAuth } from '@/auth/use-auth'
import { Input } from '@/components/ui/input'
import { Search, Check, UserX, Ban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'

export default function ManageSubAdminPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [bulkActionType, setBulkActionType] = useState<
    'Approve' | 'Suspend' | 'Delete' | null
  >(null)

  const router = useRouter()
  const { role } = useAuth({ middleware: 'admin' })

  // Prevent SubAdmins from accessing this page
  useEffect(() => {
    if (role === 'SubAdmin') {
      router.replace('/admin')
    }
  }, [role, router])

  const { getSubadmins, bulkAction, isExecutingBulkAction } = useSubadmins()

  if (role === 'SubAdmin') {
    return null
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  const { data: response, isLoading } = getSubadmins({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    status: statusFilter === 'All' ? undefined : statusFilter,
  })

  // Access the wrapped data object
  const subadmins = response?.data?.items || []
  const pag = response?.data

  const selectedRowsIndices = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  )
  const selectedCount = selectedRowsIndices.length

  const handleBulkActionClick = (type: 'Approve' | 'Suspend' | 'Delete') => {
    setBulkActionType(type)
    setBulkActionDialogOpen(true)
  }

  const handleConfirmBulkAction = async () => {
    if (!bulkActionType) return

    const subadminIds = selectedRowsIndices.map(
      (index) => subadmins[parseInt(index)].id,
    )

    try {
      await bulkAction({ ids: subadminIds, action: bulkActionType })
      setRowSelection({}) // clear selection after action
    } finally {
      setBulkActionDialogOpen(false)
      setBulkActionType(null)
    }
  }

  const getBulkDialogContent = () => {
    switch (bulkActionType) {
      case 'Approve':
        return {
          title: 'تأكيد التنشيط',
          description: `هل أنت متأكد من رغبتك في تنشيط ${selectedCount} مشرف/مشرفين محددين؟`,
          confirmText: 'نعم، تنشيط',
          variant: 'default' as const,
        }
      case 'Suspend':
        return {
          title: 'تأكيد التعليق',
          description: `هل أنت متأكد من رغبتك في تعليق ${selectedCount} مشرف/مشرفين محددين؟ لن يتمكنوا من تسجيل الدخول.`,
          confirmText: 'نعم، تعليق',
          variant: 'destructive' as const,
        }
      case 'Delete':
        return {
          title: 'تأكيد الحظر',
          description: `هل أنت متأكد من رغبتك في حظر ${selectedCount} مشرف/مشرفين محددين؟`,
          confirmText: 'نعم، حظر',
          variant: 'destructive' as const,
        }
      default:
        return {
          title: '',
          description: '',
          confirmText: '',
          variant: 'default' as const,
        }
    }
  }

  const dialogContent = getBulkDialogContent()

  return (
    <div className="px-6 py-1 max-sm:p-4">
      <SubadminsCard />

      <div className="mt-6 flex flex-col gap-4">
        {/* Search and Filters Bar */}
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input and Add Button on the Right */}
          <div className="flex w-full max-w-md items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث عن المشرفين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background w-full pr-9 pl-3 text-right"
                dir="rtl"
              />
            </div>
            <Link href="/admin/create-sub-admin">
              <Button className="bg-primary hover:bg-primary/80 flex items-center gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                <span className="max-sm:hidden">إضافة مشرف</span>
              </Button>
            </Link>
          </div>

          {/* Status Filter on the Left */}
          <div className="flex items-center gap-2 max-sm:w-full">
            <span className="text-foreground text-sm font-medium whitespace-nowrap">
              الحالة:
            </span>
            <Combobox
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val || 'All')
                setPage(1)
              }}
            >
              <ComboboxTrigger className="bg-card flex h-10 w-full min-w-[140px] items-center justify-between rounded-lg border px-3 text-sm sm:w-[140px]">
                {statusFilter === 'All' && 'جميع الحالات'}
                {statusFilter === 'Active' && 'نشط (Active)'}
                {statusFilter === 'Suspended' && 'معلّق (Suspended)'}
                {statusFilter === 'Blocked' && 'محظور (Blocked)'}
              </ComboboxTrigger>
              <ComboboxContent className="w-[140px] p-0">
                <ComboboxList>
                  <ComboboxItem value="All">جميع الحالات</ComboboxItem>
                  <ComboboxItem value="Active">نشط (Active)</ComboboxItem>
                  <ComboboxItem value="Suspended">
                    معلّق (Suspended)
                  </ComboboxItem>
                  <ComboboxItem value="Blocked">محظور (Blocked)</ComboboxItem>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedCount > 0 && (
          <div
            className="flex items-center justify-between rounded-xl border bg-blue-50/50 p-4 shadow-sm dark:bg-blue-950/20"
            dir="rtl"
          >
            <span className="text-sm font-medium text-blue-900 dark:text-blue-400">
              تم تحديد {selectedCount} مشرفين
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 bg-transparent text-green-600 hover:bg-green-500/10 dark:border-green-900 dark:text-green-400"
                onClick={() => handleBulkActionClick('Approve')}
                disabled={isExecutingBulkAction}
              >
                <Check className="ml-2 h-4 w-4" />
                تنشيط
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 bg-transparent text-orange-600 hover:bg-orange-500/10 dark:border-orange-900 dark:text-orange-400"
                onClick={() => handleBulkActionClick('Suspend')}
                disabled={isExecutingBulkAction}
              >
                <Ban className="ml-2 h-4 w-4" />
                تعليق
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 bg-transparent text-red-600 hover:bg-red-500/10 dark:border-red-900 dark:text-red-400"
                onClick={() => handleBulkActionClick('Delete')}
                disabled={isExecutingBulkAction}
              >
                <UserX className="ml-2 h-4 w-4" />
                حظر
              </Button>
            </div>
          </div>
        )}

        {/* AlertDialog for bulk actions */}
        <AlertDialog
          open={bulkActionDialogOpen}
          onOpenChange={setBulkActionDialogOpen}
        >
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right">
                {dialogContent.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-right text-base text-gray-500">
                {dialogContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 flex flex-row items-center gap-3 sm:justify-end">
              <AlertDialogCancel disabled={isExecutingBulkAction}>
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleConfirmBulkAction()
                }}
                className="mt-0 sm:mt-0"
                variant={dialogContent.variant}
                disabled={isExecutingBulkAction}
              >
                {isExecutingBulkAction
                  ? 'جاري المعالجة...'
                  : dialogContent.confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Table Container */}
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="border-b p-4">
            <h2 className="text-right text-lg font-semibold">
              إدارة المشرفين الفرعيين
            </h2>
          </div>

          <div className="p-0">
            {isLoading ? (
              <div className="text-muted-foreground p-8 text-center">
                جاري تحميل البيانات...
              </div>
            ) : (
              <div className="bg-card rounded-xl p-1 shadow-sm sm:p-4">
                <DataTable
                  columns={columns}
                  data={subadmins}
                  rowSelection={rowSelection}
                  onRowSelectionChange={setRowSelection}
                />
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pag && pag.totalPages > 1 && (
            <div
              className="text-muted-foreground border-border flex items-center justify-between border-t p-4 text-sm"
              dir="rtl"
            >
              <div>
                عرض {(pag.currentPage - 1) * pag.pageSize + 1} إلى{' '}
                {Math.min(pag.currentPage * pag.pageSize, pag.totalCount)} من
                أصل {pag.totalCount} مشرف
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pag.currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  السابق
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pag.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === pag.currentPage ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pag.currentPage === pag.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
