'use client'

import Link from 'next/link'

export default function Footer() {
  return (
     <footer className="relative z-10 bg-white text-slate-950 shadow-[0_-1px_0_rgba(15,23,42,0.08)] transition-colors duration-500 dark:bg-accent dark:text-foreground">
        <div className="mx-auto grid max-w-445 grid-cols-1 gap-12 px-6 py-10 text-center md:grid-cols-3 md:px-16 md:text-right">
          <section>
            <h2 className="mb-7 text-xl font-black">نظام التوظيف</h2>
            <p className="mx-auto max-w-md font-semibold text-slate-800 md:mx-0 dark:text-muted-foreground">
              منصة شاملة لإدارة التوظيف تمكن الشركات من نشر الوظائف وإدارة
              طلبات التوظيف بكفاءة عالية
            </p>
          </section>

          <section>
            <h2 className="mb-7 text-xl font-black">روابط سريعة</h2>
            <nav className="flex flex-col items-center gap-4 font-semibold md:items-start">
              <Link href="/register" className="transition hover:text-primary">
                تسجيل شركة
              </Link>
              <Link href="/login" className="transition hover:text-primary">
                تسجيل الدخول
              </Link>
            </nav>
          </section>

          <section>
            <h2 className="mb-7 text-xl font-black">تواصل معنا</h2>
            <p className=" font-semibold text-slate-800 dark:text-muted-foreground">
              البريد الإلكتروني:
              <a
                href="mailto:masarak.platform@gmail.com"
                className="mr-2 text-slate-950 transition hover:text-primary dark:text-foreground"
              >
                masarak.platform@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="border-t border-slate-200 px-6 py-8 text-center font-semibold text-slate-950 dark:border-border dark:text-foreground">
          © 2024 Masarak. جميع الحقوق محفوظة. · Powered by{' '}
          
          <span className="font-bold text-primary">Masarak</span>
        </div>
      </footer>
  )
}
