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
          <div className="hidden md:flex md:w-[45%] h-full flex-col justify-center items-center text-center p-12 text-white relative overflow-hidden bg-linear-to-br from-[#027fc7] to-[#013856]">
    
            {/* Content Container */}
            <div className="flex flex-col items-center max-w-sm z-10 gap-2">
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="flex flex-col items-center max-w-sm z-10 gap-2"
              >
              {/* Logo Text */}
              <div className="text-3xl font-black tracking-wide text-white mb-2 font-['Cairo']">
                Masarak | مسارك
              </div>
    
              <h2 className="text-2xl font-black text-white leading-tight mb-2 font-['Cairo']">
                خطوتك القادمة تبدأ من هنا
              </h2>
    
              <p className="text-sm font-semibold text-white/80 leading-relaxed max-w-xs mb-8 font-['Cairo']">
                انضم إلى آلاف الشركات التي تشكل مستقبلها من خلال منصة مسارك المتكاملة للتوظيف.
              </p>
    
              {/* Squares Container */}
              <div className="flex items-center justify-center gap-6 mt-2">
                {/* Left Square (Tilted) */}
                <div className="w-36 h-36 rounded-4xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/10 transform rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
                  <Image
                    src="/masarak-logo-light.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain  dark:bg-card rounded-3xl  block dark:hidden"
                    priority
                  />
                  <Image
                    src="/masarak-logo-dark.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain bg-white rounded-3xl hidden dark:block"
                    priority
                  />
                </div>
    
                {/* Right Square (Straight) */}
                <div className="w-36 h-36 rounded-4xl border p-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/10 transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/masarak-new-light.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain bg-white dark:bg-card rounded-3xl p-1 block dark:hidden"
                    priority
                  />
                  <Image
                    src="/masarak-new-dark.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain bg-white rounded-3xl dark:bg-card p-1 hidden dark:block"
                    priority
                  />
                </div>
              </div>
              </motion.form>
            </div>
    
            {/* Footer / Copyright */}
            <div dir='ltr' className="absolute bottom-8 left-0 right-0 text-xs text-white/60 font-semibold z-10 font-['Cairo'] text-center">
              @Masarak. 2026
            </div>
          </div>

    </div>
  )
}
