'use client'

import * as React from 'react'
import {
  useFeedbacks,
  useFeedbackTypes,
  useMarkFeedbackAsRead,
  useDeleteFeedback
} from '@/hooks/use-feedback'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import {
  Loader2,
  Trash2,
  CheckCircle2,
  MessageSquare,
  LightbulbIcon,
  AlertCircleIcon,
  SearchIcon,
  XIcon,
  EyeIcon,
  Monitor,
  Smartphone,
  Building2,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { FeedbackResponseDTO } from '@/services/feedback-service'

export default function FeedbacksClient() {
  const [selectedType, setSelectedType] = React.useState<number | undefined>(undefined)
  const [isReadFilter, setIsReadFilter] = React.useState<boolean | undefined>(undefined)
  const [typeSearch, setTypeSearch] = React.useState('')
  const [viewFeedback, setViewFeedback] = React.useState<FeedbackResponseDTO | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(null)
  const [pageNumber, setPageNumber] = React.useState(1)

  const { data: feedbacksData, isLoading: isFeedbacksLoading } = useFeedbacks(selectedType, isReadFilter, pageNumber)
  const feedbacks = feedbacksData?.items || []

  const { data: feedbackTypes, isLoading: isTypesLoading } = useFeedbackTypes()

  const { mutateAsync: markAsRead, isPending: isMarking } = useMarkFeedbackAsRead()
  const { mutateAsync: deleteFeedback, isPending: isDeleting } = useDeleteFeedback()

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

  const getTypeIcon = (typeName: string) => {
    if (typeName === 'FeatureRequest') return <LightbulbIcon className="size-4" />
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

  const getReviewerIcon = (type?: string) => {
    const t = (type || '').trim().toLowerCase()
    if (t === 'company') return <Monitor className="size-4" />
    if (t === 'candidate') return <User className="size-4" />
    return <Smartphone className="size-4" />
  }

  const isReadFilterOptions = React.useMemo(() => [
    { id: 'all', name: 'الكل' },
    { id: 'unread', name: 'غير مقروءة' },
    { id: 'read', name: 'مقروءة' }
  ], [])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-10 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-l from-primary/10 via-background to-background p-8 text-right shadow-sm dark:from-primary/5">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 backdrop-blur-md">
                <MessageSquare className="size-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                إدارة الملاحظات
              </h1>
            </div>
            <p className="mr-[68px] max-w-2xl text-base leading-relaxed text-muted-foreground">
              استعرض واقرأ ملاحظات واقتراحات الشركات، وتتبع تفاعلاتهم مع المنصة في مكان واحد.
            </p>
          </div>

          {/* Filter */}
          <div className="flex w-full max-w-[400px] items-center gap-4 sm:mt-0">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground pr-1">نوع الملاحظة</label>
              <div className="w-full shadow-sm rounded-xl overflow-hidden bg-card">
                <Combobox
                  value={
                    selectedType === undefined
                      ? { id: 0, name: 'الكل' }
                      : feedbackTypes?.find(t => t.id === selectedType) || null
                  }
                  onValueChange={(val: any) => {
                    setPageNumber(1) // Reset page on filter change
                    if (!val || val.id === 0) setSelectedType(undefined)
                    else setSelectedType(val.id)
                  }}
                  filter={null}
                  onInputValueChange={(value: string, details: any) => {
                    if (details?.reason === 'input-change') setTypeSearch(value)
                  }}
                  itemToStringLabel={(item: any) => {
                    if (!item) return ''
                    if (item.name === 'FeatureRequest') return 'اقتراح ميزة'
                    if (item.name === 'Complaint') return 'شكوى'
                    return item.name === 'الكل' ? 'الكل' : item.name
                  }}
                >
                  <ComboboxInput
                    placeholder="تصفية حسب النوع..."
                    className="bg-transparent w-full border-none focus:ring-0"
                    disabled={isTypesLoading}
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxItem value={{ id: 0, name: 'الكل' }}>
                        الكل
                      </ComboboxItem>
                      {feedbackTypes?.map((type) => (
                        <ComboboxItem key={type.id} value={type}>
                          {type.name === 'FeatureRequest' ? 'اقتراح ميزة' : type.name === 'Complaint' ? 'شكوى' : type.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground pr-1">حالة القراءة</label>
              <div className="w-full shadow-sm rounded-xl overflow-hidden bg-card">
                <Combobox
                  value={isReadFilterOptions.find(f => f.id === (isReadFilter === undefined ? 'all' : isReadFilter ? 'read' : 'unread'))}
                  onValueChange={(val: any) => {
                    setPageNumber(1)
                    if (!val || val.id === 'all') setIsReadFilter(undefined)
                    else if (val.id === 'read') setIsReadFilter(true)
                    else setIsReadFilter(false)
                  }}
                  filter={null}
                  itemToStringLabel={(item: any) => item ? item.name : ''}
                >
                  <ComboboxInput
                    placeholder="حالة القراءة..."
                    className="bg-transparent w-full border-none focus:ring-0"
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

        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-10 size-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b bg-muted/20 px-6 py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            قائمة الملاحظات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isFeedbacksLoading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                جاري تحميل الملاحظات...
              </p>
            </div>
          ) : feedbacks?.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-center p-8">
              <div className="relative flex size-24 items-center justify-center rounded-full bg-primary/5">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20" />
                <SearchIcon className="size-10 text-primary/60" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight">لا توجد ملاحظات</p>
                <p className="text-base text-muted-foreground max-w-sm mx-auto">
                  {selectedType ? 'لم يتم العثور على ملاحظات تطابق النوع المحدد. حاول إزالة التصفية.' : 'صندوق الملاحظات فارغ حالياً. ستظهر ملاحظات الشركات هنا فور إرسالها.'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[180px] text-center">المرسل</TableHead>
                  <TableHead className="w-[120px] text-center">النوع</TableHead>
                  <TableHead className="w-[140px] text-center">نوع المرسل</TableHead>
                  <TableHead className="text-center">الرسالة</TableHead>
                  <TableHead className="w-[120px] text-center">التاريخ</TableHead>
                  <TableHead className="w-[100px] text-center">الحالة</TableHead>
                  <TableHead className="w-[100px] text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks?.map((feedback) => (
                  <TableRow
                    key={feedback.id}
                    className={cn(
                      "group transition-all duration-200 cursor-pointer",
                      !feedback.isRead ? "bg-primary/[0.03] hover:bg-primary/[0.06] font-medium" : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setViewFeedback(feedback)
                      if (!feedback.isRead) handleMarkAsRead(feedback.id)
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center justify-start gap-3">
                        <Avatar className="size-10 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                          <AvatarImage src={feedback.logoUrl || '/User-icon.webp'} alt={feedback.reviewerName} className="object-cover" />
                          <AvatarFallback className={cn(
                            "font-bold text-sm",
                            !feedback.isRead ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            {feedback.reviewerName?.substring(0, 2).toUpperCase() || 'م'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-right">
                          <span className="font-semibold text-foreground line-clamp-1">{feedback.reviewerName}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{feedback.reviewerEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge variant={getBadgeVariant(feedback.feedbackTypeName)} className="flex w-fit items-center gap-1.5">
                          {getTypeIcon(feedback.feedbackTypeName)}
                          <span>
                            {feedback.feedbackTypeName === 'FeatureRequest' ? 'اقتراح' :
                              feedback.feedbackTypeName === 'Complaint' ? 'شكوى' :
                                feedback.feedbackTypeName}
                          </span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge variant="outline" className="flex w-fit items-center gap-1.5 bg-muted/30">
                          {getReviewerIcon(feedback.reviewerType)}
                          <span>{getReviewerTypeName(feedback.reviewerType)}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[400px] mx-auto text-sm leading-relaxed text-muted-foreground line-clamp-2 text-center">
                        {feedback.message.length > 50 ? feedback.message.substring(0, 50) + '...' : feedback.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm text-center">
                      {feedback.createdAt && !isNaN(new Date(feedback.createdAt).getTime())
                        ? format(new Date(feedback.createdAt), 'dd MMM yyyy', { locale: ar })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {feedback.isRead ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          مقروءة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                          جديدة
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {!feedback.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:text-primary hover:bg-primary/10 z-10 relative"
                            title="تحديد كمقروءة"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(feedback.id)
                            }}
                            disabled={isMarking}
                          >
                            <CheckCircle2 className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 z-10 relative"
                          title="حذف الملاحظة"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirmId(feedback.id)
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {feedbacksData && feedbacksData.totalPages > 1 && (
        <div className="flex items-center justify-between text-right px-2 mt-4">
          <p className="text-sm text-muted-foreground">
            عرض الصفحة <span className="font-bold text-foreground">{feedbacksData.currentPage}</span> من <span className="font-bold text-foreground">{feedbacksData.totalPages}</span>
            {" "}(إجمالي {feedbacksData.totalCount} ملاحظة)
          </p>
          <div className="flex items-center gap-2" dir="ltr">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber === 1 || isFeedbacksLoading}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(p => Math.min(feedbacksData.totalPages, p + 1))}
              disabled={pageNumber === feedbacksData.totalPages || isFeedbacksLoading}
            >
              التالي
            </Button>
          </div>
        </div>
      )}

      {/* Feedback Detail Sheet */}
      <Sheet open={!!viewFeedback} onOpenChange={(open) => !open && setViewFeedback(null)}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto border-r-0 border-l" dir="rtl">
          <SheetHeader className="border-b pb-6 text-right">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              تفاصيل الرسالة
            </SheetTitle>
            <SheetDescription>
              استعراض الملاحظة بالكامل
            </SheetDescription>
          </SheetHeader>
          {viewFeedback && (
            <div className="space-y-6 py-6 text-right">
              {/* Info Items */}
              <div className="space-y-5">
                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                  <Avatar className="size-12 border shadow-sm">
                    <AvatarImage src={viewFeedback.logoUrl || '/User-icon.webp'} alt={viewFeedback.reviewerName} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {viewFeedback.reviewerName?.substring(0, 2).toUpperCase() || 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">المرسل</h4>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground text-lg leading-none">{viewFeedback.reviewerName}</p>
                      <Badge variant="outline" className="text-xs bg-muted/30">{getReviewerTypeName(viewFeedback.reviewerType)}</Badge>
                    </div>
                    <p className="text-muted-foreground font-normal text-sm mt-1">{viewFeedback.reviewerEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">النوع</h4>
                    <Badge variant={getBadgeVariant(viewFeedback.feedbackTypeName)} className="flex w-fit items-center gap-1.5 shadow-sm">
                      {getTypeIcon(viewFeedback.feedbackTypeName)}
                      <span className="font-bold">
                        {viewFeedback.feedbackTypeName === 'FeatureRequest' ? 'اقتراح' :
                          viewFeedback.feedbackTypeName === 'Complaint' ? 'شكوى' :
                            viewFeedback.feedbackTypeName}
                      </span>
                    </Badge>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">التاريخ والوقت</h4>
                    <p className="text-sm font-semibold text-foreground">
                      {viewFeedback.createdAt && !isNaN(new Date(viewFeedback.createdAt).getTime())
                        ? format(new Date(viewFeedback.createdAt), 'dd MMM yyyy', { locale: ar })
                        : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {viewFeedback.createdAt && !isNaN(new Date(viewFeedback.createdAt).getTime())
                        ? format(new Date(viewFeedback.createdAt), 'hh:mm a', { locale: ar })
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                  <div className="bg-muted/30 border-b border-border/50 px-4 py-3">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <MessageSquare className="size-4 text-muted-foreground" />
                      محتوى الرسالة
                    </h4>
                  </div>
                  <div className="p-5 text-base leading-relaxed text-foreground whitespace-pre-wrap">
                    {viewFeedback.message}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الرسالة؟</AlertDialogTitle>
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
    </div>
  )
}
