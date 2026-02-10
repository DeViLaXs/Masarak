'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-muted text-foreground w-full" dir="rtl">
      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <h2 className="mb-4 text-4xl font-bold">ابدأ في إدارة التوظيف اليوم</h2>
        <p className="mb-8 text-lg opacity-90">
          انضم إلى المئات من الشركات التي تستخدم نظامنا لإدارة عمليات التوظيف
          بكفاءة
        </p>
        <Link
          href="/register"
          className="bg-background text-secondary hover:bg-background/90 inline-block rounded-lg px-8 py-3 text-lg font-semibold transition"
        >
          تسجيل شركة جديدة
        </Link>
      </div>

      {/* Main Footer */}
      <div className="bg-background px-6 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 text-right md:grid-cols-3">
          {/* System Info */}
          <div>
            <h4 className="mb-4 text-lg font-bold">نظام التوظيف</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              منصة شاملة لإدارة التوظيف تمكّن الشركات من نشر الوظائف وإدارة
              طلبات التوظيف بكفاءة عالية
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-bold">روابط سريعة</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/register"
                  className="hover:text-primary transition"
                >
                  تسجيل شركة
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-bold">تواصل معنا</h4>
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>📧 البريد الإلكتروني: masarak.platform@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-border bg-background text-muted-foreground border-t py-5 text-center text-sm">
        © 2024 Masarak. جميع الحقوق محفوظة.
        <span className="mx-1">•</span>
        Powered by <span className="text-primary font-semibold">Masarak</span>
      </div>
    </footer>
  )
}
