'use client'

import { useAuth } from '@/auth/use-auth'
import Footer from '@/components/footer'
import Logo from '@/components/logo'
import NavBar from '@/components/navbar'
import LoadingScreen from '@/components/loading-screen'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  FilePlus2,
  FileText,
  Handshake,
  Inbox,
  MessageCircle,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const heroFeatures = [
  {
    title: 'إدارة متكاملة',
    desc: 'إدارة كاملة لطلبات التوظيف من نشر إلى تعيين',
    icon: FileText,
    color: 'purple',
  },
  {
    title: 'سهولة الاستخدام',
    desc: 'واجهة بسيطة وسلسة تساعدك على إنجاز المهام بسرعة',
    icon: Smile,
    color: 'red',
  },
  {
    title: 'تقارير ذكية',
    desc: 'تقارير وتحليلات تساعدك على اتخاذ قرارات توظيف أفضل',
    icon: BarChart3,
    color: 'orange',
  },
  {
    title: 'أمان وموثوقية',
    desc: 'حماية بياناتك وبيانات المتقدمين بأعلى معايير الأمان',
    icon: ShieldCheck,
    color: 'green',
  },
]

const workflowSteps = [
  {
    title: 'نشر الوظيفة',
    desc: 'أنشئ وانشر الوظائف بسهولة في دقائق',
    icon: FilePlus2,
    color: 'red',
    
  },
  {
    title: 'استلام الطلبات',
    desc: 'اجمع وإدارة جميع طلبات التوظيف في مكان واحد',
    icon: Inbox,
    color: 'green',
  },
  {
    title: 'التوظيف',
    desc: 'اتخذ قرارات التوظيف بثقة وضع أفضل المواهب',
    icon: Handshake,
    color: 'blue',
  },
]

const productFeatures = [
  {
    title: 'تحليلات متقدمة',
    desc: 'احصل على تقارير مفصلة ورؤى تساعد قراراتك أفضل.',
    icon: TrendingUp,
    color: 'orange',
  },
  {
    title: 'فرز آلي',
    desc: 'وفر الوقت مع أدوات الفرز الذكي للمرشحين.',
    icon: BrainCircuit,
    color: 'blue',
  },
  {
    title: 'تعاون الفريق',
    desc: 'شارك الملاحظات والتقييمات مع فريقك بسلاسة.',
    icon: MessageCircle,
    color: 'purple',
  },
]

const getDotStyle = (index: number) => ({
  animationDelay: `${(index % 6) * 0.14}s`,
  opacity: 0.8,
})

export default function HomePage() {
  const { isAuthenticated, role, isLoading, user } = useAuth({ middleware: 'guest' })

  const dashboardLink =
    role === 'Admin' || role === 'SubAdmin' ? '/admin' : '/company'

  const primaryHref = isAuthenticated ? dashboardLink : '/login'
  const primaryLabel = isAuthenticated ? 'لوحة التحكم' : 'تسجيل الدخول'

  const showDashboard =
    isAuthenticated && (!user?.status || user.status === 'Active')

  if (isLoading || isAuthenticated) {
    return <LoadingScreen />
  }

  return (
    <main
      dir="rtl"
      className="bg-background text-foreground dark:bg-[#071321] relative min-h-screen font-['Cairo'] transition-colors duration-500 dark:text-white"
    >
      {/* Decorative background elements — contained so they don't bleed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/background.jpg"
          alt="فريق عمل داخل اجتماع"
          fill
          priority
          sizes="100vw"
          className="scale-[1.03] object-cover object-center opacity-35 saturate-125 contrast-105 transition-opacity duration-500 dark:opacity-82"
        />
        <div className="absolute inset-0 bg-background/55 transition-colors duration-500 dark:bg-[#071321]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,transparent_0%,rgba(247,248,248,0.38)_34%,rgb(247,248,248)_76%),linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(247,248,248,0.72)_54%,rgb(247,248,248)_100%),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_20%,transparent)_0%,transparent_20%,transparent_78%,color-mix(in_srgb,var(--primary)_16%,transparent)_100%)] dark:bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.08)_0%,rgba(7,19,33,0.26)_42%,rgba(7,19,33,0.92)_78%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(7,19,33,0.18)_24%,rgba(7,19,33,0.96)_68%,#071321_100%),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_42%,transparent)_0%,transparent_20%,transparent_78%,color-mix(in_srgb,var(--primary)_34%,transparent)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-white/45 to-transparent dark:from-white/8" />
        <div className="absolute inset-x-0 bottom-0 h-168 bg-linear-to-t from-background via-background/80 to-transparent dark:from-[#071321] dark:via-[#071321]/82" />
        <div className="absolute inset-y-0 left-0 w-24 bg-primary/12 blur-2xl md:w-44 dark:bg-primary/20" />
        <div className="absolute inset-y-0 right-0 w-24 bg-primary/12 blur-2xl md:w-44 dark:bg-primary/20" />
        <div className="absolute top-44 left-0 hidden h-72 w-36 rounded-r-full bg-primary/12 md:block dark:bg-primary/20" />
        <div className="absolute top-60 right-8 hidden grid-cols-6 gap-5 opacity-35 lg:grid">
          {Array.from({ length: 30 }).map((_, index) => (
            <span
              key={index}
              className="dot-float size-1 rounded-full dark:bg-white/80 bg-primary transition-all duration-500"
              style={getDotStyle(index)}
            />
          ))}
        </div>
      </div>


      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-8 lg:px-16">
        <NavBar />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-445 px-4 py-5 sm:px-8 lg:px-16">

        <section className="flex min-h-[calc(100vh-90px)] flex-col items-center justify-center pb-8 pt-10 text-center sm:pt-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="flex w-full flex-col items-center"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xl shadow-primary/30 sm:px-6 sm:py-3 sm:text-base">
              <Sparkles className="size-4 sm:size-5 shrink-0" />
              <span>منصة متكاملة • سهلة الاستخدام • موثوقة</span>
            </div>

            <h1 className="max-w-5xl text-balance text-3xl leading-tight font-black tracking-normal text-foreground drop-shadow-sm sm:text-5xl lg:text-[65px] lg:leading-[1.16] dark:text-white dark:drop-shadow-2xl">
              منصة <span className="text-primary">مسارك</span> لإدارة عمليات توظيف
              الشركات
            </h1>

            <p className="text-muted-foreground mt-7 max-w-3xl text-lg leading-9 font-semibold sm:text-2xl sm:leading-12 dark:text-white/78">
              نظام شامل يمكنك من نشر الوظائف وإدارة طلبات التوظيف ومتابعة
              عمليات التوظيف بكفاءة عالية
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-40 rounded-full bg-white/25" />
                  <Skeleton className="h-14 w-40 rounded-full bg-white/20" />
                </div>
              ) : (
                <>
                  {showDashboard || !isAuthenticated ? (
                    <Link
                      href={primaryHref}
                      className="inline-flex h-14 min-w-44 items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition hover:bg-primary/90"
                    >
                      {primaryLabel}
                      <ArrowLeft className="size-5" />
                    </Link>
                  ) : null}
                  {!isAuthenticated ? (
                    <Link
                      href="/register"
                      className="text-foreground inline-flex h-14 min-w-44 items-center justify-center gap-3 rounded-full border border-border bg-card/60 px-8 text-base font-bold backdrop-blur transition hover:bg-accent dark:border-white/70 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
                    >
                      ابدأ الآن مجاناً
                      <ArrowLeft className="size-5" />
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.75, ease: 'easeOut' }}
            className="bg-card/82 mt-8 sm:mt-12 w-full max-w-375 rounded-2xl border border-border/80 px-5 py-6 text-card-foreground shadow-2xl shadow-black/10 backdrop-blur-2xl transition-colors duration-500 lg:px-7 dark:border-white/45 dark:bg-white/78 dark:text-slate-900 dark:shadow-black/20"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {heroFeatures.map((feature) => {
                const Icon = feature.icon

                return (
                  <div
                    key={feature.title}
                    className="flex items-center gap-5 text-right lg:border-l lg:border-border lg:px-7 last:lg:border-l-0 dark:lg:border-slate-300/70"
                  >
                    <div className="bg-background flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-primary shadow-lg shadow-slate-900/5 dark:bg-white">
                      <Icon className={`size-7 sm:size-8 text-${feature.color}-500`}  strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-foreground text-base font-black dark:text-slate-900">
                        {feature.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm leading-7 font-semibold dark:text-slate-700">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </section>

        <section className="border-t border-border/70 py-16 text-center sm:py-20 dark:border-white/10">
          <h2 className="text-foreground text-3xl font-black sm:text-4xl dark:text-white">
            كيف تعمل المنصة
          </h2>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-7 md:grid-cols-3">
            {workflowSteps.map((step) => {
              const Icon = step.icon

              return (
                <article
                  key={step.title}
                  className="bg-white/90 rounded-2xl border border-border/80 px-5 py-7 text-center shadow-2xl shadow-black/10 backdrop-blur-xl transition-colors duration-500 sm:px-8 sm:py-9 dark:border-white/35 dark:bg-white/90 dark:shadow-black/15"
                >
                  <div className="bg-background/90 mx-auto flex size-20 items-center justify-center rounded-2xl text-primary shadow-xl shadow-black/10 dark:bg-white/90">
                    <Icon className={`size-8 text-${step.color}-500`}  strokeWidth={2} />
                  </div>
                  <h3 className="text-foreground mt-7 text-xl font-black dark:text-black">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mx-auto mt-3 max-w-56 text-base leading-8 font-semibold dark:text-black/82">
                    {step.desc}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="py-10 text-center sm:py-14">
          <h2 className="text-foreground text-3xl font-black sm:text-4xl dark:text-white">
            المميزات
          </h2>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-7 md:grid-cols-3">
            {productFeatures.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="bg-white/90 rounded-2xl border border-border/80 px-5 py-7 sm:px-8 sm:py-9 text-right shadow-2xl shadow-black/10 backdrop-blur-xl transition-colors duration-500 dark:border-white/35 dark:bg-white/90 dark:shadow-black/15"
                >
                  <div className="bg-background/90 mr-auto flex size-14 sm:size-16 items-center justify-center rounded-xl sm:rounded-2xl text-primary shadow-xl shadow-black/10 dark:bg-white/90">
                    <Icon className={`size-7 sm:size-8 text-${feature.color}-500`}  strokeWidth={2.1} />
                  </div>
                  <h3 className="text-foreground mt-6 sm:mt-10 text-xl sm:text-2xl font-black dark:text-black">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-base leading-8 font-semibold dark:text-black/82">
                    {feature.desc}
                  </p>
                </article>
              )
            })}
          </div>
        </section>



        <section className="py-16 sm:py-20">
          <div className="relative mx-auto flex min-h-75 max-w-6xl items-center justify-center overflow-hidden rounded-2xl border border-white/20 px-6 py-16 text-center shadow-2xl shadow-black/25">
            <Image
              src="/background.jpg"
              alt="فريق يحتفل بإنجاز عملية التوظيف"
              fill
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="scale-[1.02] object-cover object-center saturate-125 contrast-110"
            />
            <div className="absolute inset-0 bg-[#071321]/36 dark:bg-[#071321]/45" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(7,19,33,0.24)_58%,rgba(7,19,33,0.64)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-primary/45 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white sm:text-5xl">
                هل أنت جاهز للبدء؟
              </h2>
              <p className="mt-4 text-lg font-semibold text-white/85">
                قم بتحويل عملية التوظيف في شركتك اليوم.
              </p>
              {!isAuthenticated ? (
                <Link
                  href="/register"
                  className="mt-7 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition hover:bg-primary/90"
                >
                  ابدأ الآن مجاناً
                  <ArrowLeft className="size-5" />
                </Link>
              ) : showDashboard ? (
                <Link
                  href={dashboardLink}
                  className="mt-7 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition hover:bg-primary/90"
                >
                  لوحة التحكم
                  <ArrowLeft className="size-5" />
                </Link>
              ) : null}
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  )
}
