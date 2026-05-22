'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/auth/use-auth'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { Rocket } from 'lucide-react'
import AuthNavBar from './auth-navbar'
import { Squada_One } from 'next/font/google'
import SquareContainer from './square-container'

export function ForgetPassword({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('')
  const { forgetPassword, isRequestingReset } = useAuth({ middleware: 'guest' })
  const router = useRouter()

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

  return (
    <div className="fixed inset-0 z-50 dark:bg-accent flex flex-col md:flex-row overflow-hidden w-full h-full" {...props}>

      {/* Left Column: Forget Password Form */}
      <div
        dir="rtl"
        className="w-full md:w-[55%] h-full dark:bg-card flex flex-col px-6 md:px-8 overflow-hidden"
      >
        {/* Top Header */}
        <AuthNavBar />

        {/* Center Form Container Wrapper */}
        <div className="flex-1 w-full flex flex-col justify-center items-center">
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full max-w-lg mx-auto py-4"
          >
            {/* Title Header */}
            <div className="flex flex-col gap-2 text-right mb-2">
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white leading-tight">
                نسيت كلمة المرور؟
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5 text-right">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                className="h-11 px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isRequestingReset}
              className="rounded-full h-12 mt-4 bg-primary hover:bg-[#008fe6] text-white text-base font-bold shadow-lg shadow-[#00a2ff]/20 transition-all duration-300"
            >
              {isRequestingReset ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </Button>

            {/* Back to Login link */}
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
              تذكرت كلمة المرور؟ <Link href="/login" className="text-primary font-bold hover:underline">تسجيل الدخول</Link>
            </div>
          </motion.form>
        </div>

      </div>
     {/* Right Column: Branding Panel */}
               <SquareContainer />
     

    </div>
  )
}
