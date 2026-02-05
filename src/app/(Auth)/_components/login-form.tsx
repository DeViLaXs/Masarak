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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [loginForm, setLoginForm] = useState<LoginDto>({
    Email: '',
    Password: '',
  })

  const { login, isLoggingIn, loginError } = useAuth({ middleware: 'guest' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(loginForm)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">مرحباً بك مجدداً</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.Email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, Email: e.target.value })
                  }
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.Password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, Password: e.target.value })
                  }
                  required
                />
                <Link
                  href="/forget-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  نسيت كلمة المرور
                </Link>
              </Field>

              {loginError && (
                <p className="text-destructive text-center text-sm">
                  فشل تسجيل الدخول، يرجى التحقق من البيانات
                </p>
              )}

              <Field>
                <Button type="submit" disabled={isLoggingIn} className="w-full">
                  {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>

                <FieldDescription className="text-center">
                  ليس لديك حساب؟<Link href="/register">سجل الأن</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
