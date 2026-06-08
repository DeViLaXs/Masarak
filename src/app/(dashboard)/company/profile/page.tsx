'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Camera,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Monitor,
  ChevronLeft,
  Trash2,
  Circle,
  CheckCircle2,
} from 'lucide-react'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-users'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { useRouter } from 'next/navigation'
import { Loader2, Check, X } from 'lucide-react'
import { DeleteAlert } from '@/components/delete-alert'
import { PasswordInput } from '@/components/ui/password-input'
import { z } from 'zod'

// Define validation schema matching signup-form.tsx
const profileSchema = z.object({
  name: z.string().min(2, 'اسم الشركة يجب أن يكون 2 أحرف على الأقل'),
  phoneNumber: z
    .string()
    .min(9, 'رقم الهاتف يجب أن يكون 9 أرقام')
    .regex(/^[0-9]+$/, 'يجب أن يحتوي رقم الهاتف على أرقام فقط'),
  industry: z.string().min(2, 'يرجى إدخال اسم الصناعة'),
})

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    user,
    isLoading,
    updateProfile,
    isUpdatingProfile,
    deleteAccount,
    isDeletingAccount,
    changePassword,
    isChangingPassword,
  } = useUser()

  const avatarUrl = previewUrl || user?.sasUrl || undefined
  const hasCustomAvatar = avatarUrl && !avatarUrl.includes('User-icon.webp') ? avatarUrl : undefined

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    industry: '',
    logoFile: null as File | null,
    isLogoChanged: false,
    isLogoDeleted: false,
  })

  const [isChangingPasswordMode, setIsChangingPasswordMode] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync local state when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        industry: user.industry || '',
      }))
    }
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validation: Type (strict webp, jpeg, png) - exclude jpg
      const allowedTypes = ['image/webp', 'image/jpeg', 'image/png']
      const extension = file.name.split('.').pop()?.toLowerCase()
      const isAllowedExtension = ['webp', 'jpeg', 'png'].includes(
        extension || '',
      )

      if (!allowedTypes.includes(file.type) || !isAllowedExtension) {
        toast.error(
          'عذراً، يرجى اختيار ملف من نوع WEBP أو JPEG أو PNG فقط (.jpg غير مدعوم)',
        )
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      // Validation: Size (1MB)
      const maxSize = 1 * 1024 * 1024 // 1MB
      if (file.size > maxSize) {
        toast.error('عذراً، يجب أن يكون حجم الملف أقل من 1 ميجابايت')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setFormData((prev) => ({
        ...prev,
        logoFile: file,
        isLogoChanged: true,
        isLogoDeleted: false,
      }))
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleUpdateProfile = () => {
    // Validate using Zod
    const result = profileSchema.safeParse({
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      industry: formData.industry,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = err.path[0]
        if (path) {
          fieldErrors[path.toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    updateProfile(
      {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        industry: formData.industry,
        logoFile: formData.logoFile,
        isLogoChanged: formData.isLogoChanged,
        isLogoDeleted: formData.isLogoDeleted,
      },
      {
        onSuccess: () => {
          toast.success('تم تحديث الملف الشخصي بنجاح')
          setFormData((prev) => ({
            ...prev,
            logoFile: null,
            isLogoChanged: false,
            isLogoDeleted: false,
          }))
          setPreviewUrl(null)
        },
        onError: () => {
          toast.error('حدث خطأ أثناء تحديث الملف الشخصي')
        },
      },
    )
  }

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success('تم حذف الحساب بنجاح')
        router.push('/')
      },
      onError: () => {
        toast.error('حدث خطأ أثناء حذف الحساب')
      },
    })
  }

  const passwordRequirements = [
    { label: '8 أحرف على الأقل', check: (p: string) => p.length >= 8 },
    { label: 'حرف كبير واحد على الأقل', check: (p: string) => /[A-Z]/.test(p) },
    { label: 'رقم واحد على الأقل', check: (p: string) => /[0-9]/.test(p) },
    {
      label: 'رمز خاص واحد على الأقل',
      check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ]

  const isPasswordValid = passwordRequirements.every((req) =>
    req.check(passwordData.newPassword),
  )

  const handleChangePassword = () => {
    if (!passwordData.oldPassword) {
      toast.error('يرجى إدخال كلمة المرور الحالية')
      return
    }
    if (!isPasswordValid) {
      toast.error('كلمة المرور الجديدة غير مطابقة للشروط')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمة المرور غير متطابقة')
      return
    }

    changePassword(
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('تم تغيير كلمة المرور بنجاح')
          setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
          setIsChangingPasswordMode(false)
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'فشل تغيير كلمة المرور')
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            إعدادات ملف الشركة
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            إدارة معلومات شركتك وتفضيلات الأمان والوصول.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.back()
            }}
          >
            رجوع
          </Button>
          <Button
            size="sm"
            onClick={handleUpdateProfile}
            disabled={isUpdatingProfile || isLoading}
          >
            {isUpdatingProfile && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* General Information Section */}
        <Card className="ring-border overflow-hidden rounded-2xl border-none shadow-sm ring-1">
          <CardHeader className="px-6 py-2">
            <CardTitle>
              <span className="text-lg font-bold">المعلومات العامة</span>
            </CardTitle>
            <CardDescription>
              التفاصيل الأساسية لملف شركتك التجاري.
            </CardDescription>
            <Separator className="mt-5" />
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <div className="group relative">
                <Avatar className="ring-background h-24 w-24 shadow-md ring-4 transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={hasCustomAvatar}
                  />
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* <div
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-primary-foreground ring-background hover:bg-primary/90 absolute -bottom-1 -left-1 cursor-pointer rounded-full p-2 shadow-lg ring-2 transition-colors"
                >
                  <Camera size={16} />
                </div> */}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">شعار الشركة</h4>
                <p className="text-muted-foreground text-xs">
                  تنسيق WEBP أو PNG أو JPEG، بحد أقصى 1 ميجابايت.
                </p>
                <div className="flex gap-3 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".webp,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="xs"
                    className="h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    تحميل جديد
                  </Button>
                  {(previewUrl || user?.sasUrl) && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-destructive hover:text-destructive hover:bg-destructive/5 h-8"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          logoFile: null,
                          isLogoChanged: true,
                          isLogoDeleted: true,
                        }))
                        setPreviewUrl('/User-icon.webp')
                      }}
                    >
                      إزالة
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Form Fields Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  اسم الشركة
                </FieldLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="bg-muted/20 focus:bg-background transition-colors"
                />
                {errors.name && (
                  <span className="pr-1 text-xs text-red-500">
                    {errors.name}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  البريد الإلكتروني
                </FieldLabel>
                <Input
                  value={user?.email ?? ''}
                  type="email"
                  readOnly
                  className="bg-muted/10 cursor-not-allowed opacity-70"
                />
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  رقم الهاتف
                </FieldLabel>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleFieldChange('phoneNumber', e.target.value)
                  }
                  className="bg-muted/20 focus:bg-background transition-colors"
                />
                {errors.phoneNumber && (
                  <span className="pr-1 text-xs text-red-500">
                    {errors.phoneNumber}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  مجال العمل
                </FieldLabel>
                <Input
                  value={formData.industry}
                  onChange={(e) =>
                    handleFieldChange('industry', e.target.value)
                  }
                  className="bg-muted/20 focus:bg-background transition-colors"
                />
                {errors.industry && (
                  <span className="pr-1 text-xs text-red-500">
                    {errors.industry}
                  </span>
                )}
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Section */}
        <Card className="ring-border overflow-hidden rounded-2xl border-none shadow-sm ring-1">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg">الأمان</CardTitle>
            <CardDescription>حافظ على أمان حسابك.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-border divide-y">
              {/* Change Password */}
              <div className="hover:bg-muted/10 flex flex-col p-6 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                      <RefreshCcw size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">
                        تحديث كلمة المرور
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        قم بتغيير كلمة المرور بانتظام لتعزيز الأمان.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIsChangingPasswordMode(!isChangingPasswordMode)
                    }
                  >
                    {isChangingPasswordMode ? 'إلغاء' : 'تحديث كلمة المرور'}
                  </Button>
                </div>

                {isChangingPasswordMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 space-y-6 overflow-hidden pt-4"
                  >
                    <Separator className="mb-6" />
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Left column: old password + validation hints */}
                      <div className="space-y-4">
                        <Field>
                          <FieldLabel className="text-xs font-bold tracking-wider uppercase">
                            كلمة المرور الحالية
                          </FieldLabel>
                          <PasswordInput
                            value={passwordData.oldPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                oldPassword: e.target.value,
                              })
                            }
                            placeholder="أدخل كلمة المرور الحالية"
                          />
                        </Field>

                        {/* Validation hints under old password */}
                        <div className="bg-muted/30 rounded-xl p-4">
                          {/* <h5 className="mb-3 text-xs font-bold text-gray-500 uppercase">
                            شروط كلمة المرور الجديدة:
                          </h5> */}
                          <div className="grid grid-cols-1 gap-2">
                            {passwordRequirements.map((req, index) => {
                              const isMet = req.check(passwordData.newPassword)
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  {isMet ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-gray-300" />
                                  )}
                                  <span
                                    className={
                                      isMet ? 'text-green-600' : 'text-gray-500'
                                    }
                                  >
                                    {req.label}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right column: new password + confirm password */}
                      <div className="space-y-6">
                        <Field>
                          <FieldLabel className="text-xs font-bold tracking-wider uppercase">
                            كلمة المرور الجديدة
                          </FieldLabel>
                          <PasswordInput
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="أدخل كلمة المرور الجديدة"
                          />
                        </Field>

                        <Field>
                          <FieldLabel className="text-xs font-bold tracking-wider uppercase">
                            تأكيد كلمة المرور الجديدة
                          </FieldLabel>
                          <PasswordInput
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="تأكيد كلمة المرور الجديدة"
                          />
                          {passwordData.confirmPassword &&
                            passwordData.newPassword !==
                              passwordData.confirmPassword && (
                              <p className="mt-1 text-xs text-red-500">
                                كلمة المرور غير متطابقة
                              </p>
                            )}
                        </Field>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        size="sm"
                        onClick={handleChangePassword}
                        disabled={
                          isChangingPassword ||
                          !isPasswordValid ||
                          passwordData.newPassword !==
                            passwordData.confirmPassword ||
                          !passwordData.oldPassword
                        }
                      >
                        {isChangingPassword && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        حفظ كلمة المرور الجديدة
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
          <CardContent className="flex items-center justify-between p-6 sm:p-8">
            <div className="space-y-1 pl-10">
              <h4 className="text-destructive text-sm font-bold">حذف الحساب</h4>
              <p className="text-muted-foreground max-w-lg text-xs leading-relaxed">
                سيؤدي هذا الإجراء إلى حذف بيانات شركتك بشكل نهائي. هذا الإجراء
                غير قابل للتراجع.
              </p>
            </div>
            <DeleteAlert
              title="حذف الحساب"
              description="سيؤدي هذا الإجراء إلى حذف بيانات شركتك بشكل نهائي. هذا الإجراء غير قابل للتراجع."
              onConfirm={handleDeleteAccount}
              isLoading={isDeletingAccount}
              triggerText="حذف الحساب"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
