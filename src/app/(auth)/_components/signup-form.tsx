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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { register, isRegistering, registerError } = useAuth({
    middleware: 'guest',
  })

  const [registerForm, setRegisterForm] = useState<RegisterDto>({
    CompanyName: '',
    Email: '',
    Password: '',
    PasswordConfirmation: '',
    PhoneNumber: '',
    Industry: '',
    LogoUrl: null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(registerForm, {
      onSuccess: () => {
        router.push(`/otp?email=${encodeURIComponent(registerForm.Email)}`)
        console.log('Registration successful')
      },
      onError: (error) => {
        console.error('Registration failed:', error)
        alert('Registration failed')
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
                    required
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        CompanyName: e.target.value,
                      })
                    }
                  />
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
                    required
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        Email: e.target.value,
                      })
                    }
                  />
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
                        required
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            PhoneNumber: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="industry">الصناعة</FieldLabel>
                      <Input
                        id="industry"
                        type="text"
                        required
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            Industry: e.target.value,
                          })
                        }
                      />
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
                    required
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        LogoUrl: e.target.files?.[0] || null,
                      })
                    }
                  />
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
                        required
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            Password: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        تأكيد كلمة المرور
                      </FieldLabel>
                      <PasswordInput
                        id="confirm-password"
                        required
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            PasswordConfirmation: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </Field>
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Field>
                  <Button type="submit">إنشاء حساب</Button>
                </Field>
                <FieldDescription className="pt-4 text-center">
                  لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
                </FieldDescription>
              </motion.div>
            </FieldGroup>
          </motion.form>
          <div className="relative hidden md:block">
            <Image
              src="/auth-background.jpg"
              alt="Image"
              fill
              className="absolute inset-0 h-full w-full object-cover"
            />
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
