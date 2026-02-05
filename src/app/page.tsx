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

export default function HomePage() {
  const { setTheme } = useTheme()

  return (
    <div className="bg-background text-foreground min-h-screen w-full text-right font-['Cairo']">
      {/* Navbar */}
      <nav className="bg-card sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-12 py-4 shadow-sm max-md:px-4 max-md:py-3">
        <div className="flex items-center">
          <div className="text-primary text-2xl font-bold max-sm:text-xl">
            GoWork
          </div>
        </div>

        <div className="flex items-center gap-6 max-sm:gap-3">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-primary text-sm font-semibold transition-colors max-sm:text-xs"
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/register"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 py-2.5 text-sm font-semibold transition max-sm:px-3 max-sm:py-2 max-sm:text-xs"
          >
            تسجيل شركة جديدة
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 max-sm:h-8 max-sm:w-8"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all max-sm:h-4 max-sm:w-4 dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all max-sm:h-4 max-sm:w-4 dark:scale-100 dark:rotate-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground relative flex h-[85vh] items-center justify-center overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" /> */}
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 max-w-4xl px-5 text-center duration-1000">
          <h1 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl md:text-6xl md:leading-20">
            منصة GoWork لإدارة توظيف الشركات
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg opacity-90 md:text-xl">
            نظام شامل يمكن الشركات من نشر الوظائف وإدارة طلبات التوظيف ومتابعة
            عمليات التوظيف بكفاءة عالية
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
          </div>
        </div>
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
