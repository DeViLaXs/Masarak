'use client'

import React from 'react'
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
} from 'lucide-react'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUserProfile } from '@/hooks/use-users'

export default function ProfilePage() {
  const { data } = useUserProfile()
  console.log(data)

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
          <Button variant="outline" size="sm">
            إلغاء
          </Button>
          <Button size="sm">حفظ التغييرات</Button>
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
                <Avatar className="ring-background h-24 w-24 shadow-md ring-4 transition-transform group-hover:scale-105">
                  <AvatarImage src={data?.sasUrl??""} />
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    Masarak
                  </AvatarFallback>
                </Avatar>
                <div className="bg-primary text-primary-foreground ring-background hover:bg-primary/90 absolute -bottom-1 -left-1 cursor-pointer rounded-full p-2 shadow-lg ring-2 transition-colors">
                  <Camera size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">الصورة الشخصية</h4>
                <p className="text-muted-foreground text-xs">
                  تنسيق WEBP أو PNG أو JPEG، بحد أقصى 1 ميجابايت.
                </p>
                <div className="flex gap-3 pt-1">
                  <Button variant="outline" size="xs" className="h-8">
                    تحميل جديد
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-destructive hover:text-destructive hover:bg-destructive/5 h-8"
                  >
                    إزالة
                  </Button>
                </div>
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
                  value={data?.companyName ?? ''}
                  className="bg-muted/20 focus:bg-background transition-colors"
                />
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  البريد الإلكتروني
                </FieldLabel>
                <Input
                  value={data?.email ?? ''}
                  type="email"
                  className="bg-muted/20 focus:bg-background transition-colors"
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
              <div className="hover:bg-muted/10 flex items-center justify-between p-6 transition-colors">
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
                <Button variant="outline" size="sm">
                  تحديث كلمة المرور
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
          <CardContent className="flex items-center justify-between p-6 sm:p-8">
            <div className="space-y-1">
              <h4 className="text-destructive text-sm font-bold">
                إلغاء تنشيط الحساب
              </h4>
              <p className="text-muted-foreground max-w-lg text-xs leading-relaxed">
                سيؤدي هذا الإجراء إلى حذف بيانات شركتك وجميع الحسابات المرتبطة
                بها بشكل نهائي. هذا الإجراء غير قابل للتراجع.
              </p>
            </div>
            <Button
              variant="destructive"
              className="shrink-0 gap-2 font-bold shadow-sm"
            >
              <Trash2 size={16} />
              إلغاء تنشيط الشركة
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
