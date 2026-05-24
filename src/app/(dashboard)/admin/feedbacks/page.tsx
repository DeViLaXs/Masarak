'use client'

import * as React from 'react'
import {
  useFeedbacks,
  useFeedbackTypes,
  useMarkFeedbackAsRead,
  useDeleteFeedback,
  useSendFeedbackReply,
  useFeedbackStatistics,
} from '@/hooks/use-feedback'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox'
import { SortingState } from '@tanstack/react-table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { gooeyToast as toast } from '@/components/ui/goey-toaster'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import {
  AlertCircleIcon,
  LightbulbIcon,
  Loader2,
  Mail,
  MessageSquare,
  Monitor,
  Send,
  Smartphone,
  User,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FeedbackResponseDTO } from '@/services/feedback-service'
import { FeedbacksTable } from './_components/feedbacks-table'
import { FeedbackStats } from './_components/feedback-stats'

export default function FeedbacksClient() {
  const [selectedType, setSelectedType] = React.useState<number | undefined>(
    undefined,
  )
  const [isReadFilter, setIsReadFilter] = React.useState<boolean | undefined>(
    undefined,
  )
  const [viewFeedback, setViewFeedback] =
    React.useState<FeedbackResponseDTO | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(
    null,
  )
  const [pageNumber, setPageNumber] = React.useState(1)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { data: feedbacksData, isLoading: isFeedbacksLoading } = useFeedbacks(
    selectedType,
    isReadFilter,
    pageNumber,
  )
  const feedbacks = feedbacksData?.items || []

  const { data: feedbackTypes, isLoading: isTypesLoading } = useFeedbackTypes()

  const { data: statsData, isLoading: isStatsLoading } = useFeedbackStatistics()

  const { mutateAsync: markAsRead, isPending: isMarking } =
    useMarkFeedbackAsRead()
  const { mutateAsync: deleteFeedback, isPending: isDeleting } =
    useDeleteFeedback()
  const { mutateAsync: sendReply, isPending: isSendingReply } =
    useSendFeedbackReply()

  const [replyMessage, setReplyMessage] = React.useState('')
  const [isReplyDialogOpen, setIsReplyDialogOpen] = React.useState(false)

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id)
      toast.success('تم تحديد الرسالة كمقروءة')
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء تحديث الحالة')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFeedback(id)
      toast.success('تم حذف الرسالة بنجاح')
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء الحذف')
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('يرجى كتابة رسالة الرد')
      return
    }

    try {
      await sendReply({
        email: viewFeedback?.reviewerEmail || '',
        message: replyMessage,
      })
      toast.success('تم إرسال الرد بنجاح')
      setIsReplyDialogOpen(false)
      setReplyMessage('')
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء إرسال الرد')
    }
  }

  const getTypeIcon = (typeName: string) => {
    if (typeName === 'FeatureRequest')
      return <LightbulbIcon className="size-4" />
    if (typeName === 'Complaint') return <AlertCircleIcon className="size-4" />
    return <MessageSquare className="size-4" />
  }

  const getBadgeVariant = (typeName: string) => {
    if (typeName === 'FeatureRequest') return 'default'
    if (typeName === 'Complaint') return 'destructive'
    return 'secondary'
  }

  const getReviewerTypeName = (type?: string) => {
    const t = (type || '').trim().toLowerCase()
    if (t === 'company') return 'شركة'
    if (t === 'candidate') return 'مرشح'
    if (t === 'user') return 'مستخدم'
    return type || 'مجهول'
  }

  const isReadFilterOptions = React.useMemo(
    () => [
      { id: 'all', name: 'الكل' },
      { id: 'unread', name: 'غير مقروءة' },
      { id: 'read', name: 'مقروءة' },
    ],
    [],
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-5 px-6 pb-10 duration-500">
      <FeedbackStats isLoading={isStatsLoading} stats={statsData} />

      <div className="border-border/40 dark:bg-card relative overflow-hidden rounded-3xl border bg-white p-5 text-right shadow-sm">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {sorting.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSorting([])}
              className="text-xs text-red-600 hover:text-red-500 hover:bg-red-50 hover:border-red-500 whitespace-nowrap h-10 px-4 rounded-full shrink-0"
            >
              <X className="w-3 h-3 ml-1" />
              مسح الفرز
            </Button>
          )}
          

          <div className="flex w-full max-w-[520px] items-center gap-4 sm:mt-0">
            <div className="flex flex-1 flex-row gap-1.5">
              <label className="text-muted-foreground pr-1 text-xs font-semibold">
                نوع الملاحظة
              </label>
              <div className="w-full overflow-hidden rounded-full border border-slate-300 bg-transparent shadow-none dark:border-slate-600">
                <Combobox
                  value={
                    selectedType === undefined
                      ? { id: 0, name: 'الكل' }
                      : feedbackTypes?.find((t) => t.id === selectedType) ||
                        null
                  }
                  onValueChange={(val: any) => {
                    setPageNumber(1)
                    if (!val || val.id === 0) setSelectedType(undefined)
                    else setSelectedType(val.id)
                  }}
                  filter={null}
                  itemToStringLabel={(item: any) => {
                    if (!item) return ''
                    if (item.name === 'FeatureRequest') return 'اقتراح ميزة'
                    if (item.name === 'Complaint') return 'شكوى'
                    return item.name === 'الكل' ? 'الكل' : item.name
                  }}
                >
                  <ComboboxInput
                    placeholder="تصفية حسب النوع..."
                    className="h-10 w-full border-none bg-transparent px-6 text-sm focus:ring-0"
                    disabled={isTypesLoading}
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 0, name: 'الكل' }}>
                        الكل
                      </ComboboxItem>
                      {feedbackTypes?.map((type) => (
                        <ComboboxItem key={type.id} value={type}>
                          {type.name === 'FeatureRequest'
                            ? 'اقتراح ميزة'
                            : type.name === 'Complaint'
                              ? 'شكوى'
                              : type.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <div className="flex flex-1 flex-row gap-1.5">
              <label className="text-muted-foreground pr-1 text-xs font-semibold">
                حالة القراءة
              </label>
              <div className="w-full overflow-hidden rounded-full border border-slate-300 bg-transparent shadow-none dark:border-slate-600">
                <Combobox
                  value={isReadFilterOptions.find(
                    (f) =>
                      f.id ===
                      (isReadFilter === undefined
                        ? 'all'
                        : isReadFilter
                          ? 'read'
                          : 'unread'),
                  )}
                  onValueChange={(val: any) => {
                    setPageNumber(1)
                    if (!val || val.id === 'all') setIsReadFilter(undefined)
                    else if (val.id === 'read') setIsReadFilter(true)
                    else setIsReadFilter(false)
                  }}
                  filter={null}
                  itemToStringLabel={(item: any) => (item ? item.name : '')}
                >
                  <ComboboxInput
                    placeholder="حالة القراءة..."
                    className="h-10 w-full border-none bg-transparent px-6 text-sm focus:ring-0"
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {isReadFilterOptions.map((opt) => (
                        <ComboboxItem key={opt.id} value={opt}>
                          {opt.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
          </div>
        </div>
      </div>

      
        <div className="border-border/40 dark:bg-card overflow-hidden rounded-3xl border bg-white shadow-sm">
          <FeedbacksTable
            feedbacks={feedbacks}
            isLoading={isFeedbacksLoading}
            isMarking={isMarking}
            isDeleting={isDeleting}
            selectedType={selectedType}
            sorting={sorting}
            setSorting={setSorting}
            onOpenFeedback={setViewFeedback}
            onMarkAsRead={handleMarkAsRead}
            onDeleteRequest={setDeleteConfirmId}
          />
          
      

      {feedbacksData && feedbacksData.totalPages > 1 && (
        <div
          className="border-border/40 dark:bg-card mt-[-20px] flex items-center justify-between rounded-b-3xl border-x border-b bg-white px-6 py-3 text-sm text-right"
          dir="rtl"
        >
          <div className="text-muted-foreground">
            عرض {(feedbacksData.currentPage - 1) * feedbacksData.pageSize + 1} إلى{' '}
            {Math.min(feedbacksData.currentPage * feedbacksData.pageSize, feedbacksData.totalCount)} من
            أصل {feedbacksData.totalCount} ملاحظة
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1 || isFeedbacksLoading}
            >
              السابق
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: feedbacksData.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    variant={p === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    className="h-9 w-9 rounded-full p-0 shadow-sm"
                    disabled={isFeedbacksLoading}
                    onClick={() => setPageNumber(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() =>
                setPageNumber((p) => Math.min(feedbacksData.totalPages, p + 1))
              }
              disabled={
                pageNumber === feedbacksData.totalPages || isFeedbacksLoading
              }
            >
              التالي
            </Button>
          </div>
        </div>
      )}
      </div>

      <Dialog
        open={!!viewFeedback}
        onOpenChange={(open) => !open && setViewFeedback(null)}
      >
        <DialogContent
          className="w-full max-w-xl overflow-y-auto p-0 rounded-2xl gap-0 max-h-[90vh]"
          dir="rtl"
        >
          <DialogHeader className="border-b border-border/40 pb-6 text-right bg-gradient-to-l from-primary/5 via-background to-background p-6 rounded-t-2xl">
            <DialogTitle className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-9 items-center justify-center rounded-lg ring-1">
                <MessageSquare className="size-5" />
              </div>
              <span>تفاصيل الرسالة</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-right mt-1 text-sm">
              استعراض الملاحظة المرسلة من المستخدم بالكامل
            </DialogDescription>
          </DialogHeader>
          {viewFeedback && (
            <div className="space-y-6 p-6 text-right overflow-y-auto">
              <div className="space-y-5">
                <div className="border-border/50 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
                  {/* Small Top banner background */}
                  <div className="bg-gradient-to-r from-primary/10 via-background to-background/5 h-12 w-full" />
                  <div className="flex items-start gap-4 px-4 pb-4">
                    <Avatar className="size-16 border-4 border-background shadow-md">
                      <AvatarImage
                        src={viewFeedback.logoUrl || '/User-icon.webp'}
                        alt={viewFeedback.reviewerName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                        {viewFeedback.reviewerName
                          ?.substring(0, 2)
                          .toUpperCase() || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <span className="text-muted-foreground text-xs font-bold block tracking-wider uppercase mb-0.5">
                        المرسل
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-foreground text-lg font-extrabold leading-none">
                          {viewFeedback.reviewerName}
                        </p>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">
                          {getReviewerTypeName(viewFeedback.reviewerType)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm font-normal">
                        {viewFeedback.reviewerEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border-border/50 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-sm">
                    <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase mb-2">
                      نوع الرسالة
                    </span>
                    <Badge
                      variant={getBadgeVariant(viewFeedback.feedbackTypeName)}
                      className="flex w-fit items-center gap-1.5 px-3 py-1 font-bold text-sm shadow-sm"
                    >
                      {getTypeIcon(viewFeedback.feedbackTypeName)}
                      <span className="font-bold">
                        {viewFeedback.feedbackTypeName === 'FeatureRequest'
                          ? 'اقتراح ميزة'
                          : viewFeedback.feedbackTypeName === 'Complaint'
                            ? 'شكوى'
                            : viewFeedback.feedbackTypeName}
                      </span>
                    </Badge>
                  </div>

                  <div className="border-border/50 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-sm">
                    <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase mb-2">
                      تاريخ الإرسال
                    </span>
                    <div>
                      <p className="text-foreground text-base font-bold flex items-center gap-1.5 justify-start">
                        <span className="text-sky-500">•</span>
                        {viewFeedback.createdAt &&
                        !isNaN(new Date(viewFeedback.createdAt).getTime())
                          ? format(
                              new Date(viewFeedback.createdAt),
                              'dd MMM yyyy',
                              { locale: ar },
                            )
                          : '-'}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1 pr-3">
                        {viewFeedback.createdAt &&
                        !isNaN(new Date(viewFeedback.createdAt).getTime())
                          ? format(new Date(viewFeedback.createdAt), 'hh:mm a', {
                              locale: ar,
                            })
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-border/50 bg-card overflow-hidden rounded-2xl border shadow-sm">
                  <div className="bg-muted/30 border-border/50 border-b px-4 py-3">
                    <h4 className="text-foreground flex items-center gap-2 text-base font-bold justify-start">
                      <MessageSquare className="text-primary size-4" />
                      محتوى الرسالة
                    </h4>
                  </div>
                  <div className="relative p-5">
                    <div 
                      className={cn(
                        "absolute top-0 bottom-0 right-0 w-1.5",
                        viewFeedback.feedbackTypeName === 'FeatureRequest' ? 'bg-blue-500' :
                        viewFeedback.feedbackTypeName === 'Complaint' ? 'bg-red-500' : 'bg-slate-400'
                      )} 
                    />
                    <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap pr-3">
                      {viewFeedback.message}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-lg font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-md transition-all hover:shadow-lg"
                    onClick={() => setIsReplyDialogOpen(true)}
                  >
                    <Mail className="size-5" />
                    رد عبر البريد الإلكتروني
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذه الرسالة؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الرسالة نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId !== null) handleDelete(deleteConfirmId)
                setDeleteConfirmId(null)
              }}
              disabled={isDeleting}
            >
              حذف الرسالة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Mail className="text-primary size-5" />
              الرد على {viewFeedback?.reviewerName}
            </DialogTitle>
            <DialogDescription>
              سيتم إرسال هذا الرد مباشرة إلى البريد الإلكتروني:{' '}
              <span className="text-foreground font-semibold">
                {viewFeedback?.reviewerEmail}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-right">
            <div className="space-y-2">
              <label
                htmlFor="reply"
                className="text-foreground text-sm font-bold"
              >
                رسالة الرد
              </label>
              <Textarea
                id="reply"
                placeholder="اكتب ردك هنا..."
                className="min-h-[150px] resize-none"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsReplyDialogOpen(false)}
              className="font-bold"
              disabled={isSendingReply}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSendReply}
              className="min-w-[120px] font-bold"
              disabled={isSendingReply}
            >
              {isSendingReply ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="ml-2 size-4" />
                  إرسال الرد
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
