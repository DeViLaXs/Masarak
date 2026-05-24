'use client'

import React, { useState } from 'react'
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
  Loader2,
} from 'lucide-react'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-users'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { useRouter } from 'next/navigation'
import { DeleteAlert } from '@/components/delete-alert'
import { PasswordInput } from '@/components/ui/password-input'
import { z } from 'zod'
import { Check, X, Circle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const {
    user,
    isLoading,
    deleteAccount,
    isDeletingAccount,
    changePassword,
    isChangingPassword,
  } = useUser()

  const [isChangingPasswordMode, setIsChangingPasswordMode] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

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
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            إعدادات الملف الشخصي
          </h1>
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
            <CardDescription>التفاصيل الأساسية لملفك الشخصي.</CardDescription>
            <Separator className="mt-5" />
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <div className="group relative">
                <Avatar className="ring-background h-24 w-24 bg-white p-2 shadow-md ring-4 transition-transform hover:scale-105">
                  <AvatarImage
                    src="/Masarak-logo.png"
                    alt="Logo"
                    className="object-contain"
                  />
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    Masarak
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">شعار المنصة الرسمي</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  هذا هو الشعار الرسمي المعتمد للمنصة. <br />
                  لا يمكن للمسؤولين تغيير شعار النظام.
                </p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Form Fields Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  اسم المسؤول
                </FieldLabel>
                <Input
                  value={user?.name ?? ''}
                  readOnly
                  className="bg-muted/10 cursor-not-allowed opacity-70"
                />
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  رقم الهاتف
                </FieldLabel>
                <Input
                  value={user?.phoneNumber ?? ''}
                  readOnly
                  className="bg-muted/10 cursor-not-allowed opacity-70"
                />
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
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Section */}
        <Card className="ring-border overflow-hidden rounded-2xl border-none shadow-sm ring-1">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg">الأمان والوصول</CardTitle>
            <CardDescription>
              حافظ على أمان حسابك وإدارة المصادقة.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-border divide-y">
              {/* Reset Password */}
              <div className="hover:bg-muted/10 flex flex-col p-6 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                      <RefreshCcw size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">
                        إعادة تعيين كلمة المرور
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
                    {isChangingPasswordMode
                      ? 'إلغاء التغيير'
                      : 'تحديث كلمة المرور'}
                  </Button>
                </div>

                {isChangingPasswordMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-border/50 mt-6 border-t pt-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
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
                        />
                      </Field>

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
                          />
                        </Field>

                        <div className="bg-muted/30 space-y-3 rounded-xl p-4">
                          <h5 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            متطلبات كلمة المرور:
                          </h5>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {passwordRequirements.map((req, index) => {
                              const isMet = req.check(passwordData.newPassword)
                              return (
                                <div
                                  key={index}
                                  className={cn(
                                    'flex items-center gap-2 text-[11px] transition-colors',
                                    isMet
                                      ? 'font-medium text-green-600 dark:text-green-400'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  {isMet ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  ) : (
                                    <Circle className="h-3.5 w-3.5" />
                                  )}
                                  <span>{req.label}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !isPasswordValid}
                          >
                            {isChangingPassword ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="mr-2 h-4 w-4" />
                            )}
                            حفظ كلمة المرور الجديدة
                          </Button>
                        </div>
                      </div>
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
            <div className="space-y-1">
              <h4 className="text-destructive text-sm font-bold">
              حذف الحساب
              </h4>
              <p className="text-muted-foreground max-w-lg text-xs leading-relaxed pl-7">
                سيؤدي هذا الإجراء إلى حذف بيانات شركتك وجميع الحسابات المرتبطة
                بها بشكل نهائي. هذا الإجراء غير قابل للتراجع.
              </p>
            </div>
            <DeleteAlert
              title="حذف الحساب"
              description="سيؤدي هذا الإجراء إلى حذف بيانات شركتك وجميع الحسابات المرتبطة بها بشكل نهائي. هذا الإجراء غير قابل للتراجع."
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
