'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RegisterDto } from '@/services/auth-service'
import { useAuth } from '@/auth/use-auth'
import { motion } from 'framer-motion'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { z } from 'zod'
import { CheckCircle2, Circle, Upload, Rocket } from 'lucide-react'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import AuthNavBar from './auth-navbar'

// 1. Validation Schema
const signupSchema = z
  .object({
    name: z.string().min(2, 'اسم الشركة مطلوب'),
    email: z.string().email('بريد إلكتروني غير صالح'),
    phoneNumber: z
      .string()
      .min(9, 'رقم الهاتف يجب أن يكون 9 أرقام')
      .regex(/^[0-9]+$/, 'يجب أن يحتوي رقم الهاتف على أرقام فقط'),
    industry: z.string().min(2, 'يرجى إدخال اسم الصناعة'),
    logoUrl: z
      .any()
      .refine((file) => file instanceof File, 'يرجى اختيار شعار الشركة')
      .refine(
        (file) => !file || file.size <= 1024 * 1024,
        'حجم الصورة يجب أن يكون أقل من 1 ميجابايت',
      )
      .refine((file) => {
        if (!file) return true
        const fileName = file.name.toLowerCase()
        return (
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png') ||
          fileName.endsWith('.webp')
        )
      }, 'الصورة يجب أن تكون من نوع jpeg أو png أو webp'),
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل')
      .regex(
        /[!@#$%^&*(),.?\":{}|<>]/,
        'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل',
      ),
    passwordConfirmation: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'كلمة المرور غير متطابقة',
    path: ['passwordConfirmation'],
  })

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { register, isRegistering, registerError } = useAuth({
    middleware: 'guest',
  })

  // 2. Form & Error State
  const [registerForm, setRegisterForm] = useState<RegisterDto>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    phoneNumber: '',
    industry: '',
    logoUrl: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const passwordRequirements = [
    { label: '8 أحرف على الأقل', check: (p: string) => p.length >= 8 },
    { label: 'حرف كبير واحد على الأقل', check: (p: string) => /[A-Z]/.test(p) },
    { label: 'رقم واحد على الأقل', check: (p: string) => /[0-9]/.test(p) },
    {
      label: 'رمز خاص واحد على الأقل',
      check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ]

  // 3. Helper to update field and clear its error
  const handleFieldChange = (field: keyof RegisterDto, value: any) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = signupSchema.safeParse(registerForm)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = err.path[0]
        if (path) {
          fieldErrors[path.toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    register(registerForm, {
      onSuccess: () => {
        sessionStorage.setItem('otp_allowed', '1')
        router.push(`/otp?email=${encodeURIComponent(registerForm.email)}`)
        toast.success('تم إنشاء الحساب بنجاح')
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 dark:bg-card flex flex-col md:flex-row overflow-hidden w-full h-full" {...props}>

      {/* Left Column: Register Form */}
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
            className="flex flex-col gap-4 w-full max-w-lg mx-auto "
          >

            {/* Title Header */}
            <div className="flex flex-col gap-1.5 text-right mb-1">
              <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 leading-tight ">إنشاء حساب جديد</h1>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5">

              {/* Company Name & Logo Side-by-side */}
              <div className="grid grid-cols-2 gap-4">


                {/* Company Name (Right in RTL grid) */}
                <div className="flex flex-col gap-1.5 text-right">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">اسم الشركة</label>
                  <Input
                    id="name"
                    type="text"
                    className="h-11 px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={registerForm.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 pr-2">{errors.name}</span>
                  )}
                </div>

                {/* Company Logo Upload (Left in RTL grid) */}
                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">شعار الشركة</label>
                  <label
                    htmlFor="logo"
                    className="flex items-center justify-between h-11 px-5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-30">
                      {registerForm.logoUrl ? (registerForm.logoUrl as File).name : 'اضغط لرفع الشعار'}
                    </span>
                    <Upload className="h-4 w-4 text-slate-400 shrink-0" />
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept=".jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => handleFieldChange('logoUrl', e.target.files?.[0] || null)}
                  />
                  {errors.logoUrl && (
                    <span className="text-xs text-red-500 pr-2">{errors.logoUrl}</span>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5 text-right">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
                <Input
                  id="email"
                  type="email"
                  className="h-11 px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                  value={registerForm.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
                {(errors.email || registerError) && (
                  <span className="text-xs text-red-500 pr-2">
                    {errors.email || registerError?.message}
                  </span>
                )}
              </div>

              {/* Phone & Industry Side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Phone Number - Left in RTL */}
                <div className="flex flex-col gap-1.5 text-right">
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="05xxxxxxxx"
                    className="h-11 px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={registerForm.phoneNumber}
                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                  />
                  {errors.phoneNumber && (
                    <span className="text-xs text-red-500 pr-2">{errors.phoneNumber}</span>
                  )}
                </div>

                {/* Work Field - Right in RTL */}
                <div className="flex flex-col gap-1.5 text-right">
                  <label htmlFor="industry" className="text-sm font-semibold text-slate-700 dark:text-slate-300">مجال العمل</label>
                  <Input
                    id="industry"
                    type="text"
                    className="h-11 px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={registerForm.industry}
                    onChange={(e) => handleFieldChange('industry', e.target.value)}
                  />
                  {errors.industry && (
                    <span className="text-xs text-red-500 pr-2">{errors.industry}</span>
                  )}
                </div>
              </div>


              {/* Password & Confirmation Side-by-side */}
              <div className="grid grid-cols-2 gap-4">

                {/* Password - Right in RTL */}
                <div className="flex flex-col gap-1.5 text-right relative">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">كلمة المرور</label>
                  <PasswordInput
                    id="password"
                    className="h-11 pl-12 pr-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={registerForm.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-500 pr-2">{errors.password}</span>
                  )}
                </div>
                {/* Confirm Password - Left in RTL */}
                <div className="flex flex-col gap-1.5 text-right relative">
                  <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">تأكيد كلمة المرور</label>
                  <PasswordInput
                    id="confirm-password"
                    className="h-11 pl-12 pr-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={registerForm.passwordConfirmation}
                    onChange={(e) => handleFieldChange('passwordConfirmation', e.target.value)}
                  />
                  {errors.passwordConfirmation && (
                    <span className="text-xs text-red-500 pr-2">{errors.passwordConfirmation}</span>
                  )}
                </div>
              </div>

              {/* Password Requirements Checklist (2x2 grid) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1 px-1 text-right">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.check(registerForm.password || '')
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center justify-start gap-1.5 text-xs transition-colors',
                        isMet ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                      )}
                    >
                      {isMet ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  )
                })}
              </div>

            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isRegistering}
              className="rounded-full h-12 mt-2 bg-[#00a2ff] hover:bg-[#008fe6] text-white text-base font-bold shadow-lg shadow-[#00a2ff]/20 transition-all duration-300"
            >
              {isRegistering ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </Button>

            {/* Central Footer link */}
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
              لديك حساب بالفعل؟ <Link href="/login" className="text-primary font-bold hover:underline">تسجيل الدخول</Link>
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
                      src="/Masarak-logo-light.png"
                      alt="Masarak Logo"
                      width={130}
                      height={130}
                      className="object-contain  dark:bg-card rounded-3xl  block dark:hidden"
                      priority
                    />
                    <Image
                      src="/Masarak-logo-dark.png"
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
                      src="/Masarak-new-light.png"
                      alt="Masarak Logo"
                      width={130}
                      height={130}
                      className="object-contain bg-white dark:bg-card rounded-3xl p-1 block dark:hidden"
                      priority
                    />
                    <Image
                      src="/Masarak-new-dark.png"
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
