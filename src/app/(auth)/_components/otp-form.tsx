'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useEffect, useState } from 'react'
import { VerifyOtpDto } from '@/services/auth-service'
import { useAuth } from '@/auth/use-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export function OTPForm({ className, ...props }: React.ComponentProps<'div'>) {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  console.log(email)

  const router = useRouter()
  const [otp, setOtp] = useState<VerifyOtpDto>({
    Email: email,
    EmailConfirmationCode: '',
  })

  const [expiresAt, setExpiresAt] = useState<number>(Date.now() + 60000)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const { verifyOtp, isVerifyingOtp, resendOtp, isResendingOtp } = useAuth({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    verifyOtp(otp, {
      onSuccess: () => {
        toast.success('تم التحقق بنجاح')
        router.push('/company')
      },
      onError: () => {
        toast.error('رمز التحقق غير صحيح')
      },
    })
  }

  const handleResend = () => {
    if (!canResend || isResendingOtp) return

    resendOtp(email, {
      onSuccess: () => {
        toast.success('تم إعادة إرسال رمز التحقق')
        setExpiresAt(Date.now() + 60000)
        setCanResend(false)
      },
      onError: () => {
        toast.error('حدث خطأ أثناء إعادة إرسال الرمز')
      },
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="text-primary mb-5 flex size-8 items-center justify-center rounded-md text-xl font-bold">
                Masarak
              </div>
            </Link>
            <h1 className="text-xl font-bold">رمز التحقق</h1>
            <FieldDescription>
              تم ارسال رمز التحقق الى بريدك الالكتروني
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              رمز التحقق
            </FieldLabel>
            <InputOTP
              value={otp.EmailConfirmationCode}
              onChange={(e) => setOtp({ ...otp, EmailConfirmationCode: e })}
              maxLength={6}
              id="otp"
              required
              containerClassName="gap-2 sm:gap-4 item-center justify-center"
            >
              <InputOTPGroup className="gap-1.5 *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg sm:gap-2.5 sm:*:data-[slot=input-otp-slot]:h-16 sm:*:data-[slot=input-otp-slot]:w-12 sm:*:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={5} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-1.5 *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg sm:gap-2.5 sm:*:data-[slot=input-otp-slot]:h-16 sm:*:data-[slot=input-otp-slot]:w-12 sm:*:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={0} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              لم تلقي رمز التحقق؟{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResendingOtp}
                className={cn(
                  'text-primary font-medium transition-opacity',
                  (!canResend || isResendingOtp) && 'opacity-50',
                  canResend && 'hover:underline',
                )}
              >
                {canResend ? 'أعد الارسال' : <>أعد الارسال ({timeLeft}ث)</>}
              </button>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={isVerifyingOtp}>
              تحقق
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
