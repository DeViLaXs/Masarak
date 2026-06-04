'use client'

import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/auth/use-auth'
import type { LoginDto } from '@/services/auth-service'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { Rocket } from 'lucide-react'
import AuthNavBar from './auth-navbar'
import SquareContainer from './square-container'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [loginForm, setLoginForm] = useState<LoginDto>({
    email: '',
    password: '',
  })

  const { login, isLoggingIn, loginError } = useAuth({ middleware: 'guest' })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(loginForm, {
      onError: (err: any) => {
        if (err.status === 401) {
          sessionStorage.setItem('otp_allowed', '1')
          router.push(`/otp?email=${encodeURIComponent(loginForm.email)}`)
        }
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 dark:bg-card flex flex-col md:flex-row overflow-hidden w-full h-full" {...props}>

      {/* Left Column: Login Form */}
      <div
        dir="rtl"
        className="w-full md:w-[55%] h-full flex flex-col px-6 md:px-8 overflow-hidden"
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
            className="flex flex-col gap-4 w-full max-w-lg mx-auto py-4"
          >
            {/* Title Header */}
            <div className="flex flex-col gap-1.5 text-right mb-1">
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white leading-tight">مرحباً بك مجدداً</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">سجل دخولك للوصول إلى لوحة التحكم</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5">

              {/* Email Field */}
              <div className="flex flex-col gap-1.5 text-right">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
                <Input
                  id="email"
                  type="email"
                  className="h-11 px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
                {loginError?.message && (
                  <span className="text-xs text-red-500 pr-2">{loginError.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5 text-right">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">كلمة المرور</label>
                </div>
                <PasswordInput
                  id="password"
                  className="h-11 pl-12 pr-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <Link href="/forget-password" className="w-fit text-sm font-semibold pt-3 text-primary ">
                  نسيت كلمة المرور؟
                </Link>
              </div>

            </div>

            {/* Submit Button — same style as register */}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="rounded-full h-12 mt-4 bg-primary hover:bg-[#008fe6] text-white text-base font-bold shadow-lg shadow-[#00a2ff]/20 transition-all duration-300"
            >
              {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            {/* Central Footer link */}
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
              ليس لديك حساب؟ <Link href="/register" className="text-primary font-bold hover:underline">إنشاء حساب</Link>
            </div>
          </motion.form>
        </div>



      </div>

      {/* Right Column: Branding Panel */}
      <SquareContainer />

    </div>
  )
}
