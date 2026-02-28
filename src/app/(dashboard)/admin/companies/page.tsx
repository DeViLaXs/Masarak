'use client'

import { useState, useEffect } from 'react'
import CompaniesCard from '@/app/(dashboard)/admin/_components/companies-card'
import { DataTable } from '@/components/data-table'
import { columns } from '../_components/columns'
import { useAdmin } from '@/hooks/use-admin'
import { Input } from '@/components/ui/input'
import { Search, Check, X, Trash2, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [bulkActionType, setBulkActionType] = useState<
    'Approve' | 'Reject' | 'Suspend' | 'Delete' | null
  >(null)

  const router = useRouter()

  const { useCompanies, bulkAction, isExecutingBulkAction } = useAdmin()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  const {
    data: response,
    isLoading,
    error,
  } = useCompanies({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    status: statusFilter === 'All' ? undefined : statusFilter,
  })

  const companies = response?.data?.items || []
  const pag = response?.data

  const selectedRowsIndices = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  )
  const selectedCount = selectedRowsIndices.length

  const handleBulkActionClick = (
    type: 'Approve' | 'Reject' | 'Suspend' | 'Delete',
  ) => {
    setBulkActionType(type)
    setBulkActionDialogOpen(true)
  }

  const handleConfirmBulkAction = async () => {
    if (!bulkActionType) return

    const companyIds = selectedRowsIndices.map(
      (index) => companies[parseInt(index)].id,
    )

    try {
      await bulkAction({ companyIds, action: bulkActionType })
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
          title: 'تأكيد توثيق الشركات',
          description: `هل أنت متأكد من رغبتك في توثيق ${selectedCount} شركة/شركات المحددة؟`,
          confirmText: 'نعم، توثيق',
          variant: 'default' as const,
        }
      case 'Suspend':
        return {
          title: 'تأكيد تعليق الشركات',
          description: `هل أنت متأكد من رغبتك في تعليق ${selectedCount} شركة/شركات المحددة؟ لن يتمكنوا من تسجيل الدخول أو نشر وظائف.`,
          confirmText: 'نعم، تعليق',
          variant: 'destructive' as const,
        }
      case 'Reject':
        return {
          title: 'تأكيد رفض الشركات',
          description: `هل أنت متأكد من رغبتك في رفض ${selectedCount} شركة/شركات المحددة؟`,
          confirmText: 'نعم، رفض',
          variant: 'destructive' as const,
        }
      case 'Delete':
        return {
          title: 'تأكيد الحذف التلقائي',
          description: `هل أنت متأكد من رغبتك في حذف ${selectedCount} شركة/شركات المحددة؟ سيؤدي هذا الإجراء حالياً إلى تعليق هذه الحسابات (إخفائها وتعليق صلاحياتها) كإجراء أمان.`,
          confirmText: 'نعم، حذف',
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
      <CompaniesCard />

      <div className="mt-6 flex flex-col gap-4">
        {/* Search and Filters Bar */}
        <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
          {/* Search Input on the Right */}
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث عن الشركات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-gray-200 bg-white pr-9 pl-3 text-right"
              dir="rtl"
            />
          </div>

          {/* Status Filter on the Left */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[140px] cursor-pointer rounded-md border bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors outline-none hover:bg-gray-50"
              dir="rtl"
            >
              <option value="All">جميع الحالات</option>
              <option value="Active">موثقة (Active)</option>
              <option value="PendingApproval">
                في انتظار التوثيق (Pending)
              </option>
              <option value="Suspended">معلّقة (Suspended)</option>
              <option value="Inactive">غير نشطة (Inactive)</option>
              <option value="Rejected">مرفوضة (Rejected)</option>
              <option value="Blocked">محظورة (Blocked)</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedCount > 0 && (
          <div
            className="flex items-center justify-between rounded-xl border bg-blue-50/50 p-4 shadow-sm"
            dir="rtl"
          >
            <span className="text-sm font-medium text-blue-900">
              تم تحديد {selectedCount} شركات
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50"
                onClick={() => handleBulkActionClick('Approve')}
                disabled={isExecutingBulkAction}
              >
                <Check className="ml-2 h-4 w-4" />
                توثيق
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => handleBulkActionClick('Suspend')}
                disabled={isExecutingBulkAction}
              >
                <Ban className="ml-2 h-4 w-4" />
                تعليق
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-500 hover:bg-red-50"
                onClick={() => handleBulkActionClick('Reject')}
                disabled={isExecutingBulkAction}
              >
                <X className="ml-2 h-4 w-4" />
                رفض
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 bg-white text-red-600 hover:bg-red-50"
                onClick={() => handleBulkActionClick('Delete')}
                disabled={isExecutingBulkAction}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حظر / حذف
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
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <h2 className="text-right text-lg font-semibold text-gray-800">
              إدارة الشركات
            </h2>
          </div>

          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                جاري تحميل البيانات...
              </div>
            ) : (
              <div className="rounded-xl bg-white p-1 shadow-sm sm:p-4">
                <DataTable
                  columns={columns}
                  data={companies}
                  rowSelection={rowSelection}
                  onRowSelectionChange={setRowSelection}
                  onRowClick={(row) =>
                    router.push(`/admin/companies/${row.id}`)
                  }
                />
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pag && pag.totalPages > 1 && (
            <div
              className="flex items-center justify-between border-t p-4 text-sm text-gray-600"
              dir="rtl"
            >
              <div>
                عرض {(pag.currentPage - 1) * pag.pageSize + 1} إلى{' '}
                {Math.min(pag.currentPage * pag.pageSize, pag.totalCount)} من
                أصل {pag.totalCount} شركة
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
