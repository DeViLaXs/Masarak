'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/auth/use-auth'

export function NewPassword({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const { resetPassword, isResettingPassword } = useAuth({
    middleware: 'guest',
  })

  useEffect(() => {
    if (!token || !email) {
      router.replace('/login')
    }
  }, [token, email, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('كلمة المرور غير متطابقة')
      return
    }
    resetPassword(
      { Email: email, NewPassword: password, Token: token },
      {
        onSuccess: () => {
          router.push('/login')
        },
        onError: (error) => {
          alert(error.message)
        },
      },
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="mb-7 text-xl">
            إعادة تعيين كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">
                  ادخل كلمة المرور الجديدة
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirm-password">
                    ادخل كلمة المرور الجديدة مرة أخرى
                  </FieldLabel>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isResettingPassword}>
                  {isResettingPassword ? 'جاري التأكيد...' : 'تأكيد'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
