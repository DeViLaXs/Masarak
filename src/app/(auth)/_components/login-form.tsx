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
    // <div className={cn('flex flex-col gap-6', className)} {...props}>
    //   <Card>
    //     <CardHeader className="text-center">
    //       <CardTitle className="text-xl">مرحباً بك مجدداً</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <form onSubmit={handleSubmit}>
    //         <FieldGroup>
    //           <Field>
    //             <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
    //             <Input
    //               id="email"
    //               type="email"
    //               value={loginForm.Email}
    //               onChange={(e) =>
    //                 setLoginForm({ ...loginForm, Email: e.target.value })
    //               }
    //               required
    //             />
    //           </Field>
    //           <Field>
    //             <div className="flex items-center">
    //               <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
    //             </div>
    //             <Input
    //               id="password"
    //               type="password"
    //               value={loginForm.Password}
    //               onChange={(e) =>
    //                 setLoginForm({ ...loginForm, Password: e.target.value })
    //               }
    //               required
    //             />
    //             <Link
    //               href="/forget-password"
    //               className="ml-auto text-sm underline-offset-4 hover:underline"
    //             >
    //               نسيت كلمة المرور
    //             </Link>
    //           </Field>

    //           {loginError && (
    //             <p className="text-destructive text-center text-sm">
    //               فشل تسجيل الدخول، يرجى التحقق من البيانات
    //             </p>
    //           )}

    //           <Field>
    //             <Button type="submit" disabled={isLoggingIn} className="w-full">
    //               {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
    //             </Button>

    //             <FieldDescription className="text-center">
    //               ليس لديك حساب؟<Link href="/register">سجل الأن</Link>
    //             </FieldDescription>
    //           </Field>
    //         </FieldGroup>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden md:block">
            <Image
              src="/auth-background.jpg"
              alt="Image"
              fill
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>
            <Image
              src="/masarak-dark.png"
              className="absolute bottom-0 -right-20 hidden -translate-x-1/2 -translate-y-1/2 dark:block"
              alt="Logo"
              width={200}
              height={200}
            />
          </div>
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
              </div>

              <Field>
                <FieldLabel htmlFor="email">البريد الالكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      Email: e.target.value,
                    })
                  }
                />
              </Field>

              
                  <Field>
                    <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                    <PasswordInput
                      id="password"
                      required
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          Password: e.target.value,
                        })
                      }
                    />
                  </Field>
              

              <Field>
                <Button type="submit">إنشاء حساب</Button>
              </Field>
              <FieldDescription className="text-center">
               ليس لديك حساب؟ <Link href="/register">سجل الأن</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          
        </CardContent>
      </Card>
    </div>
  )
}
