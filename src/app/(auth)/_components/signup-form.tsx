'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import { RegisterDto } from '@/services/auth-service'
import { useAuth } from '@/auth/use-auth'
import { motion } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { z } from 'zod'

// 1. Simple Validation Schema
const signupSchema = z
  .object({
    CompanyName: z.string().min(2, 'اسم الشركة مطلوب'),
    Email: z.string().email('بريد إلكتروني غير صالح'),
    PhoneNumber: z
      .string()
      .min(9, 'رقم الهاتف يجب أن يكون 9 أرقام')
      .regex(/^[0-9]+$/, 'يجب أن يحتوي رقم الهاتف على أرقام فقط'),
    Industry: z.string().min(2, 'يرجى إدخال اسم الصناعة'),
    LogoUrl: z
      .any()
      .refine((file) => file instanceof File, 'يرجى اختيار شعار الشركة')
      .refine(
        (file) => !file || file.size <= 1024 * 1024,
        'حجم الصورة يجب أن يكون أقل من 1 ميجابايت',
      )
      .refine((file) => {
        if (!file) return true
        const fileName = file.name.toLowerCase()
        return (
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png') ||
          fileName.endsWith('.webp')
        )
      }, 'الصورة يجب أن تكون من نوع jpeg أو png أو webp'),
    Password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    PasswordConfirmation: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine((data) => data.Password === data.PasswordConfirmation, {
    message: 'كلمة المرور غير متطابقة',
    path: ['PasswordConfirmation'],
  })

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { register, isRegistering, registerError } = useAuth({
    middleware: 'guest',
  })

  // 2. Form & Error State
  const [registerForm, setRegisterForm] = useState<RegisterDto>({
    CompanyName: '',
    Email: '',
    Password: '',
    PasswordConfirmation: '',
    PhoneNumber: '',
    Industry: '',
    LogoUrl: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 3. Helper to update field and clear its error
  const handleFieldChange = (field: keyof RegisterDto, value: any) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }))
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

    // 4. Validate using Zod
    const result = signupSchema.safeParse(registerForm)

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

    // 5. Submit if valid
    register(registerForm, {
      onSuccess: () => {
        router.push(`/otp?email=${encodeURIComponent(registerForm.Email)}`)
        toast.success('تم إنشاء الحساب بنجاح')
      },
    })
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <Image
                  src="/Masarak-logo.png"
                  className="hidden dark:block"
                  alt="Logo"
                  width={30}
                  height={30}
                />

                <Image
                  src="/Masarak-logo-dark.png"
                  className="block dark:hidden"
                  alt="Logo"
                  width={30}
                  height={30}
                />
                <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Field>
                  <FieldLabel htmlFor="name">اسم الشركة</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    onChange={(e) =>
                      handleFieldChange('CompanyName', e.target.value)
                    }
                  />
                  {errors.CompanyName && (
                    <span className="pr-1 text-xs text-red-500">
                      {errors.CompanyName}
                    </span>
                  )}
                </Field>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Field>
                  <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => handleFieldChange('Email', e.target.value)}
                  />
                  {(errors.Email || registerError) && (
                    <span className="pr-1 text-xs text-red-500">
                      {errors.Email || registerError?.message}
                    </span>
                  )}
                </Field>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="phone">رقم الهاتف</FieldLabel>
                      <Input
                        id="phone"
                        type="text"
                        onChange={(e) =>
                          handleFieldChange('PhoneNumber', e.target.value)
                        }
                      />
                      {errors.PhoneNumber && (
                        <span className="pr-1 text-xs text-red-500">
                          {errors.PhoneNumber}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="industry">الصناعة</FieldLabel>
                      <Input
                        id="industry"
                        type="text"
                        onChange={(e) =>
                          handleFieldChange('Industry', e.target.value)
                        }
                      />
                      {errors.Industry && (
                        <span className="pr-1 text-xs text-red-500">
                          {errors.Industry}
                        </span>
                      )}
                    </Field>
                  </Field>
                </Field>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Field>
                  <FieldLabel htmlFor="logo">شعار الشركة</FieldLabel>
                  <Input
                    id="logo"
                    type="file"
                    accept=".jpeg,.png,.webp"
                    onChange={(e) =>
                      handleFieldChange('LogoUrl', e.target.files?.[0] || null)
                    }
                  />
                  {errors.LogoUrl && (
                    <span className="pr-1 text-xs text-red-500">
                      {errors.LogoUrl}
                    </span>
                  )}
                  <FieldDescription className='text-xs text-black/60'>
               يجب ان تكون الصورة اقل من 1 ميجابايت ومن نوع  jpeg, png, webp 
                  </FieldDescription>
                </Field>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                      <PasswordInput
                        id="password"
                        onChange={(e) =>
                          handleFieldChange('Password', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        تأكيد كلمة المرور
                      </FieldLabel>
                      <PasswordInput
                        id="confirm-password"
                        onChange={(e) =>
                          handleFieldChange(
                            'PasswordConfirmation',
                            e.target.value,
                          )
                        }
                      />
                    </Field>
                  </Field>
                  {errors.Password && (
                    <span className="pr-1 text-xs text-red-500">
                      {errors.Password}
                    </span>
                  )}
                  {errors.PasswordConfirmation && (
                    <span className="pr-1 text-xs text-red-500">
                      {errors.PasswordConfirmation}
                    </span>
                  )}
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Field>
                  <Button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full"
                  >
                    {isRegistering ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                  </Button>
                </Field>
                <FieldDescription className="pt-4 text-center">
                  لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
                </FieldDescription>
              </motion.div>
            </FieldGroup>
          </motion.form>
          <div className="relative hidden md:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
              }}
            >
              <Image
                src="/auth-background.jpg"
                alt="Image"
                fill
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute bottom-0 left-25 hidden -translate-x-1/2 -translate-y-1/2 dark:block"
            ></motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
