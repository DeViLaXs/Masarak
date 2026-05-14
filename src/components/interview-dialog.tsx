'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import { Loader2, CalendarIcon, Clock, MapPin, AlignRight, Video, X } from 'lucide-react'
import { jobService, CountryItem, LookupItem } from '@/services/job-service'
import { applicationService } from '@/services/application-service'
import { interviewService, ScheduleInterviewDTO } from '@/services/interview-service'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export type ScheduleRescheduleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId?: number
  interviewId?: number
  initialData?: ScheduleInterviewDTO | null
  onSuccess: () => void
}

export function ScheduleRescheduleDialog({
  open,
  onOpenChange,
  applicationId,
  interviewId,
  initialData,
  onSuccess,
}: ScheduleRescheduleDialogProps) {
  const isReschedule = !!interviewId

  const [isLoading, setIsLoading] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [countries, setCountries] = useState<CountryItem[]>([])
  const [governates, setGovernates] = useState<LookupItem[]>([])

  const [formData, setFormData] = useState<ScheduleInterviewDTO>({
    interviewDate: '',
    interviewTypeId: 1, // Default to Online
    notes: '',
    meetingLink: '',
    countryId: null,
    governateId: null,
    addressLine: '',
  })

  // Format date for datetime-local input
  const formatForInput = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
  }

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          interviewDate: formatForInput(initialData.interviewDate),
          interviewTypeId: initialData.interviewTypeId,
          notes: initialData.notes || '',
          meetingLink: initialData.meetingLink || '',
          countryId: initialData.countryId || null,
          governateId: initialData.governateId || null,
          addressLine: initialData.addressLine || '',
        })
      } else {
        setFormData({
          interviewDate: '',
          interviewTypeId: 1,
          notes: '',
          meetingLink: '',
          countryId: null,
          governateId: null,
          addressLine: '',
        })
      }

      // Fetch countries
      jobService.getCountries().then(setCountries).catch(() => { })
    }
  }, [open, initialData])

  useEffect(() => {
    if (formData.countryId) {
      jobService.getGovernates(formData.countryId).then(setGovernates).catch(() => { })
    } else {
      setGovernates([])
    }
  }, [formData.countryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send the local time string directly to avoid timezone subtraction bugs
      const localIso = formData.interviewDate.length === 16 ? `${formData.interviewDate}:00` : formData.interviewDate;

      const payload: ScheduleInterviewDTO = {
        interviewDate: localIso,
        interviewTypeId: formData.interviewTypeId,
        notes: formData.notes,
        meetingLink: formData.interviewTypeId === 1 ? formData.meetingLink : null,
        countryId: formData.interviewTypeId === 2 ? formData.countryId : null,
        governateId: formData.interviewTypeId === 2 ? formData.governateId : null,
        addressLine: formData.interviewTypeId === 2 ? formData.addressLine : null,
      }

      if (isReschedule && interviewId) {
        await interviewService.reschedule(interviewId, payload)
        toast.success('Interview rescheduled successfully')
      } else if (applicationId) {
        await applicationService.scheduleInterview(applicationId, payload)
        toast.success('Interview scheduled successfully')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.errors?.[0] || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const currentStr = formData.interviewDate || ''
    const timeMatch = currentStr.match(/T(\d{2}:\d{2})/)
    const time = timeMatch ? timeMatch[1] : '10:00'

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    setFormData({ ...formData, interviewDate: `${year}-${month}-${day}T${time}` })
    setIsCalendarOpen(false)
  }

  const updateTime = (h12: number, min: string, ap: string) => {
    let h24 = h12
    if (ap === 'PM' && h12 !== 12) h24 += 12
    if (ap === 'AM' && h12 === 12) h24 = 0

    const timeStr = `${String(h24).padStart(2, '0')}:${min}`

    const currentStr = formData.interviewDate || ''
    let datePart = currentStr.split('T')[0]
    if (!datePart) {
      const today = new Date()
      datePart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    }

    setFormData({ ...formData, interviewDate: `${datePart}T${timeStr}` })
  }

  const selectClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"

  const timePart = formData.interviewDate ? formData.interviewDate.split('T')[1]?.slice(0, 5) : '10:00'
  const currentHour24 = parseInt(timePart.split(':')[0] || '10', 10)
  const currentMinute = timePart.split(':')[1] || '00'
  const currentAmPm = currentHour24 >= 12 ? 'PM' : 'AM'
  const currentHour12 = currentHour24 % 12 || 12

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="interview-dialog" showCloseButton={false} className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0 scrollbar-hide" dir="rtl">
        <form onSubmit={handleSubmit}>
          <div className="px-6 pt-4 pb-4 border-b border-border/50 bg-muted/10 flex items-start justify-between">
            <DialogHeader className=" flex-1">
              <DialogTitle className="text-xl text-start text-primary">{isReschedule ? 'إعادة جدولة المقابلة' : 'تحديد موعد مقابلة'}</DialogTitle>
            </DialogHeader>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md opacity-70 hover:opacity-100 shrink-0 text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-3 text-right">
            {/* Date & Time Section */}
            <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CalendarIcon className="h-5 w-5 text-primary/80" />
                <h3 className="font-semibold text-foreground">التاريخ والوقت</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel className="text-right w-full block text-muted-foreground">تاريخ المقابلة</FieldLabel>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-right font-normal h-10 shadow-sm overflow-hidden border-input/60 hover:bg-accent/50",
                          !formData.interviewDate && "text-muted-foreground"
                        )}
                        dir="rtl"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        {formData.interviewDate && !isNaN(new Date(formData.interviewDate).getTime()) ? (
                          format(new Date(formData.interviewDate), "PPP", { locale: ar })
                        ) : (
                          <span>اختر التاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.interviewDate ? new Date(formData.interviewDate) : undefined}
                        onSelect={handleDateSelect}
                        initialFocus
                        dir="rtl"
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field>
                  <FieldLabel className="text-right w-full block text-muted-foreground">وقت المقابلة</FieldLabel>
                  <div className="flex items-center gap-1.5 w-full" dir="ltr">
                    <Select value={String(currentHour12)} onValueChange={(v) => updateTime(parseInt(v, 10), currentMinute, currentAmPm)}>
                      <SelectTrigger className="flex-1 h-10 text-center bg-background border-input/60 dark:bg-input/20 focus:ring-primary shadow-sm hover:bg-accent hover:text-accent-foreground transition-all" dir="ltr">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="ltr" position="popper" className="min-w-0">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                          <SelectItem key={h} value={String(h)}>{String(h).padStart(2, '0')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="font-bold shrink-0 px-0.5 text-muted-foreground">:</span>
                    <Select value={currentMinute} onValueChange={(v) => updateTime(currentHour12, v, currentAmPm)}>
                      <SelectTrigger className="flex-1 h-10 text-center bg-background border-input/60 dark:bg-input/20 focus:ring-primary shadow-sm hover:bg-accent hover:text-accent-foreground transition-all" dir="ltr">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="ltr" position="popper" className="min-w-0">
                        {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={currentAmPm} onValueChange={(v) => updateTime(currentHour12, currentMinute, v)}>
                      <SelectTrigger className="flex-1 h-10 text-center bg-background border-input/60 dark:bg-input/20 focus:ring-primary shadow-sm hover:bg-accent hover:text-accent-foreground transition-all" dir="ltr">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="ltr" position="popper" className="min-w-0">
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
              </div>
            </div>

            {/* Location & Details Section */}
            <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                {formData.interviewTypeId === 1 ? <MapPin className="h-5 w-5 text-primary/80" /> : <MapPin className="h-5 w-5 text-primary/80" />}
                <h3 className="font-semibold text-foreground">المكان والنوع</h3>
              </div>
              <div className="flex gap-5">
                <Field className="flex-1">
                  <FieldLabel className="text-right w-full block text-muted-foreground">نوع المقابلة</FieldLabel>
                  <Select value={String(formData.interviewTypeId)} onValueChange={(v) => setFormData({ ...formData, interviewTypeId: Number(v) })} dir="rtl">
                    <SelectTrigger className="flex-1 h-10 text-center bg-background border-input/60 shadow-sm hover:bg-accent hover:text-primary transition-all" dir="rtl">
                      <SelectValue placeholder="اختر نوع المقابلة" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" position="popper" className="min-w-0">
                      <SelectItem value="1">عن بعد</SelectItem>
                      <SelectItem value="2">حضوري</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {formData.interviewTypeId === 1 && (
                  <Field className="flex-2">
                    <FieldLabel className="text-right w-full block text-muted-foreground">رابط الاجتماع</FieldLabel>
                    <Input
                      type="url"
                      required
                      placeholder="https://meet.google.com/..."
                      className="h-10 text-left border-input/60 shadow-sm"
                      dir="ltr"
                      value={formData.meetingLink || ''}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    />
                  </Field>
                )}
              </div>

              {formData.interviewTypeId === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Field>
                    <FieldLabel className="text-right w-full block text-muted-foreground">الدولة</FieldLabel>
                    <Select value={formData.countryId ? String(formData.countryId) : undefined} onValueChange={(v) => setFormData({ ...formData, countryId: Number(v), governateId: null })} dir="rtl">
                      <SelectTrigger className="h-10 text-right bg-background border-input/60 shadow-sm hover:bg-accent/50 transition-all" dir="rtl">
                        <SelectValue placeholder="اختر الدولة" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {countries.map(c => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-right w-full block text-muted-foreground">المحافظة</FieldLabel>
                    <Select disabled={!formData.countryId || governates.length === 0} value={formData.governateId ? String(formData.governateId) : undefined} onValueChange={(v) => setFormData({ ...formData, governateId: Number(v) })} dir="rtl">
                      <SelectTrigger className="h-10 text-right bg-background border-input/60 shadow-sm hover:bg-accent/50 transition-all" dir="rtl">
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {governates.map(g => (
                          <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field className="md:col-span-2">
                    <FieldLabel className="text-right w-full block text-muted-foreground">العنوان التفصيلي</FieldLabel>
                    <Input
                      required
                      placeholder="الشارع، المبنى..."
                      className="h-10 text-right border-input/60 shadow-sm"
                      value={formData.addressLine || ''}
                      onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    />
                  </Field>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlignRight className="h-5 w-5 text-primary/80" />
                <h3 className="font-semibold text-foreground">ملاحظات إضافية</h3>
              </div>
              <Field>
                <div className="text-left text-xs text-muted-foreground ">
                  {formData.notes?.length || 0}/200
                </div>
                <Textarea
                  placeholder="أي تعليمات أو ملاحظات للمرشح..."
                  className="text-right min-h-[100px] border-input/60 shadow-sm resize-none"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  maxLength={200}
                />
              </Field>
            </div>
          </div>

          <DialogFooter className="px-6 pb-2 border-t border-border/50 bg-muted/5 flex-row-reverse sm:justify-start gap-2">
            <Button
              type="submit"
              disabled={isLoading || !formData.interviewDate}
              className="px-8 min-w-[120px] font-semibold"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ موعد المقابلة'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 border-border/60"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
