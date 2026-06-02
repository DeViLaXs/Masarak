'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  useJobs,
  useJobLookups,
  useGovernates,
  useSkillsSearch,
  useEnhanceDescription,
} from '@/hooks/use-jobs'

import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import {
  CalendarIcon,
  Loader2,
  XIcon,
  PlusIcon,
  SearchIcon,
  BriefcaseIcon,
  MapPinIcon,
  BanknoteIcon,
  WrenchIcon,
  Sparkles,
  SaveIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox'

// --- Arabic Translation Helpers ---

const formatJobTypeName = (name: string) => {
  const map: Record<string, string> = {
    FullTime: 'دوام كامل',
    PartTime: 'دوام جزئي',
    Contract: 'عقد',
    Internship: 'تدريب',
  }
  return map[name] || name
}

const formatLocationTypeName = (name: string) => {
  const map: Record<string, string> = {
    OnSite: 'حضوري',
    Remote: 'عن بعد',
    Hybrid: 'مرن',
  }
  return map[name] || name
}

// --- Types & Initial State ---

type JobFormState = {
  title: string
  description: string
  jobTypeId: number | ''
  categoryId: number | ''
  jobLocationTypeId: number | ''
  currencyId: number | ''
  countryId: number | ''
  governateId: number | ''
  minSalary: string
  maxSalary: string
  expirationDate: Date | undefined
  skillIds: number[]
  newSkills: string[]
}

const initialFormState: JobFormState = {
  title: '',
  description: '',
  jobTypeId: '',
  categoryId: '',
  jobLocationTypeId: '',
  currencyId: '',
  countryId: '',
  governateId: '',
  minSalary: '',
  maxSalary: '',
  expirationDate: undefined,
  skillIds: [],
  newSkills: [],
}

export function AddJobForm() {
  const router = useRouter()
  const { createJobAsync, isCreatingJob } = useJobs()
  const { mutateAsync: enhanceAsync, isPending: isEnhancing } =
    useEnhanceDescription()
  const [formData, setFormData] = React.useState<JobFormState>(initialFormState)
  const [skillsSearch, setSkillsSearch] = React.useState('')
  const [selectedSkillsMap, setSelectedSkillsMap] = React.useState<
    Record<number, string>
  >({})

  const [comboboxInputs, setComboboxInputs] = React.useState({
    category: '',
    country: '',
    governate: '',
    currency: '',
    jobType: '',
    locationType: '',
  })
  const [aiPreviewContent, setAiPreviewContent] = React.useState<string | null>(null)
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false)

  const [debouncedSkillsSearch] = useDebounce(skillsSearch, 500)

  const skillsInputRef = React.useRef<HTMLInputElement>(null)
  const skillsContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        skillsContainerRef.current &&
        !skillsContainerRef.current.contains(event.target as Node)
      ) {
        // Clear the search to close the dropdown
        setSkillsSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Lookups
  const {
    categories,
    jobTypes,
    locationTypes,
    currencies,
    countries,
    isCategoriesLoading,
  } = useJobLookups({
    categorySearch: comboboxInputs.category,
    currencySearch: comboboxInputs.currency,
    countrySearch: comboboxInputs.country,
  })

  const { data: governates, isLoading: isGovernatesLoading } = useGovernates(
    formData.countryId ? Number(formData.countryId) : undefined,
    comboboxInputs.governate,
  )

  const { data: skillsOptions } = useSkillsSearch(debouncedSkillsSearch)

  // --- Handlers ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.description ||
      !formData.jobTypeId ||
      !formData.categoryId ||
      !formData.jobLocationTypeId ||
      !formData.currencyId ||
      !formData.countryId ||
      !formData.governateId ||
      !formData.minSalary ||
      !formData.maxSalary ||
      !formData.expirationDate
    ) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة')
      return
    }

    if (Number(formData.minSalary) > Number(formData.maxSalary)) {
      toast.error('الراتب الأدنى يجب أن يكون أقل من أو يساوي الراتب الأعلى')
      return
    }

    try {
      await createJobAsync({
        title: formData.title,
        description: formData.description,
        jobTypeId: Number(formData.jobTypeId),
        categoryId: Number(formData.categoryId),
        jobLocationTypeId: Number(formData.jobLocationTypeId),
        currencyId: Number(formData.currencyId),
        countryId: Number(formData.countryId),
        governateId: Number(formData.governateId),
        minSalary: Number(formData.minSalary),
        maxSalary: Number(formData.maxSalary),
        expirationDate: formData.expirationDate.toISOString(),
        skillIds: formData.skillIds,
        newSkills: formData.newSkills,
      })

      toast.success('تمت إضافة الوظيفة بنجاح')
      router.push('/company/manage-job')
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء الإضافة')
    }
  }

  const handleEnhanceDescription = async () => {
    if (!formData.title || !formData.description) {
      toast.error('يرجى إدخال عنوان الوظيفة ووصف مبدئي للتحسين')
      return
    }

    try {
      const enhanced = await enhanceAsync({
        title: formData.title,
        description: formData.description,
      })
      setAiPreviewContent(enhanced)
      setIsAiModalOpen(true)
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء تحسين الوصف')
    }
  }

  const handleApplyAiEnhancement = () => {
    if (aiPreviewContent) {
      setFormData((prev) => ({ ...prev, description: aiPreviewContent }))
      setIsAiModalOpen(false)
      setAiPreviewContent(null)
      toast.success('تم تطبيق التحسين بنجاح')
    }
  }

  const handleAddSkill = (skillId: number | null, skillName: string) => {
    if (skillId) {
      if (!formData.skillIds.includes(skillId)) {
        setFormData((prev) => ({
          ...prev,
          skillIds: [...prev.skillIds, skillId],
        }))
        setSelectedSkillsMap((prev) => ({
          ...prev,
          [skillId]: skillName,
        }))
      }
    } else {
      if (!formData.newSkills.includes(skillName)) {
        setFormData((prev) => ({
          ...prev,
          newSkills: [...prev.newSkills, skillName],
        }))
      }
    }
    setSkillsSearch('')
  }

  const handleRemoveSkill = (skillId: number | null, skillName: string) => {
    if (skillId) {
      setFormData((prev) => ({
        ...prev,
        skillIds: prev.skillIds.filter((id) => id !== skillId),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        newSkills: prev.newSkills.filter((name) => name !== skillName),
      }))
    }
  }

  const getSkillName = (id: number) => {
    return selectedSkillsMap[id] || `مهارة ${id}`
  }

  if (isCategoriesLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 xl:min-h-[500px]">
        <Loader2 className="text-primary size-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          جاري إعداد نموذج الإضافة...
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="mx-auto w-full max-w-4xl space-y-8 pb-10"
    >
      

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' &&
            (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
            (e.target as HTMLButtonElement).type !== 'submit'
          ) {
            e.preventDefault()
          }
        }}
        className="space-y-8"
      >
        {/* Section 1: Basic Information */}
        <Card className="border-border/50 overflow-hidden shadow-sm transition-all hover:shadow-md">
          <CardHeader className="dark:bg-muted/10 border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-lg ring-1">
                <BriefcaseIcon className="size-5" />
              </div>
              <div>
                <CardTitle size="bold" className="text-lg">
                  تفاصيل الوظيفة الأساسية
                </CardTitle>
                <CardDescription className="mt-1">
                  المعلومات العامة حول الوظيفة وتصنيفها
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-7 pt-7">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="title">عنوان الوظيفة </FieldLabel>
                <Input
                  id="title"
                  placeholder="مثال: مطور واجهات أمامية"
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="bg-background focus-visible:ring-primary/20 transition-shadow"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>تصنيف الوظيفة </FieldLabel>
                <Combobox
                  value={
                    categories?.find((cat) => cat.id === formData.categoryId) ||
                    null
                  }
                  inputValue={comboboxInputs.category}
                  onValueChange={(val: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: val ? val.id : '',
                    }))
                    setComboboxInputs((prev) => ({
                      ...prev,
                      category: val ? val.name : '',
                    }))
                  }}
                  filter={null}
                  onInputValueChange={(value: string) => {
                    setComboboxInputs((prev) => ({ ...prev, category: value }))
                    if (value === '') {
                      setFormData((prev) => ({ ...prev, categoryId: '' }))
                    }
                  }}
                  itemToStringLabel={(item: any) => item?.name || ''}
                >
                  <ComboboxInput
                    placeholder="اختر التصنيف..."
                    className="bg-background focus:ring-primary/20 transition-shadow"
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {categories && categories.length === 0 && (
                        <div className="text-muted-foreground py-3 text-center text-sm">
                          لا يوجد نتائج
                        </div>
                      )}
                      {categories?.map((cat) => (
                        <ComboboxItem key={cat.id} value={cat}>
                          {cat.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            </div>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="description">وصف الوظيفة </FieldLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 h-8 gap-1.5 text-xs font-bold"
                  onClick={handleEnhanceDescription}
                  disabled={isEnhancing}
                >
                  {isEnhancing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                  تحسين بالذكاء الاصطناعي
                </Button>
              </div>
              <Textarea
                id="description"
                className="bg-background focus-visible:ring-primary/20 min-h-[140px] resize-y transition-shadow"
                placeholder="اكتب وصفاً مفصلاً للوظيفة والمهام المطلوبة بطريقة واضحة ومختصرة..."
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                maxLength={700}
                required
              />
              <FieldDescription className="w-full text-left text-xs font-medium">
                <span
                  className={cn(
                    (formData.description?.length || 0) > 700
                      ? 'text-destructive'
                      : 'text-muted-foreground',
                  )}
                >
                  {formData.description?.length || 0}
                </span>
                /700
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>

        {/* Section 2: Location & Type */}
        <Card className="border-border/50 overflow-hidden shadow-sm transition-all hover:shadow-md">
          <CardHeader className="dark:bg-muted/10 border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-lg ring-1">
                <MapPinIcon className="size-5" />
              </div>
              <div>
                <CardTitle size="bold" className="text-lg">
                  موقع وطبيعة العمل
                </CardTitle>
                <CardDescription className="mt-1">
                  حدد نوع الدوام والمكان الذي سيعمل منه الموظف
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-7 pt-7">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel>نوع الدوام </FieldLabel>
                <Combobox
                  value={
                    jobTypes?.find((jt) => jt.id === formData.jobTypeId) || null
                  }
                  inputValue={comboboxInputs.jobType}
                  onValueChange={(val: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      jobTypeId: val ? val.id : '',
                    }))
                    setComboboxInputs((prev) => ({
                      ...prev,
                      jobType: val ? formatJobTypeName(val.name) : '',
                    }))
                  }}
                  filter={null}
                  onInputValueChange={(value: string) => {
                    setComboboxInputs((prev) => ({ ...prev, jobType: value }))
                    if (value === '') {
                      setFormData((prev) => ({ ...prev, jobTypeId: '' }))
                    }
                  }}
                  itemToStringLabel={(item: any) =>
                    item ? formatJobTypeName(item.name) : ''
                  }
                >
                  <ComboboxInput
                    placeholder="اختر نوع الدوام..."
                    className="bg-background focus:ring-primary/20 transition-shadow"
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {jobTypes && jobTypes.length === 0 && (
                        <div className="text-muted-foreground py-3 text-center text-sm">
                          لا يوجد نتائج
                        </div>
                      )}
                      {jobTypes?.map((jt) => (
                        <ComboboxItem key={jt.id} value={jt}>
                          {formatJobTypeName(jt.name)}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldLabel>نوع مكان العمل </FieldLabel>
                <Combobox
                  value={
                    locationTypes?.find(
                      (lt) => lt.id === formData.jobLocationTypeId,
                    ) || null
                  }
                  onValueChange={(val: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      jobLocationTypeId: val ? val.id : '',
                    }))
                  }}
                  itemToStringLabel={(item: any) =>
                    item ? formatLocationTypeName(item.name) : ''
                  }
                >
                  <ComboboxTrigger className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background dark:bg-input/30 px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 text-right cursor-pointer">
                    <ComboboxValue placeholder="حضوري، عن بعد، إلخ..." />
                  </ComboboxTrigger>
                  <ComboboxContent>
                    <ComboboxList>
                      {locationTypes && locationTypes.length === 0 && (
                        <div className="text-muted-foreground py-3 text-center text-sm">
                          لا يوجد نتائج
                        </div>
                      )}
                      {locationTypes?.map((lt) => (
                        <ComboboxItem key={lt.id} value={lt}>
                          {formatLocationTypeName(lt.name)}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldLabel>الدولة </FieldLabel>
                <Combobox
                  value={
                    countries?.find((c) => c.id === formData.countryId) || null
                  }
                  inputValue={comboboxInputs.country}
                  onValueChange={(val: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      countryId: val ? val.id : '',
                      governateId: '',
                    }))
                    setComboboxInputs((prev) => ({
                      ...prev,
                      country: val ? val.name : '',
                      governate: '',
                    }))
                  }}
                  filter={null}
                  onInputValueChange={(value: string) => {
                    setComboboxInputs((prev) => ({ ...prev, country: value }))
                    if (value === '') {
                      setFormData((prev) => ({
                        ...prev,
                        countryId: '',
                        governateId: '',
                      }))
                    }
                  }}
                  itemToStringLabel={(item: any) => item?.name || ''}
                >
                  <ComboboxInput
                    placeholder="ابحث عن الدولة..."
                    className="bg-background focus:ring-primary/20 transition-shadow"
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {countries && countries.length === 0 && (
                        <div className="text-muted-foreground py-2 text-center text-sm">
                          لا يوجد نتائج
                        </div>
                      )}
                      {countries?.map((country) => (
                        <ComboboxItem key={country.id} value={country}>
                          {country.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldLabel>المحافظة / المنطقة </FieldLabel>
                <Combobox
                  value={
                    governates?.find((g) => g.id === formData.governateId) ||
                    null
                  }
                  inputValue={comboboxInputs.governate}
                  onValueChange={(val: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      governateId: val ? val.id : '',
                    }))
                    setComboboxInputs((prev) => ({
                      ...prev,
                      governate: val ? val.name : '',
                    }))
                  }}
                  filter={null}
                  onInputValueChange={(value: string) => {
                    setComboboxInputs((prev) => ({ ...prev, governate: value }))
                    if (value === '') {
                      setFormData((prev) => ({ ...prev, governateId: '' }))
                    }
                  }}
                  itemToStringLabel={(item: any) => item?.name || ''}
                  disabled={!formData.countryId || isGovernatesLoading}
                >
                  <ComboboxInput
                    placeholder={
                      !formData.countryId
                        ? 'يرجى اختيار الدولة أولاً'
                        : 'ابحث عن المحافظة...'
                    }
                    className="bg-background focus:ring-primary/20 transition-shadow"
                    disabled={!formData.countryId || isGovernatesLoading}
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {governates && governates.length === 0 && (
                        <div className="text-muted-foreground py-2 text-center text-sm">
                          لا يوجد نتائج
                        </div>
                      )}
                      {governates?.map((gov) => (
                        <ComboboxItem key={gov.id} value={gov}>
                          {gov.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Salary & Duration */}
        <Card className="border-border/50 overflow-hidden shadow-sm transition-all hover:shadow-md">
          <CardHeader className="dark:bg-muted/10 border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-lg ring-1">
                <BanknoteIcon className="size-5" />
              </div>
              <div>
                <CardTitle size="bold" className="text-lg">
                  تحديد الراتب والمدة
                </CardTitle>
                <CardDescription className="mt-1">
                  نطاق الراتب المتوقع ومدة إتاحة الإعلان الوظيفي
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-7 pt-7">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Field className="lg:col-span-1">
                <FieldLabel>العملة </FieldLabel>
                <Combobox
                  value={
                    currencies?.find((c) => c.id === formData.currencyId) ||
                    null
                  }
                  inputValue={comboboxInputs.currency}
                  onValueChange={(val: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      currencyId: val ? val.id : '',
                    }))
                    setComboboxInputs((prev) => ({
                      ...prev,
                      currency: val ? `${val.name} (${val.code})` : '',
                    }))
                  }}
                  filter={null}
                  onInputValueChange={(value: string) => {
                    setComboboxInputs((prev) => ({ ...prev, currency: value }))
                    if (value === '') {
                      setFormData((prev) => ({ ...prev, currencyId: '' }))
                    }
                  }}
                  itemToStringLabel={(item: any) =>
                    item ? `${item.name} (${item.code})` : ''
                  }
                >
                  <ComboboxInput
                    placeholder="العملة..."
                    className="bg-background focus:ring-primary/20 transition-shadow"
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {currencies && currencies.length === 0 && (
                        <div className=" text-muted-foreground py-2 text-center text-sm">
                          لا يوجد نتائج
                        </div>
                      )}
                      {currencies?.map((curr) => (
                        <ComboboxItem key={curr.id} value={curr}>
                          {curr.name} ({curr.code})
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel htmlFor="minSalary">الراتب من </FieldLabel>
                <Input
                  id="minSalary"
                  type="number"
                  min="0"
                  className="bg-background focus-visible:ring-primary/20 [appearance:textfield] transition-shadow [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={formData.minSalary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minSalary: e.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel htmlFor="maxSalary">الراتب إلى </FieldLabel>
                <Input
                  id="maxSalary"
                  type="number"
                  min="0"
                  className="bg-background focus-visible:ring-primary/20 [appearance:textfield] transition-shadow [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={formData.maxSalary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxSalary: e.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field className="flex flex-col justify-end lg:col-span-1">
                <FieldLabel>تاريخ الانتهاء </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'bg-background hover:bg-accent focus-visible:ring-primary/20 w-full justify-start text-right font-normal transition-shadow',
                        !formData.expirationDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="text-primary/70 mr-0 ml-2 size-4" />
                      {formData.expirationDate ? (
                        format(formData.expirationDate, 'PPP', { locale: ar })
                      ) : (
                        <span>اختر التاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-100 w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expirationDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          expirationDate: date,
                        }))
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="rounded-md border shadow-sm"
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Skills */}
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="dark:bg-muted/10 border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-lg ring-1">
                <WrenchIcon className="size-5" />
              </div>
              <div>
                <CardTitle size="bold" className="text-lg">
                  المتطلبات والمهارات
                </CardTitle>
                <CardDescription className="mt-1">
                  أضف المهارات التي يجب أن تتوفر في المتقدم
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-7">
            <Field>
              <div className="border-border bg-muted/20 focus-within:border-primary/40 focus-within:bg-background flex flex-col gap-3 rounded-xl border p-4 transition-colors">
                {/* Selected Skills */}
                {((formData.skillIds?.length || 0) > 0 ||
                  (formData.newSkills?.length || 0) > 0) && (
                    <div className="flex flex-wrap gap-2 pb-2">
                      {formData.skillIds.map((id) => (
                        <span
                          key={`exist-${id}`}
                          className="bg-primary/10 text-primary ring-primary/20 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold shadow-sm ring-1"
                        >
                          {getSkillName(id)}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(id, '')}
                            className="hover:bg-primary/20 hover:text-primary rounded-full p-0.5 transition-colors focus:outline-none"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </span>
                      ))}
                      {formData.newSkills.map((name) => (
                        <span
                          key={`new-${name}`}
                          className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold shadow-sm"
                        >
                          {name}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(null, name)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors focus:outline-none"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                {/* Search Input */}
                <div className="relative" ref={skillsContainerRef}>
                  <div className="relative flex w-full items-center">
                    <SearchIcon className="text-muted-foreground/70 pointer-events-none absolute right-3 size-4" />
                    <Input
                      ref={skillsInputRef}
                      placeholder="ابحث لاختيار مهارة موجودة أو اكتب لإضافة مهارة جديدة..."
                      className="w-full border-none bg-transparent py-2.5 pr-10 pl-3 text-sm font-medium shadow-none focus-visible:ring-0"
                      value={skillsSearch}
                      onChange={(e) => setSkillsSearch(e.target.value)}
                    />
                  </div>

                  {/* Search Results Dropdown */}
                  {skillsSearch && (
                    <div className="border-border bg-popover animate-in fade-in zoom-in-95 ring-border/50 absolute top-[110%] -left-4 z-[100] mb-2 max-h-[350px] w-[calc(100%+2rem)] overflow-auto rounded-xl border p-2 shadow-xl ring-1">
                      {debouncedSkillsSearch !== skillsSearch ? (
                        <div className="text-primary/50 flex items-center justify-center p-6">
                          <Loader2 className="size-6 animate-spin" />
                        </div>
                      ) : skillsOptions && skillsOptions.length > 0 ? (
                        <ul className="flex flex-col gap-1">
                          {skillsOptions.map((skill) => (
                            <li key={skill.id}>
                              <button
                                type="button"
                                className="hover:bg-muted focus:bg-muted flex w-full cursor-pointer items-center rounded-md px-3 py-2.5 text-right text-sm font-medium transition-colors focus:outline-none"
                                onClick={() =>
                                  handleAddSkill(skill.id, skill.name)
                                }
                              >
                                {skill.name}
                              </button>
                            </li>
                          ))}
                          {!skillsOptions.find(
                            (s) =>
                              s.name.toLowerCase() ===
                              skillsSearch.toLowerCase(),
                          ) && (
                              <li>
                                <button
                                  type="button"
                                  className="bg-primary/5 text-primary hover:bg-primary/10 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-right text-sm font-bold transition-colors focus:outline-none"
                                  onClick={() =>
                                    handleAddSkill(null, skillsSearch)
                                  }
                                >
                                  <PlusIcon className="size-4" />
                                  إضافة &quot;{skillsSearch}&quot; كمهارة جديدة
                                </button>
                              </li>
                            )}
                        </ul>
                      ) : (
                        <div className="p-1">
                          <button
                            type="button"
                            className="bg-primary/5 text-primary hover:bg-primary/10 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-right text-sm font-bold transition-colors focus:outline-none"
                            onClick={() => handleAddSkill(null, skillsSearch)}
                          >
                            <PlusIcon className="size-4" />
                            إضافة &quot;{skillsSearch}&quot; كمهارة جديدة
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Field>
          </CardContent>
        </Card>

        {/* --- Form Actions --- */}
        <div className="border-border/50 z-40 flex items-center justify-end gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl">
          <Button
            type="submit"
            size="lg"
            disabled={isCreatingJob}
            className="min-w-44 font-bold tracking-wide shadow-md transition-transform hover:scale-[1.02]"
          >
            {isCreatingJob ? (
              <Loader2 className="ml-2 size-5 animate-spin" />
            ) : (
              <SaveIcon className="ml-2 size-5" />
            )}
            نشر الإعلان الوظيفي
          </Button>
        </div>
      </form>

      {/* AI Enhancement Preview Modal */}
      <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          <DialogHeader className="bg-primary/5 border-b p-6 text-right">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Sparkles className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  مراجعة تحسين الوصف
                </DialogTitle>
                <DialogDescription className="mt-1">
                  قم بمراجعة الوصف المحسن بواسطة الذكاء الاصطناعي قبل تطبيقه
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto p-6 text-right">
            <div className="bg-muted/30 rounded-xl border p-5">
              <div className="space-y-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {aiPreviewContent?.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={i} className="text-primary mt-6 mb-2 text-base font-bold first:mt-0">
                        {line.replace('### ', '')}
                      </h3>
                    )
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="mr-2 flex items-start gap-2">
                        <span className="bg-primary/40 mt-1.5 size-1.5 shrink-0 rounded-full" />
                        <span>{line.replace('- ', '')}</span>
                      </div>
                    )
                  }
                  return <p key={i}>{line}</p>
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-muted/10 border-t p-6">
            <div className="flex w-full items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setIsAiModalOpen(false)}
                className="flex-1 font-bold"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleApplyAiEnhancement}
                className="flex-[2] font-bold"
              >
                تطبيق التعديلات المحسنة
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
