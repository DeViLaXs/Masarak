'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { RegisterSubAdminDto } from '@/services/auth-service'
import { useAuth } from '@/auth/use-auth'
import { motion } from 'framer-motion'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { z } from 'zod'
import { CheckCircle2, Circle } from 'lucide-react'

// Validation Schema
const subAdminSchema = z
  .object({
    name: z.string().min(2, 'الاسم مطلوب'),
    email: z.string().email('بريد إلكتروني غير صالح'),
    phoneNumber: z
      .string()
      .min(9, 'رقم الهاتف يجب أن يكون 9 أرقام')
      .regex(/^[0-9]+$/, 'يجب أن يحتوي رقم الهاتف على أرقام فقط'),
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل')
      .regex(
        /[!@#$%^&*(),.?\":{}|<>]/,
        'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل',
      ),
    passwordConfirmation: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'كلمة المرور غير متطابقة',
    path: ['passwordConfirmation'],
  })

export default function CreateSubAdminPage() {
  const router = useRouter()
  // Ensure the user is authenticated as admin
  const {
    registerSubAdmin,
    isRegisteringSubAdmin,
    registerSubAdminError,
    role,
  } = useAuth({
    middleware: 'admin',
  })

  // Prevent SubAdmins from accessing this page
  useEffect(() => {
    if (role === 'SubAdmin') {
      router.replace('/admin')
    }
  }, [role, router])

  if (role === 'SubAdmin') {
    return null
  }

  const [form, setForm] = useState<
    RegisterSubAdminDto & { passwordConfirmation: string }
  >({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const passwordRequirements = [
    { label: '8 أحرف على الأقل', check: (p: string) => p.length >= 8 },
    { label: 'حرف كبير واحد على الأقل', check: (p: string) => /[A-Z]/.test(p) },
    { label: 'رقم واحد على الأقل', check: (p: string) => /[0-9]/.test(p) },
    {
      label: 'رمز خاص واحد على الأقل',
      check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ]

  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = subAdminSchema.safeParse(form)

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

    // Submit if valid
    const dto: RegisterSubAdminDto = {
      name: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      password: form.password,
      passwordConfirmation: form.passwordConfirmation,
    }

    registerSubAdmin(dto, {
      onSuccess: () => {
        toast.success('تم إنشاء حساب المشرف الفرعي بنجاح')
        // Reset form
        setForm({
          name: '',
          email: '',
          phoneNumber: '',
          password: '',
          passwordConfirmation: '',
        })
      },
      onError: (error: any) => {
        toast.error(
          error?.message ||
            'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.',
        )
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 pt-5 pb-10">
      

      <Card className="ring-border overflow-hidden rounded-2xl border-none shadow-sm ring-1">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">تفاصيل المشرف الفرعي</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FieldGroup className="grid gap-6 md:grid-cols-2 md:items-start">
              {/* Column 1: Info */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <Field>
                    <FieldLabel htmlFor="name">الاسم</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      className="w-full sm:max-w-md"
                      value={form.name}
                      onChange={(e) =>
                        handleFieldChange('name', e.target.value)
                      }
                    />
                    {errors.name && (
                      <span className="pr-1 text-xs text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </Field>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Field>
                    <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      className="w-full sm:max-w-md"
                      value={form.email}
                      onChange={(e) =>
                        handleFieldChange('email', e.target.value)
                      }
                    />
                    {errors.email && (
                      <span className="pr-1 text-xs text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </Field>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Field>
                    <FieldLabel htmlFor="phone">رقم الهاتف</FieldLabel>
                    <Input
                      id="phone"
                      className="w-full text-right sm:max-w-md"
                      type="text"
                      value={form.phoneNumber}
                      onChange={(e) =>
                        handleFieldChange('phoneNumber', e.target.value)
                      }
                    />
                    {errors.phoneNumber && (
                      <span className="pr-1 text-xs text-red-500">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </Field>
                </motion.div>
              </div>

              {/* Column 2: Password & Hints */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Field>
                    <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                    <PasswordInput
                      id="password"
                      className="w-full sm:max-w-md"
                      value={form.password}
                      onChange={(e) =>
                        handleFieldChange('password', e.target.value)
                      }
                    />
                    {errors.password && (
                      <span className="mt-1 block pr-1 text-xs text-red-500">
                        {errors.password}
                      </span>
                    )}
                  </Field>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      تأكيد كلمة المرور
                    </FieldLabel>
                    <PasswordInput
                      id="confirm-password"
                      className="w-full sm:max-w-md"
                      value={form.passwordConfirmation}
                      onChange={(e) =>
                        handleFieldChange(
                          'passwordConfirmation',
                          e.target.value,
                        )
                      }
                    />
                    {errors.passwordConfirmation && (
                      <span className="mt-1 block pr-1 text-xs text-red-500">
                        {errors.passwordConfirmation}
                      </span>
                    )}
                  </Field>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <div className="bg-muted/30 flex w-full flex-col justify-center space-y-3 rounded-xl p-4 sm:max-w-md">
                    <h5 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      متطلبات كلمة المرور:
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {passwordRequirements.map((req, index) => {
                        const isMet = req.check(form.password || '')
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
                </motion.div>
              </div>
            </FieldGroup>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex justify-end pt-4"
            >
              <Button
                type="submit"
                disabled={isRegisteringSubAdmin}
                className="w-full px-8 sm:w-auto"
              >
                {isRegisteringSubAdmin
                  ? 'جاري الإنشاء...'
                  : 'إنشاء حساب المشرف'}
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </div>
  )
}
