'use client'
import { useState, useEffect } from 'react'

import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/use-auth'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/auth/query-keys'
import { authService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { ContactSupportDialog } from '@/components/contact-support-dialog'

export default function UnderProcessPage() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (user?.status === 'Active') {
      router.replace('/company')
    } else if (user?.status === 'Blocked') {
      router.replace('/blocked')
    } else if (user?.status === 'Suspended') {
      router.replace('/suspended')
    } else if (user?.status === 'Rejected') {
      router.replace('/rejected')
    }
  }, [user?.status, router])

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
        router.replace('/company')
      } else if (latestUser?.status === 'Rejected') {
        router.replace('/rejected')
      } else {
        toast.info('حسابك لا يزال قيد المراجعة', {
          description: 'سنقوم بإعلامك فور الموافقة على حسابك.',
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
        <NavBar />
      </div>

      <main className="relative flex flex-1 items-center justify-center p-6">
        {/* Background Decorative Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/5 absolute -top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full opacity-50 blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 opacity-50 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 shadow-inner dark:bg-blue-900/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Clock className="h-10 w-10 text-blue-500" />
              </motion.div>
            </motion.div>

            <h1 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
              حسابك قيد المراجعة
            </h1>

            <p className="mb-8 text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              أهلاً بك {user?.name ? `يا ${user.name}` : ''}في منصة مسارك! لقد
              تم استلام طلب تسجيل شركتك بنجاح. نحن نقوم حالياً بمراجعة البيانات
              وسنقوم بتفعيل حسابك في أقرب وقت ممكن.
            </p>

            <div className="mb-10 flex flex-col gap-4 text-right">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    الخطوة القادمة
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    سيقوم فريقنا بالتحقق من صحة معلومات الشركة والتواصل معك إذا
                    لزم الأمر.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    تنبيه
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    ستتلقى رسالة بريد إلكتروني فور الموافقة على حسابك وتفعيله.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ContactSupportDialog />
              <Button
                size="lg"
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
                  'تحديث الصفحة'
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
