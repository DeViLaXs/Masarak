'use client'
import { useState, useEffect } from 'react'

import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { Ban, ShieldAlert, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/use-auth'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/auth/query-keys'
import { authService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { ContactSupportDialog } from '@/components/contact-support-dialog'

export default function BlockedPage() {
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
    } else if (user?.status === 'Suspended') {
      router.replace('/suspended')
    } else if (user?.status === 'PendingApproval') {
      router.replace('/under-process')
    } else if (user?.status === 'Rejected') {
      router.replace('/rejected')
    }
  }, [user?.status, user?.role, router])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Force fetch the latest user session data (bypassing cache)
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
      } else if (latestUser?.status === 'Rejected') {
        router.replace('/rejected')
      } else {
        toast.error('الحساب لا يزال محظوراً', {
          description: 'نأسف، لا يزال حسابك تحت الحظر من قبل الإدارة.',
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
      <NavBar />

      <main className="relative flex flex-1 items-center justify-center p-6">
        {/* Background Decorative Elements */}
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
          <div className="overflow-hidden rounded-3xl border border-red-200 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl dark:border-red-900/50 dark:bg-slate-900/80">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 shadow-inner dark:bg-red-900/20"
            >
              <Ban className="h-10 w-10 text-red-500" />
            </motion.div>

            <h1 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
              حساب محظور
            </h1>

            <p className="mb-8 text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {user?.name ? `مرحباً ${user.name}` : ''}، لقد تم حظر حسابكم
              وحرمانكم من الوصول إلى النظام نتيجة لمخالفة شروط الاستخدام أو
              قرارات إدارية نهائية.
            </p>

            <div className="mb-10 flex flex-col gap-4 text-right">
              <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    سبب الحظر
                  </h3>
                  <p className="text-sm text-red-800/80 dark:text-red-200/80">
                    يتم الحظر عادةً بعد استنفاذ التنبيهات وإيقاف النشاط مؤقتاً
                    أو ارتكاب مخالفة جسيمة لقوانين ولوائح مسارك.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    الاستفسارات
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    إذا كنتم تعتقدون أن هناك خطأ، يرجى تقديم تبرير خطي لطلب فك
                    الحظر عبر البريد الرسمي للإدارة.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ContactSupportDialog />
              <Button
                variant="destructive"
                size="lg"
                className="w-full px-8 sm:w-auto"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التقدم...
                  </>
                ) : (
                  'تحديث الحالة'
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full px-8 sm:w-auto"
                onClick={() => logout()}
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
