'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { gooeyToast as toast } from '@/components/ui/goey-toaster'
import { cn } from '@/lib/utils'
import { useAuth } from '@/auth/use-auth'
import AuthNavBar from '../_components/auth-navbar'
import SquareContainer from '../_components/square-container'

export default function CheckEmail() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const router = useRouter()

  const isAllowed = useSyncExternalStore(
    () => () => {},
    () => Boolean(sessionStorage.getItem('check_email_allowed') && email),
    () => false,
  )
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const { resendLink, isResendingLink } = useAuth({})

  
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

  const handleResend = () => {
    if (!canResend || isResendingLink) return

    resendLink(email, {
      onSuccess: () => {
        toast.success('تم إعادة إرسال رابط التحقق')
        setTimeLeft(60)
        setCanResend(false)
      },
      onError: () => {
        toast.error('حدث خطأ أثناء إعادة إرسال الرابط')
      },
    })
  }

  

  return (
    <div className="dark:bg-card fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden md:flex-row">
      <div
        dir="rtl"
        className="flex h-full w-full flex-col overflow-hidden px-6 md:w-[55%] md:px-8"
      >
        <AuthNavBar />

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex w-full max-w-lg flex-col gap-5 py-4"
          >
            <div className="mb-2 flex flex-col gap-2 text-right">
              <h1 className="text-3xl leading-tight font-extrabold text-slate-950 dark:text-white">
                تحقق من بريدك الإلكتروني
              </h1>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني. افتح الرابط لإكمال
                إعادة تعيين كلمة المرور.
              </p>
              <p
                dir="ltr"
                className="text-primary text-right text-sm font-semibold"
              >
                {email}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResendingLink}
              className={cn(
                'bg-primary mt-4 h-12 rounded-full text-base font-bold text-white shadow-lg shadow-[#00a2ff]/20 transition-all duration-300 hover:bg-[#008fe6]',
                (!canResend || isResendingLink) && 'opacity-50',
              )}
            >
              {canResend ? (
                'أعد إرسال الرابط'
              ) : (
                <>أعد إرسال الرابط ({timeLeft}ث)</>
              )}
            </Button>

            <div className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
              تذكرت كلمة المرور؟{' '}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

     <SquareContainer/>
    </div>
  )
}
