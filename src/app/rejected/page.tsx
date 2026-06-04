'use client'
import { useState, useEffect } from 'react'

import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { XCircle, Mail, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/use-auth'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/auth/query-keys'
import { authService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { ContactSupportDialog } from '@/components/contact-support-dialog'

export default function RejectedPage() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (user?.status === 'Active') {
      if (user?.role === 'Admin' || user?.role === 'SubAdmin') {
        router.replace('/admin')
      } else {
        router.replace('/company')
      }
    } else if (user?.status === 'Blocked') {
      router.replace('/blocked')
    } else if (user?.status === 'Suspended') {
      router.replace('/suspended')
    } else if (user?.status === 'PendingApproval') {
      router.replace('/under-process')
    }
  }, [user?.status, user?.role, router])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() })
      const latestUser = await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: authService.me,
      })

      if (latestUser?.status === 'Active') {
        if (latestUser?.role === 'Admin' || latestUser?.role === 'SubAdmin') {
          router.replace('/admin')
        } else {
          router.replace('/company')
        }
      } else {
        toast.error('حسابك لا يزال مرفوضاً', {
          description: 'نأسف، لا يزال حسابك مرفوضاً من قبل الإدارة.',
        })
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      toast.error('حدث خطأ أثناء فحص حالة الحساب')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-['Cairo'] dark:bg-slate-950">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-8 lg:px-16">
        <NavBar minimal />
      </div>

      <main className="relative flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-red-500/5 opacity-50 blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] h-[40%] w-[40%] rounded-full bg-slate-500/5 opacity-50 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="overflow-hidden rounded-3xl border border-red-200 bg-white/80 p-6 sm:p-8 text-center shadow-xl backdrop-blur-xl dark:border-red-900/50 dark:bg-slate-900/80">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 shadow-inner dark:bg-red-900/20"
            >
              <XCircle className="h-8 w-8 text-red-500" />
            </motion.div>

            <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
              حساب مرفوض
            </h1>

            <p className="mb-6 text-sm sm:text-base leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {user?.name ? `مرحباً ${user.name}` : ''}، نأسف لإبلاغك بأنه قد تم رفض طلب تسجيل حسابك بناءً على معايير القبول لدى المنصة.
            </p>

            <div className="mb-6 flex flex-col gap-3 text-right">
              <div className="flex items-start gap-3 rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    سبب الرفض
                  </h3>
                  <p className="text-xs sm:text-sm text-red-800/80 dark:text-red-200/80">
                    قد يكون الرفض ناتجاً عن عدم صحة البيانات المدخلة أو عدم استيفاء شركتك للشروط والأحكام الخاصة بمنصة مسارك.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    للاستفسارات
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    إذا كنتم تعتقدون أن هناك خطأ أو تودون معرفة المزيد من التفاصيل، يرجى التواصل مع فريق الدعم الفني.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ContactSupportDialog size="default" />
              <Button
                variant="outline"
                className="w-full px-8 sm:w-auto"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  'تحديث الحالة'
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full px-8 sm:w-auto"
                onClick={() => logout()}
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      
    </div>
  )
}
