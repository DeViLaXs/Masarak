'use client'

import FeatureCard from '@/components/feature-card'
import Link from 'next/link'
import {
  Clock,
  ClipboardList,
  Briefcase,
  LayoutDashboard,
  Settings,
  Moon,
  Sun,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'
import Image from 'next/image'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

import { useAuth } from '@/auth/use-auth'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import NavBar from '@/components/navbar'

export default function HomePage() {
  const { setTheme } = useTheme()
  const { isAuthenticated, role, isLoading } = useAuth()

  const dashboardLink = role === 'Admin' ? '/admin' : '/company'

  return (
    <div className="bg-background text-foreground min-h-screen w-full text-right font-['Cairo']">
      {/* Navbar */}
      <NavBar />
      {/* Hero */}
      <section className="bg-primary text-primary-foreground relative flex h-[85vh] items-center justify-center overflow-hidden">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 max-w-4xl px-5 text-center duration-1000">
            <h1 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl md:text-6xl md:leading-20">
              منصة مسارك لإدارة توظيف الشركات
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg opacity-90 md:text-xl">
              نظام شامل يمكن الشركات من نشر الوظائف وإدارة طلبات التوظيف ومتابعة
              عمليات التوظيف بكفاءة عالية
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isLoading ? (
                <div className="flex h-15 items-center gap-4">
                  <Skeleton className="h-15 w-45" />
                  <Skeleton className="h-15 w-45" />
                </div>
              ) : isAuthenticated ? (
                <Link
                  href={dashboardLink}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 py-2.5 text-sm font-semibold transition max-sm:px-3 max-sm:py-2 max-sm:text-xs"
                >
                  لوحة التحكم
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg px-8 py-3 text-center text-base font-bold transition md:px-10 md:py-3.5 md:text-lg"
                  >
                    ابدأ الآن مجاناً
                  </Link>

                  <Link
                    href="/login"
                    className="border-border bg-primary hover:bg-background/30 rounded-lg border px-8 py-3 text-center text-base font-semibold backdrop-blur transition md:px-10 md:py-3.5 md:text-lg"
                  >
                    تسجيل الدخول
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-sm:px-4 max-sm:py-12">
        <div className="mb-12 text-center max-sm:mb-8">
          <h3 className="text-foreground mb-2 text-3xl font-bold max-sm:text-2xl">
            مميزات النظام
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            كل ما تحتاجه لإدارة عمليات التوظيف في مكان واحد
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Clock />}
            title="تاريخ التوظيف"
            desc="متابعة تاريخ جميع عمليات التوظيف والمرشحين المقبولين"
            color="bg-chart-5/20 text-chart-5"
          />

          <FeatureCard
            icon={<ClipboardList />}
            title="إدارة الطلبات"
            desc="مراجعة طلبات التوظيف والسير الذاتية"
            color="bg-chart-2/20 text-chart-2"
          />

          <FeatureCard
            icon={<Briefcase />}
            title="إدارة الوظائف"
            desc="نشر وإدارة الوظائف بسهولة"
            color="bg-chart-1/20 text-chart-1"
          />

          <FeatureCard
            icon={<LayoutDashboard />}
            title="لوحة تحكم شاملة"
            desc="عرض جميع الإحصائيات من مكان واحد"
            color="bg-primary/20 text-primary"
          />

          <FeatureCard
            icon={<User />}
            title="إدارة الملف الشخصي"
            desc="إدارة بيانات الشركة"
            color="bg-destructive/10 text-destructive"
          />

          <FeatureCard
            icon={<Settings />}
            title="إعدادات مرنة"
            desc="تخصيص الوظائف ونوع الدوام"
            color="bg-chart-3/20 text-chart-3"
          />
        </div>
      </section>
      <Footer />
    </div>
  )
}
