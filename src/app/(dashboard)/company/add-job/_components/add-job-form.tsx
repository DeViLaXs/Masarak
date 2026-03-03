'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  useJobs,
  useJobLookups,
  useGovernates,
  useSkillsSearch,
} from '@/hooks/use-jobs'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import {
  CalendarIcon,
  Loader2,
  XIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
} from '@/components/ui/combobox'

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
  const [formData, setFormData] = React.useState<JobFormState>(initialFormState)
  const [skillsSearch, setSkillsSearch] = React.useState('')
  const [selectedSkillsMap, setSelectedSkillsMap] = React.useState<
    Record<number, string>
  >({})
  const [categorySearch, setCategorySearch] = React.useState('')
  const [countrySearch, setCountrySearch] = React.useState('')
  const [governateSearch, setGovernateSearch] = React.useState('')
  const [currencySearch, setCurrencySearch] = React.useState('')
  const skillsInputRef = React.useRef<HTMLInputElement>(null)

  // Lookups
  const {
    categories,
    jobTypes,
    locationTypes,
    currencies,
    countries,
    isCategoriesLoading,
  } = useJobLookups({
    categorySearch,
    currencySearch,
    countrySearch,
  })

  const { data: governates, isLoading: isGovernatesLoading } = useGovernates(
    formData.countryId ? Number(formData.countryId) : undefined,
    governateSearch,
  )

  const { data: skillsOptions } = useSkillsSearch(skillsSearch)

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
      router.push('/company/jobs')
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء الإضافة')
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <div className="mb-8 text-right">
        <h1 className="text-2xl font-bold">إضافة وظيفة جديدة</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          إنشاء وظيفة جديدة ونشرها للمتقدمين
        </p>
      </div>

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
        className="space-y-6"
      >
        {/* عنوان الوظيفة */}
        <Field>
          <FieldLabel htmlFor="title">عنوان الوظيفة *</FieldLabel>
          <Input
            id="title"
            placeholder="مثال: مطور واجهات أمامية"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="dark:bg-background bg-white"
            required
          />
        </Field>

        {/* نوع الدوام + موقع العمل */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>نوع الدوام *</FieldLabel>
            <Combobox
              value={
                jobTypes?.find((jt) => jt.id === formData.jobTypeId) || null
              }
              onValueChange={(val: any) =>
                setFormData((prev) => ({
                  ...prev,
                  jobTypeId: val ? val.id : '',
                }))
              }
              itemToStringLabel={(item: any) => item?.name || ''}
            >
              <ComboboxInput
                placeholder="اختر نوع الدوام..."
                className="dark:bg-background bg-white"
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxEmpty>لا يوجد نتائج</ComboboxEmpty>
                  {jobTypes?.map((jt) => (
                    <ComboboxItem key={jt.id} value={jt}>
                      {jt.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel>نوع مكان العمل *</FieldLabel>
            <Combobox
              value={
                locationTypes?.find(
                  (lt) => lt.id === formData.jobLocationTypeId,
                ) || null
              }
              onValueChange={(val: any) =>
                setFormData((prev) => ({
                  ...prev,
                  jobLocationTypeId: val ? val.id : '',
                }))
              }
              itemToStringLabel={(item: any) => item?.name || ''}
            >
              <ComboboxInput
                placeholder="حضوري، عن بعد، إلخ..."
                className="dark:bg-background bg-white"
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxEmpty>لا يوجد نتائج</ComboboxEmpty>
                  {locationTypes?.map((lt) => (
                    <ComboboxItem key={lt.id} value={lt}>
                      {lt.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </div>

        {/* تصنيف الوظيفة */}
        <Field>
          <FieldLabel>تصنيف الوظيفة *</FieldLabel>
          <Combobox
            value={
              categories?.find((cat) => cat.id === formData.categoryId) || null
            }
            onValueChange={(val: any) =>
              setFormData((prev) => ({
                ...prev,
                categoryId: val ? val.id : '',
              }))
            }
            filter={null}
            onInputValueChange={(value: string, details: any) => {
              if (details?.reason === 'input-change') setCategorySearch(value)
            }}
            itemToStringLabel={(item: any) => item?.name || ''}
          >
            <ComboboxInput
              placeholder="اختر التصنيف..."
              className="dark:bg-background bg-white"
            />
            <ComboboxContent>
              <ComboboxList>
                {categories && categories.length === 0 && (
                  <div className="text-muted-foreground py-2 text-center text-sm">
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

        {/* الدولة + المحافظة */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>الدولة *</FieldLabel>
            <Combobox
              value={
                countries?.find((c) => c.id === formData.countryId) || null
              }
              onValueChange={(val: any) => {
                setFormData((prev) => ({
                  ...prev,
                  countryId: val ? val.id : '',
                  governateId: '',
                }))
              }}
              filter={null}
              onInputValueChange={(value: string, details: any) => {
                if (details?.reason === 'input-change') setCountrySearch(value)
              }}
              itemToStringLabel={(item: any) => item?.name || ''}
            >
              <ComboboxInput
                placeholder="ابحث عن الدولة..."
                className="dark:bg-background bg-white"
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
            <FieldLabel>المحافظة / المنطقة *</FieldLabel>
            <Combobox
              value={
                governates?.find((g) => g.id === formData.governateId) || null
              }
              onValueChange={(val: any) =>
                setFormData((prev) => ({
                  ...prev,
                  governateId: val ? val.id : '',
                }))
              }
              filter={null}
              onInputValueChange={(value: string, details: any) => {
                if (details?.reason === 'input-change')
                  setGovernateSearch(value)
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
                className="dark:bg-background bg-white"
                disabled={!formData.countryId || isGovernatesLoading}
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

        {/* الراتب: العملة + من + إلى */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field>
            <FieldLabel>العملة *</FieldLabel>
            <Combobox
              value={
                currencies?.find((c) => c.id === formData.currencyId) || null
              }
              onValueChange={(val: any) =>
                setFormData((prev) => ({
                  ...prev,
                  currencyId: val ? val.id : '',
                }))
              }
              filter={null}
              onInputValueChange={(value: string, details: any) => {
                if (details?.reason === 'input-change') setCurrencySearch(value)
              }}
              itemToStringLabel={(item: any) =>
                item ? `${item.name} (${item.code})` : ''
              }
            >
              <ComboboxInput
                placeholder="اختر العملة..."
                className="dark:bg-background bg-white"
              />
              <ComboboxContent>
                <ComboboxList>
                  {currencies && currencies.length === 0 && (
                    <div className="text-muted-foreground py-2 text-center text-sm">
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

          <Field>
            <FieldLabel htmlFor="minSalary">الراتب من *</FieldLabel>
            <Input
              id="minSalary"
              type="number"
              min="0"
              placeholder="8000"
              className="dark:bg-background [appearance:textfield] bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

          <Field>
            <FieldLabel htmlFor="maxSalary">الراتب إلى *</FieldLabel>
            <Input
              id="maxSalary"
              type="number"
              min="0"
              placeholder="12000"
              className="dark:bg-background [appearance:textfield] bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
        </div>

        {/* تاريخ الانتهاء */}
        <Field>
          <FieldLabel>تاريخ انتهاء الوظيفة *</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'dark:bg-background w-full justify-start bg-white text-right font-normal',
                  !formData.expirationDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="ml-2 size-4" />
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
              />
            </PopoverContent>
          </Popover>
        </Field>

        {/* وصف الوظيفة */}
        <Field>
          <FieldLabel htmlFor="description">وصف الوظيفة *</FieldLabel>
          <Textarea
            id="description"
            className="dark:bg-background min-h-[140px] resize-y bg-white"
            placeholder="اكتب وصفاً مفصلاً للوظيفة والمهام المطلوبة..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            maxLength={500}
            required
          />
          <FieldDescription className="w-full text-left">
            {formData.description.length}/500
          </FieldDescription>
        </Field>

        {/* المتطلبات والمهارات */}
        <Field>
          <FieldLabel>المتطلبات والمهارات *</FieldLabel>
          <div className="dark:bg-background flex flex-col gap-3 rounded-md border bg-white p-3">
            {/* Selected Skills */}
            {(formData.skillIds.length > 0 ||
              formData.newSkills.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {formData.skillIds.map((id) => (
                  <span
                    key={`exist-${id}`}
                    className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                  >
                    {getSkillName(id)}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(id, '')}
                      className="hover:text-primary/70 focus:outline-none"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </span>
                ))}
                {formData.newSkills.map((name) => (
                  <span
                    key={`new-${name}`}
                    className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(null, name)}
                      className="hover:text-primary-foreground/70 focus:outline-none"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <div className="relative flex w-full items-center">
                <SearchIcon className="text-muted-foreground pointer-events-none absolute right-3 size-4" />
                <Input
                  ref={skillsInputRef}
                  placeholder="اذكر المهارات والخبرات المطلوبة للوظيفة..."
                  className="w-full border-none bg-transparent py-2 pr-9 pl-3 text-sm shadow-none focus-visible:ring-0"
                  value={skillsSearch}
                  onChange={(e) => setSkillsSearch(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {skillsSearch && (
                <div className="bg-popover border-border absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md">
                  {skillsOptions && skillsOptions.length > 0 ? (
                    <ul className="p-1">
                      {skillsOptions.map((skill) => (
                        <li key={skill.id}>
                          <button
                            type="button"
                            className="hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-sm px-3 py-2 text-right text-sm transition-colors"
                            onClick={() => handleAddSkill(skill.id, skill.name)}
                          >
                            {skill.name}
                          </button>
                        </li>
                      ))}
                      {!skillsOptions.find(
                        (s) =>
                          s.name.toLowerCase() === skillsSearch.toLowerCase(),
                      ) && (
                        <li>
                          <button
                            type="button"
                            className="hover:bg-accent text-primary flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-right text-sm font-medium transition-colors"
                            onClick={() => handleAddSkill(null, skillsSearch)}
                          >
                            <PlusIcon className="size-4" />
                            إضافة &quot;{skillsSearch}&quot; كمهارة جديدة
                          </button>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="p-2">
                      <button
                        type="button"
                        className="hover:bg-accent text-primary flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-right text-sm font-medium transition-colors"
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
          <FieldDescription className="w-full text-left">
            {formData.skillIds.length + formData.newSkills.length}/∞
          </FieldDescription>
        </Field>

        {/* --- Form Actions --- */}
        <div className="flex items-center justify-start gap-3 border-t pt-6">
          <Button type="submit" size="lg" disabled={isCreatingJob}>
            {isCreatingJob && <Loader2 className="ml-2 size-4 animate-spin" />}
            نشر الوظيفة
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
