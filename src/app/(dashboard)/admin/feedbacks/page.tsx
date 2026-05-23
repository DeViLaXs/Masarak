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
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
            onOpenFeedback={setViewFeedback}
            onMarkAsRead={handleMarkAsRead}
            onDeleteRequest={setDeleteConfirmId}
          />
          
      

      {feedbacksData && feedbacksData.totalPages > 1 && (
        <div className="border-border/40 dark:bg-card mt-[-20px] flex items-center justify-between rounded-b-3xl border-x border-b bg-white px-6 py-3 text-right">
          <p className="text-muted-foreground text-sm">
            عرض الصفحة{' '}
            <span className="text-foreground font-bold">
              {feedbacksData.currentPage}
            </span>{' '}
            من{' '}
            <span className="text-foreground font-bold">
              {feedbacksData.totalPages}
            </span>{' '}
            (إجمالي {feedbacksData.totalCount} ملاحظة)
          </p>
          <div className="flex items-center gap-2" dir="ltr">
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
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 px-5 shadow-sm"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1 || isFeedbacksLoading}
            >
              السابق
            </Button>
           
          </div>
        </div>
      )}
      </div>

      <Sheet
        open={!!viewFeedback}
        onOpenChange={(open) => !open && setViewFeedback(null)}
      >
        <SheetContent
          side="left" 
          className="w-full overflow-y-auto border-r-0 border-l sm:max-w-md"
          dir="rtl"
        >
          <SheetHeader className="border-b pb-6 text-right">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary size-5" />
              تفاصيل الرسالة
            </SheetTitle>
            <SheetDescription>استعراض الملاحظة بالكامل</SheetDescription>
          </SheetHeader>
          {viewFeedback && (
            <div className="space-y-6 py-6 text-right">
              <div className="space-y-5">
                <div className="border-border/50 bg-muted/20 flex items-center gap-4 rounded-xl border p-4">
                  <Avatar className="size-12 border shadow-sm">
                    <AvatarImage
                      src={viewFeedback.logoUrl || '/User-icon.webp'}
                      alt={viewFeedback.reviewerName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                      {viewFeedback.reviewerName
                        ?.substring(0, 2)
                        .toUpperCase() || 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                      المرسل
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground text-lg leading-none font-bold">
                        {viewFeedback.reviewerName}
                      </p>
                      <Badge variant="outline" className="bg-muted/30 text-xs">
                        {getReviewerTypeName(viewFeedback.reviewerType)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm font-normal">
                      {viewFeedback.reviewerEmail}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border-border/50 bg-muted/20 rounded-xl border p-4">
                    <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                      النوع
                    </h4>
                    <Badge
                      variant={getBadgeVariant(viewFeedback.feedbackTypeName)}
                      className="flex w-fit items-center gap-1.5 shadow-sm"
                    >
                      {getTypeIcon(viewFeedback.feedbackTypeName)}
                      <span className="font-bold">
                        {viewFeedback.feedbackTypeName === 'FeatureRequest'
                          ? 'اقتراح'
                          : viewFeedback.feedbackTypeName === 'Complaint'
                            ? 'شكوى'
                            : viewFeedback.feedbackTypeName}
                      </span>
                    </Badge>
                  </div>

                  <div className="border-border/50 bg-muted/20 rounded-xl border p-4">
                    <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                      التاريخ والوقت
                    </h4>
                    <p className="text-foreground text-sm font-semibold">
                      {viewFeedback.createdAt &&
                      !isNaN(new Date(viewFeedback.createdAt).getTime())
                        ? format(
                            new Date(viewFeedback.createdAt),
                            'dd MMM yyyy',
                            { locale: ar },
                          )
                        : '-'}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {viewFeedback.createdAt &&
                      !isNaN(new Date(viewFeedback.createdAt).getTime())
                        ? format(new Date(viewFeedback.createdAt), 'hh:mm a', {
                            locale: ar,
                          })
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="border-border/50 bg-card overflow-hidden rounded-xl border shadow-sm">
                  <div className="bg-muted/30 border-border/50 border-b px-4 py-3">
                    <h4 className="text-foreground flex items-center gap-2 text-sm font-bold">
                      <MessageSquare className="text-muted-foreground size-4" />
                      محتوى الرسالة
                    </h4>
                  </div>
                  <div className="text-foreground p-5 text-base leading-relaxed whitespace-pre-wrap">
                    {viewFeedback.message}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="flex h-12 w-full items-center gap-2 text-base font-bold"
                    onClick={() => setIsReplyDialogOpen(true)}
                  >
                    <Mail className="size-5" />
                    رد عبر البريد الإلكتروني
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
