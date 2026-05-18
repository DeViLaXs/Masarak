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

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/auth/use-auth'
import type { LoginDto } from '@/services/auth-service'
import Image from 'next/image'
import { PasswordInput } from '@/components/ui/password-input'
import { motion } from 'framer-motion'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { useRouter } from 'next/navigation'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [loginForm, setLoginForm] = useState<LoginDto>({
    email: '',
    password: '',
  })

  const { login, isLoggingIn, loginError } = useAuth({ middleware: 'guest' })

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(loginForm, {
      onError: (err: any) => {
        console.log(err)
        if (err.status === 401) {
          sessionStorage.setItem('otp_allowed', '1')
          router.push(`/otp?email=${encodeURIComponent(loginForm.email)}`)
        }
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

                <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Field>
                  <FieldLabel htmlFor="email">البريد الالكتروني</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        email: e.target.value,
                      })
                    }
                  />
                  <FieldDescription className="text-xs text-red-500">
                    {loginError?.message}
                  </FieldDescription>
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Field>
                  <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                  <PasswordInput
                    id="password"
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        password: e.target.value,
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
                  <button
                    type="button"
                    className="text-sm underline-offset-4 hover:underline"
                    onClick={() => {
                      router.push('/forget-password')
                    }}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Field>
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full"
                  >
                    {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </Field>
                <FieldDescription className="pt-4 text-center">
                  ليس لديك حساب؟ <Link href="/register">سجل الأن</Link>
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
              transition={{
                duration: 0.4,
                scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
              }}
              className="absolute right-20 bottom-0 hidden -translate-x-1/2 -translate-y-1/2 dark:block"
            ></motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
