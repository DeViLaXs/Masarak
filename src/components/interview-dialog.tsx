'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Switch, SwitchGroup, Label } from '@heroui/react';
// import { toast } from 'sonner'
import { gooeyToast } from "@/components/ui/goey-toaster"
import { Loader2, CalendarIcon, MapPin, AlignRight, X, Eye, EyeOff, EyeClosed } from 'lucide-react'
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
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox'

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'errors' in error.response.data &&
    Array.isArray(error.response.data.errors) &&
    typeof error.response.data.errors[0] === 'string'
  ) {
    return error.response.data.errors[0]
  }

  return 'An error occurred'
}

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
  const [comboboxInputs, setComboboxInputs] = useState({
    country: '',
    governate: '',
  })
  const dialogFormRef = React.useRef<HTMLFormElement | null>(null)


  const [formData, setFormData] = useState<ScheduleInterviewDTO>({
    interviewDate: '',
    interviewTypeId: 1, // Default to Online
    notes: '',
    meetingLink: '',
    countryId: null,
    governateId: null,
    addressLine: '',
    addressId: null,
  })
  const [showNotes, setShowNotes] = useState(false)

  // Format a UTC ISO string from backend into a local datetime string for the picker (e.g. "2026-05-10T10:00")
  const formatForInput = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''
    // Convert UTC → local by formatting each local component
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
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
          addressId: initialData.addressId || null,
        })
        setShowNotes(!!initialData.notes)
      } else {
        setFormData({
          interviewDate: '',
          interviewTypeId: 1,
          notes: '',
          meetingLink: '',
          countryId: null,
          governateId: null,
          addressLine: '',
          addressId: null,
        })
        setShowNotes(false)
      }

      // Fetch countries
      jobService.getCountries().then(setCountries).catch(() => { })
    } else {
      setComboboxInputs({ country: '', governate: '' })
    }
  }, [open, initialData])


  useEffect(() => {
    if (formData.countryId) {
      jobService.getGovernates(formData.countryId).then(setGovernates).catch(() => { })
    } else {
      setGovernates([])
    }
  }, [formData.countryId])

  useEffect(() => {
    if (formData.interviewTypeId !== 2) {
      setShowNotes(false)
    }
  }, [formData.interviewTypeId])

  // Sync combobox inputs with labels when data is loaded
  useEffect(() => {
    if (formData.countryId && countries.length > 0) {
      const c = countries.find(x => x.id === formData.countryId)
      if (c) setComboboxInputs(prev => ({ ...prev, country: c.name }))
    }
  }, [formData.countryId, countries])

  useEffect(() => {
    if (formData.governateId && governates.length > 0) {
      const g = governates.find(x => x.id === formData.governateId)
      if (g) setComboboxInputs(prev => ({ ...prev, governate: g.name }))
    }
  }, [formData.governateId, governates])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // formData.interviewDate is a local datetime string (e.g. "2026-05-10T10:00")
      // Parse it as local time and validate against now (also local)
      const selectedDate = new Date(formData.interviewDate);
      const now = new Date();
      now.setSeconds(0, 0);

      if (selectedDate < now) {
        gooeyToast.error('لا يمكن تحديد موعد مقابلة في الماضي')
        setIsLoading(false)
        return
      }

      // Field Validations
      if (formData.interviewTypeId === 1 && !formData.meetingLink?.trim()) {
        gooeyToast.error('يرجى إدخال رابط الاجتماع')
        setIsLoading(false)
        return
      }

      if (formData.interviewTypeId === 2) {
        if (!formData.countryId) {
          gooeyToast.error('يرجى اختيار الدولة')
          setIsLoading(false)
          return
        }
        if (!formData.governateId) {
          gooeyToast.error('يرجى اختيار المحافظة')
          setIsLoading(false)
          return
        }
        if (!formData.addressLine?.trim()) {
          gooeyToast.error('يرجى إدخال العنوان التفصيلي')
          setIsLoading(false)
          return
        }
      }

      // STEP 1: Convert local datetime → UTC ISO string before sending to backend
      // new Date("2026-05-10T10:00") is parsed as LOCAL time, .toISOString() gives UTC
      const utcDate = selectedDate.toISOString(); // e.g. "2026-05-10T07:00:00.000Z" for Yemen UTC+3

      const payload: ScheduleInterviewDTO = {
        interviewDate: utcDate,
        interviewTypeId: formData.interviewTypeId,
        notes: (formData.interviewTypeId === 1 || (formData.interviewTypeId === 2 && showNotes)) ? formData.notes : null,
        meetingLink: formData.interviewTypeId === 1 ? formData.meetingLink : null,
        countryId: formData.interviewTypeId === 2 ? formData.countryId : null,
        governateId: formData.interviewTypeId === 2 ? formData.governateId : null,
        addressLine: formData.interviewTypeId === 2 ? formData.addressLine : null,
        addressId: formData.interviewTypeId === 2 ? formData.addressId : null,
      }

      if (isReschedule && interviewId) {
        await interviewService.reschedule(interviewId, payload)
        gooeyToast.success('تم تعديل الموعد بنجاح')
      } else if (applicationId) {
        await applicationService.scheduleInterview(applicationId, payload)
        gooeyToast.success('تم تحديد الموعد بنجاح')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      gooeyToast.error(getErrorMessage(error))
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

  const timePart = formData.interviewDate ? formData.interviewDate.split('T')[1]?.slice(0, 5) : '10:00'
  const currentHour24 = parseInt(timePart.split(':')[0] || '10', 10)
  const currentMinute = timePart.split(':')[1] || '00'
  const currentAmPm = currentHour24 >= 12 ? 'PM' : 'AM'
  const currentHour12 = currentHour24 % 12 || 12

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="interview-dialog" showCloseButton={false} className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0 scrollbar-hide" dir="rtl">
        <form ref={dialogFormRef} onSubmit={handleSubmit}>
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
                        disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
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
            <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 pt-5 px-5 pb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                {formData.interviewTypeId === 1 ? <MapPin className="h-5 w-5 text-primary/80" /> : <MapPin className="h-5 w-5 text-primary/80" />}
                <h3 className="font-semibold text-foreground">المكان والنوع</h3>
              </div>
              <div className="flex gap-5 mb-2">
                <Field className="flex-1">
                  <FieldLabel className="text-right w-full block text-muted-foreground">نوع المقابلة</FieldLabel>
                  <Select value={String(formData.interviewTypeId)} onValueChange={(v) => setFormData({ ...formData, interviewTypeId: Number(v) })} dir="rtl">
                    <SelectTrigger className="flex-1 h-10 text-center bg-background border-input/60 shadow-sm hover:bg-accent hover:text-primary transition-all" dir="rtl">
                      <SelectValue placeholder="اختر نوع المقابلة" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" position="popper" className="min-w-0">
                      <SelectItem value="1">عن بعد</SelectItem>
                      <SelectItem value="2">حضوري</SelectItem>
                      <SelectItem value="3">هاتفية</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {formData.interviewTypeId === 1 && (
                  <Field className="flex-2">
                    <FieldLabel className="text-right w-full block text-muted-foreground">رابط الاجتماع</FieldLabel>
                    <Input
                      type="url"

                      placeholder="ex: https://meet.google.com/..."
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
                    <Combobox
                      value={countries.find(c => c.id === formData.countryId) || null}
                      inputValue={comboboxInputs.country}
                      onValueChange={(val: CountryItem | null) => {
                        setFormData({
                          ...formData,
                          countryId: val ? val.id : null,
                          governateId: null
                        })
                        setComboboxInputs(prev => ({
                          ...prev,
                          country: val ? val.name : '',
                          governate: ''
                        }))
                      }}
                      onInputValueChange={(v) => {
                        setComboboxInputs(prev => ({ ...prev, country: v }))
                        if (!v) {
                          setFormData({ ...formData, countryId: null, governateId: null })
                        }
                      }}
                      itemToStringLabel={(item: CountryItem | null) => item?.name || ''}
                    >
                      <ComboboxInput
                        placeholder="اختر الدولة..."
                        className="h-10 text-right bg-background border-input/60 shadow-sm hover:bg-accent/50 transition-all"
                        showClear
                      />
                      <ComboboxContent
                        dir="rtl"
                        className="overflow-hidden"
                        portalContainer={dialogFormRef}
                      >
                        <ComboboxList className="max-h-60 overflow-y-auto">
                          {countries
                            .filter(c => c.name.toLowerCase().includes(comboboxInputs.country.toLowerCase()))
                            .map(c => (
                              <ComboboxItem key={c.id} value={c}>{c.name}</ComboboxItem>
                            ))
                          }
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>

                  <Field>
                    <FieldLabel className="text-right w-full block text-muted-foreground">المحافظة</FieldLabel>
                    <Combobox
                      disabled={!formData.countryId || governates.length === 0}
                      value={governates.find(g => g.id === formData.governateId) || null}
                      inputValue={comboboxInputs.governate}
                      onValueChange={(val: LookupItem | null) => {
                        setFormData({ ...formData, governateId: val ? val.id : null })
                        setComboboxInputs(prev => ({ ...prev, governate: val ? val.name : '' }))
                      }}
                      onInputValueChange={(v) => {
                        setComboboxInputs(prev => ({ ...prev, governate: v }))
                        if (!v) setFormData({ ...formData, governateId: null })
                      }}
                      itemToStringLabel={(item: LookupItem | null) => item?.name || ''}
                    >
                      <ComboboxInput
                        placeholder={!formData.countryId ? "يرجى اختيار الدولة أولاً" : "اختر المحافظة..."}
                        className="h-10 text-right bg-background border-input/60 shadow-sm hover:bg-accent/50 transition-all"
                        disabled={!formData.countryId || governates.length === 0}
                        showClear
                      />
                      <ComboboxContent
                        dir="rtl"
                        className="overflow-hidden"
                        portalContainer={dialogFormRef}
                      >
                        <ComboboxList className="max-h-60 overflow-y-auto">
                          {governates
                            .filter(g => g.name.toLowerCase().includes(comboboxInputs.governate.toLowerCase()))
                            .map(g => (
                              <ComboboxItem key={g.id} value={g}>{g.name}</ComboboxItem>
                            ))
                          }
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>


                  <Field className="md:col-span-2">
                    <FieldLabel className=" text-right w-full block text-muted-foreground">العنوان التفصيلي</FieldLabel>
                    <Input

                      placeholder="الشارع، المبنى..."
                      className="bg-background h-10 text-right border-input/60 shadow-sm"
                      value={formData.addressLine || ''}
                      onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    />
                  </Field>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {(formData.interviewTypeId === 1 || formData.interviewTypeId === 2) && (
              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <AlignRight className="h-5 w-5 text-primary/80" />
                    <h3 className="font-semibold text-foreground">ملاحظات إضافية</h3>
                  </div>
                  {formData.interviewTypeId === 2 && (
                    // <Switch
                    //   checked={showNotes}
                    //   onCheckedChange={setShowNotes}
                    // />
                    <Switch isSelected={showNotes} onChange={setShowNotes}>
                      {({ isSelected }) => (
                        <Switch.Control
                          dir="ltr"
                          className={cn(
                            "h-6 w-11 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center relative",
                            isSelected ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-600"
                          )}
                        >
                          <Switch.Thumb
                            className={cn(
                              "size-5 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center",
                              isSelected ? "translate-x-5" : "translate-x-0"
                            )}
                          >
                            <Switch.Icon>
                              {isSelected ? (
                                <Eye className="size-3.5 text-primary transition-colors duration-200" />
                              ) : (
                                <EyeClosed className="size-3.5 text-zinc-500 transition-colors duration-200" />
                              )}
                            </Switch.Icon>
                          </Switch.Thumb>
                        </Switch.Control>
                      )}
                    </Switch>
                  )}
                </div>
                {(formData.interviewTypeId === 1 || (formData.interviewTypeId === 2 && showNotes)) && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
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
                )}
              </div>
            )}
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
