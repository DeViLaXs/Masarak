'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/auth/use-auth'
import AuthNavBar from './auth-navbar'
import SquareContainer from './square-container'

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
      { email: email, newPassword: password, token: token },
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

  if (!token || !email) return null

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
                إعادة تعيين كلمة المرور
              </h1>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                أدخل كلمة المرور الجديدة وأكدها للعودة إلى حسابك بأمان.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5 text-right">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  كلمة المرور الجديدة
                </label>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary focus-visible:ring-primary h-11 rounded-full border-2 border-slate-300 bg-transparent pr-5 pl-12 text-sm text-slate-900 focus:ring-2 focus-visible:ring-offset-0 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-right">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  تأكيد كلمة المرور الجديدة
                </label>
                <PasswordInput
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="focus:ring-primary focus-visible:ring-primary h-11 rounded-full border-2 border-slate-300 bg-transparent pr-5 pl-12 text-sm text-slate-900 focus:ring-2 focus-visible:ring-offset-0 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isResettingPassword}
              className="bg-primary mt-4 h-12 rounded-full text-base font-bold text-white shadow-lg shadow-[#00a2ff]/20 transition-all duration-300 hover:bg-[#008fe6]"
            >
              {isResettingPassword ? 'جاري التأكيد...' : 'تأكيد كلمة المرور'}
            </Button>
          </motion.form>
        </div>
      </div>

     {/* Right Column: Branding Panel */}
               <SquareContainer />
     
    </div>
  )
}
