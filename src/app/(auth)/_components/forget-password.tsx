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
import { useRouter } from 'next/navigation'
import { useAuth } from '@/auth/use-auth'
import { useState, useEffect } from 'react'

export function ForgetPassword({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()

  //const [isAllowed, setIsAllowed] = useState(false)
  const [email, setEmail] = useState('')

  // 🛡️ Guard: only accessible via the login page link
  // useEffect(() => {
  //   const allowed = sessionStorage.getItem('forget_password_allowed')
  //   if (!allowed) {
  //     router.replace('/login')
  //     return
  //   }
  //   setIsAllowed(true)
  // }, [])

  // useEffect(() => {
  //   const allowed = sessionStorage.getItem('forget_password_allowed')
  //   if (!allowed) {
  //     router.replace('/login')
  //     return
  //   }
  //   setIsAllowed(true)
  // }, [])

 


  const { forgetPassword, isRequestingReset } = useAuth({ middleware: 'guest' })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    forgetPassword(
      { email: email },
      {
        onSuccess: () => {
          sessionStorage.setItem('check_email_allowed', '1')
          router.push(`/check-email?email=${encodeURIComponent(email)}`)
        },
        onError: (error) => {
          alert(error.message)
        },
      },
    )
  }

  //if (!isAllowed) return null

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="mt-20">
        <CardHeader className="text-center">
          <CardTitle className="mb-5 text-xl">نسيت كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isRequestingReset}>
                  {isRequestingReset ? 'جاري الارسال...' : 'ارسال'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
