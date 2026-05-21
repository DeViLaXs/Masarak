'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { gooeyToast as toast } from '@/components/ui/goey-toaster'
import { cn } from '@/lib/utils'
import { useAuth } from '@/auth/use-auth'
import { VerifyOtpDto } from '@/services/auth-service'
import AuthNavBar from './auth-navbar'

export function OTPForm({ className, ...props }: React.ComponentProps<'div'>) {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const router = useRouter()

  const [otp, setOtp] = useState<VerifyOtpDto>({
    email,
    emailConfirmationCode: '',
  })
  const isAllowed = useSyncExternalStore(
    () => () => {},
    () => Boolean(sessionStorage.getItem('otp_allowed') && email),
    () => false,
  )
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const { verifyOtp, isVerifyingOtp, resendOtp, isResendingOtp } = useAuth({
    middleware: 'guest',
  })

  useEffect(() => {
    if (!isAllowed) {
      router.replace('/login')
    }
  }, [isAllowed, router])

  useEffect(() => {
    if (canResend) return

    const timer = setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft <= 1) {
          setCanResend(true)
          return 0
        }

        return currentTimeLeft - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [canResend])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    verifyOtp(otp, {
      onSuccess: () => {
        sessionStorage.removeItem('otp_allowed')
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
        setTimeLeft(60)
        setCanResend(false)
      },
      onError: () => {
        toast.error('حدث خطأ أثناء إعادة إرسال الرمز')
      },
    })
  }

  if (!isAllowed) return null

  return (
    <div
      className={cn(
        'dark:bg-card fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden md:flex-row',
        className,
      )}
      {...props}
    >
      <div
        dir="rtl"
        className="flex h-full w-full flex-col overflow-hidden px-6 md:w-[55%] md:px-8"
      >
        <AuthNavBar />

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-lg flex-col gap-5 py-4"
          >
            <div className="mb-2 flex flex-col gap-2 text-right">
              <h1 className="text-3xl leading-tight font-extrabold text-slate-950 dark:text-white">
                رمز التحقق
              </h1>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني، أدخله لإكمال الدخول
                إلى حسابك.
              </p>
              {email && (
                <p
                  dir="ltr"
                  className="text-primary text-right text-sm font-semibold"
                >
                  {email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3.5 text-right">
              <label htmlFor="otp" className="sr-only">
                رمز التحقق
              </label>
              <InputOTP
                value={otp.emailConfirmationCode}
                onChange={(value) =>
                  setOtp({ ...otp, emailConfirmationCode: value })
                }
                maxLength={6}
                id="otp"
                required
                containerClassName="items-center justify-center gap-2 sm:gap-4"
              >
                <InputOTPGroup className="gap-1.5 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-2xl *:data-[slot=input-otp-slot]:border-2 *:data-[slot=input-otp-slot]:border-slate-300 *:data-[slot=input-otp-slot]:bg-transparent *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:text-slate-900 sm:gap-2.5 sm:*:data-[slot=input-otp-slot]:h-14 sm:*:data-[slot=input-otp-slot]:w-12 sm:*:data-[slot=input-otp-slot]:text-xl dark:*:data-[slot=input-otp-slot]:border-slate-600 dark:*:data-[slot=input-otp-slot]:text-white">
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator className="text-slate-400 dark:text-slate-500" />
                <InputOTPGroup className="gap-1.5 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-2xl *:data-[slot=input-otp-slot]:border-2 *:data-[slot=input-otp-slot]:border-slate-300 *:data-[slot=input-otp-slot]:bg-transparent *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:text-slate-900 sm:gap-2.5 sm:*:data-[slot=input-otp-slot]:h-14 sm:*:data-[slot=input-otp-slot]:w-12 sm:*:data-[slot=input-otp-slot]:text-xl dark:*:data-[slot=input-otp-slot]:border-slate-600 dark:*:data-[slot=input-otp-slot]:text-white">
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={0} />
                </InputOTPGroup>
              </InputOTP>

              <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                لم تتلق رمز التحقق؟{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isResendingOtp}
                  className={cn(
                    'text-primary font-bold transition-opacity',
                    (!canResend || isResendingOtp) && 'opacity-50',
                    canResend && 'hover:underline',
                  )}
                >
                  {canResend ? 'أعد الإرسال' : <>أعد الإرسال ({timeLeft}ث)</>}
                </button>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isVerifyingOtp}
              className="bg-primary mt-4 h-12 rounded-full text-base font-bold text-white shadow-lg shadow-[#00a2ff]/20 transition-all duration-300 hover:bg-[#008fe6]"
            >
              {isVerifyingOtp ? 'جاري التحقق...' : 'تحقق'}
            </Button>

            <div className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
              تريد استخدام حساب آخر؟{' '}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          </motion.form>
        </div>
      </div>

      <div className="relative hidden h-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#027fc7] to-[#013856] p-12 text-center text-white md:flex md:w-[45%]">
        <div className="z-10 flex max-w-sm flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="z-10 flex max-w-sm flex-col items-center gap-2"
          >
            <div className="mb-2 font-['Cairo'] text-3xl font-black tracking-wide text-white">
              Masarak | مسارك
            </div>

            <h2 className="mb-2 font-['Cairo'] text-2xl leading-tight font-black text-white">
              خطوتك القادمة تبدأ من هنا
            </h2>

            <p className="mb-8 max-w-xs font-['Cairo'] text-sm leading-relaxed font-semibold text-white/80">
              انضم إلى آلاف الشركات التي تشكل مستقبلها من خلال منصة مسارك
              المتكاملة للتوظيف.
            </p>

            <div className="mt-2 flex items-center justify-center gap-6">
              <div className="flex h-36 w-36 rotate-[-8deg] transform items-center justify-center rounded-4xl border border-white/20 bg-white/10 shadow-2xl shadow-black/10 backdrop-blur-md transition-transform duration-300 hover:rotate-0">
                <Image
                  src="/Masarak-logo-light.png"
                  alt="Masarak Logo"
                  width={130}
                  height={130}
                  className="dark:bg-card block rounded-3xl object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/Masarak-logo-dark.png"
                  alt="Masarak Logo"
                  width={130}
                  height={130}
                  className="hidden rounded-3xl bg-white object-contain dark:block"
                  priority
                />
              </div>

              <div className="flex h-36 w-36 items-center justify-center rounded-4xl border border-white/20 bg-white/10 p-2 shadow-2xl shadow-black/10 backdrop-blur-md transition-transform duration-300 hover:scale-105">
                <Image
                  src="/Masarak-new-light.png"
                  alt="Masarak Logo"
                  width={130}
                  height={130}
                  className="dark:bg-card block rounded-3xl bg-white object-contain p-1 dark:hidden"
                  priority
                />
                <Image
                  src="/Masarak-new-dark.png"
                  alt="Masarak Logo"
                  width={130}
                  height={130}
                  className="dark:bg-card hidden rounded-3xl bg-white object-contain p-1 dark:block"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div
          dir="ltr"
          className="absolute right-0 bottom-8 left-0 z-10 text-center font-['Cairo'] text-xs font-semibold text-white/60"
        >
          @Masarak. 2026
        </div>
      </div>
    </div>
  )
}
