'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/auth/use-auth'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CheckEmail() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [expiresAt, setExpiresAt] = useState<number>(Date.now() + 60000)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const { resendLink, isResendingLink } = useAuth({
    middleware: 'guest',
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
      setTimeLeft(remaining)

      if (remaining <= 0) {
        setCanResend(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  const handleResend = () => {
    if (!canResend || isResendingLink) return

    resendLink(email, {
      onSuccess: () => {
        toast.success('تم إعادة إرسال رابط التحقق')
        setExpiresAt(Date.now() + 60000)
        setCanResend(false)
      },
      onError: () => {
        toast.error('حدث خطأ أثناء إعادة إرسال الرابط')
      },
    })
  }

  return (
    <div className="mt-20 text-center">
      <p className="text-2xl font-bold">تحقق من بريدك الإلكتروني</p>
      <p className="mt-5 text-gray-500">
        لقد أرسلنا رابط تحقق إلى بريدك الإلكتروني{' '}
        <br />
        <span className="font-semibold">{email}</span>
      </p>

      <div className="mt-8">
        <Button
          onClick={handleResend}
          disabled={!canResend || isResendingLink}
          className={cn(
            ' font-medium transition-opacity',
            (!canResend || isResendingLink) && 'opacity-50',
            
          )}
        >
          {canResend ? 'أعد إرسال الرابط' : <>أعد إرسال الرابط ({timeLeft})</>}
        </Button>
      </div>
    </div>
  )
}
