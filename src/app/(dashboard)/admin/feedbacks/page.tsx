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
  ComboboxTrigger,
  ComboboxValue,
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
  DialogClose,
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
  Clock,
  Trash2,
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
      return <LightbulbIcon className="size-5" />
    if (typeName === 'Complaint') return <AlertCircleIcon className="size-5" />
    return <MessageSquare className="size-5" />
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
                  <ComboboxTrigger
                    className="flex h-10 w-full items-center justify-between gap-3 bg-transparent px-6 text-sm shadow-none border-none outline-none focus:ring-0 cursor-pointer disabled:opacity-50"
                    disabled={isTypesLoading}
                  >
                    <ComboboxValue placeholder="تصفية حسب النوع..." />
                  </ComboboxTrigger>
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
                  <ComboboxTrigger className="flex h-10 w-full items-center justify-between gap-3 bg-transparent px-6 text-sm shadow-none border-none outline-none focus:ring-0 cursor-pointer">
                    <ComboboxValue placeholder="حالة القراءة..." />
                  </ComboboxTrigger>
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
          showCloseButton={false}
          className="w-full max-w-xl overflow-hidden p-0 rounded-3xl gap-0 max-h-[90vh] flex flex-col border border-border/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          dir="rtl"
        >
          <DialogHeader className="border-b border-border/40 pb-5 text-right p-6 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10 rounded-t-3xl shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl font-extrabold tracking-tight justify-start">
                <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl shadow-inner border border-primary/20 shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <span>تفاصيل الرسالة</span>
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">إغلاق</span>
                </Button>
              </DialogClose>
            </div>
            <DialogDescription className="text-muted-foreground text-right mt-1.5 text-xs pr-6">
              استعراض الملاحظة المرسلة من المستخدم بالكامل
            </DialogDescription>
          </DialogHeader>
          {viewFeedback && (() => {
            const isComplaint = viewFeedback.feedbackTypeName === 'Complaint';
            const isFeature = viewFeedback.feedbackTypeName === 'FeatureRequest';

            return (
              <div className="space-y-6 px-6 pb-6 text-right overflow-y-auto bg-slate-50/30 dark:bg-zinc-900/80">
                <div className="space-y-5">
                  
                  {/* Sender Profile widget */}
                  <div className="border border-border/60 bg-card dark:bg-card rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                    <Avatar className="size-16 border-2 border-primary/20 shadow-md ring-4 ring-primary/5 shrink-0">
                      <AvatarImage
                        src={viewFeedback.logoUrl || '/User-icon.webp'}
                        alt={viewFeedback.reviewerName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {viewFeedback.reviewerName?.substring(0, 2).toUpperCase() || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-muted-foreground text-[12px] font-bold block tracking-wider uppercase">
                        معلومات المرسل
                      </span>
                      <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-foreground text-lg font-black  truncate">
                          {viewFeedback.reviewerName}
                        </h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-2.5 py-0.5 font-bold rounded-full">
                          {getReviewerTypeName(viewFeedback.reviewerType)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-muted-foreground text-sm font-medium truncate" dir="ltr">
                        <Mail className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{viewFeedback.reviewerEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Widgets grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={cn(
                      "border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3",
                      isComplaint ? "border-red-100 bg-red-50/20 dark:border-red-950/30 dark:bg-red-950/10" :
                      isFeature ? "border-blue-100 bg-blue-50/20 dark:border-blue-950/30 dark:bg-blue-950/10" :
                      "border-border/60 bg-card"
                    )}>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px] font-bold block tracking-wider uppercase">
                          نوع الملاحظة
                        </span>
                        <span className={cn(
                          "font-extrabold text-sm block",
                          isComplaint ? "text-red-600 dark:text-red-400" :
                          isFeature ? "text-sky-500 dark:text-sky-400" : "text-foreground"
                        )}>
                          {viewFeedback.feedbackTypeName === 'FeatureRequest' ? 'اقتراح ميزة' :
                           viewFeedback.feedbackTypeName === 'Complaint' ? 'شكوى' : viewFeedback.feedbackTypeName}
                        </span>
                      </div>
                      <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center ring-1 shrink-0",
                        isComplaint ? "bg-red-100/50 text-red-600 ring-red-200/50 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800/20" :
                        isFeature ? "bg-slate-100 text-sky-500 ring-blue-200/50 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800/20" :
                        "bg-slate-100 text-slate-600 ring-slate-200"
                      )}>
                        {getTypeIcon(viewFeedback.feedbackTypeName)}
                      </div>
                    </div>

                    <div className="border border-border/60 bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px] font-bold block tracking-wider uppercase">
                          تاريخ الإرسال
                        </span>
                        <span className="font-extrabold text-sm block text-foreground">
                          {viewFeedback.createdAt && !isNaN(new Date(viewFeedback.createdAt).getTime())
                            ? format(new Date(viewFeedback.createdAt), 'yyyy-MM-dd')
                            : '-'}
                        </span>
                        <span className="text-muted-foreground text-[10px] block">
                          {viewFeedback.createdAt && !isNaN(new Date(viewFeedback.createdAt).getTime())
                            ? format(new Date(viewFeedback.createdAt), 'hh:mm a', { locale: ar })
                            : ''}
                        </span>
                      </div>
                      <div className="size-10 rounded-xl bg-slate-100/50 text-slate-600 ring-1 ring-slate-200/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:ring-zinc-700/50 flex items-center justify-center shrink-0">
                        <Clock className="size-5 text-sky-500" />
                      </div>
                    </div>
                  </div>

                  {/* Message Bubble Box */}
                  <div className="border border-border/60 bg-card dark:bg-card overflow-hidden rounded-2xl shadow-sm relative">
                    <div className="bg-card dark:bg-card border-b  px-5 py-3.5 flex items-center justify-between">
                      <h4 className="text-foreground flex items-center gap-2 text-sm font-extrabold justify-start">
                        <MessageSquare className="text-primary size-4" />
                        محتوى الرسالة
                      </h4>
                      <Badge variant="outline" className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        viewFeedback.isRead 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
                          : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
                      )}>
                        {viewFeedback.isRead ? 'مقروءة' : 'غير مقروءة'}
                      </Badge>
                    </div>
                    <div className="relative p-6 bg-card dark:bg-zinc-900/30">
                      <div 
                        className={cn(
                          "absolute top-0 bottom-0 right-0 w-1 rounded-l",
                          isComplaint ? 'bg-red-500' :
                          isFeature ? 'bg-blue-500' : 'bg-slate-400'
                        )} 
                      />
                      <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap pr-4 font-medium text-right">
                        {viewFeedback.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions Button */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="destructive"
                      className="h-9 px-4 rounded-xl text-xs border-red-200/60 dark:border-red-900/30 text-white hover:bg-red-700 hover:text-white hover:dark:bg-red-950/20 gap-2 shrink-0 font-bold"
                      onClick={() => {
                        handleDelete(viewFeedback.id)
                        setViewFeedback(null)
                      }}
                    >
                      <Trash2 className="size-4" />
                      حذف
                    </Button>
                    <Button
                      className="flex h-9 items-center justify-end gap-2 rounded-xl text-xs font-bold bg-primary hover:bg-sky-600 text-primary-foreground shadow-md transition-all hover:shadow-lg"
                      onClick={() => setIsReplyDialogOpen(true)}
                    >
                      <Mail className="size-4" />
                      رد عبر البريد الإلكتروني
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
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
        <DialogContent showCloseButton={false} className="sm:max-w-[500px] bg-card" dir="rtl">
          <DialogHeader className="text-right">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Mail className="text-primary size-5" />
                الرد على {viewFeedback?.reviewerName}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">إغلاق</span>
                </Button>
              </DialogClose>
            </div>
            <DialogDescription className="text-muted-foreground text-xs mt-1.5 text-right">
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
                className="min-h-[150px] resize-none mt-2"
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
              className="min-w-[120px] font-bold mx-2"
              disabled={isSendingReply}
            >
              {isSendingReply ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className=" size-4" />
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
