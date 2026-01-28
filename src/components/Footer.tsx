"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-muted text-foreground" dir="rtl">
      {/* CTA Section */}
      <div className="bg-primary py-16 text-center text-primary-foreground">
        <h2 className="mb-4 text-4xl font-bold">ابدأ في إدارة التوظيف اليوم</h2>
        <p className="mb-8 text-lg opacity-90">
          انضم إلى المئات من الشركات التي تستخدم نظامنا لإدارة عمليات التوظيف
          بكفاءة
        </p>
        <Link
          href="/register"
          className="inline-block rounded-lg bg-background px-8 py-3 text-lg font-semibold text-secondary hover:bg-background/90 transition"
        >
          تسجيل شركة جديدة
        </Link>
      </div>

      {/* Main Footer */}
      <div className="bg-background px-6 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3 text-right">
          {/* System Info */}
          <div>
            <h4 className="mb-4 text-lg font-bold">نظام التوظيف</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              منصة شاملة لإدارة التوظيف تمكّن الشركات من نشر الوظائف وإدارة
              طلبات التوظيف بكفاءة عالية
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-bold">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 البريد الإلكتروني: info@jobsystem.com</p>
              <p>📞 الهاتف: +966 50 123 4567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-background py-5 text-center text-sm text-muted-foreground">
        © 2024 نظام إدارة التوظيف. جميع الحقوق محفوظة.
        <span className="mx-1">•</span>
        Powered by <span className="font-semibold text-primary">GoWork</span>
      </div>
    </footer>
  );
}
