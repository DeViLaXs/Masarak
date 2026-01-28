"use client";

import FeatureCard from "@/components/FeatureCard";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import {
  Clock,
  ClipboardList,
  Briefcase,
  LayoutDashboard,
  Settings,
  Moon,
  Sun,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import type { User as UserType } from "@/auth/types";
import Image from "next/image";

export default function HomePage() {
  const { setTheme } = useTheme();
  const userInfo = useAuthStore((state) => state.user);
  const setUser = useAuthStore.getState().setUser;

  const user: UserType = {
    name: "Omar",
    email: "omar@gmail.com",
    phone: "1234567890",
    password: "123",
    confirmPassword: "123",
    industry: "ps4",
    role: "Admin",
  };

  const handleRegister = () => {
    setUser(user);
    console.log(userInfo);
  };

  const handleLogin = () => {};

  const handleLogout = () => {
    const logout = useAuthStore.getState().logout;
    logout();
    console.log(userInfo);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-['Cairo'] text-right">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-card px-12 py-4 shadow-sm border-b gap-4 max-md:px-4 max-md:py-3">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-primary max-sm:text-xl">
            GoWork
          </div>
        </div>

        <div className="flex items-center gap-6 max-sm:gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors max-sm:text-xs"
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 max-sm:px-3 max-sm:py-2 max-sm:text-xs"
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
                <Sun className="h-[1.2rem] w-[1.2rem] max-sm:h-4 max-sm:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] max-sm:h-4 max-sm:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex h-[85vh] items-center justify-center bg-primary text-primary-foreground overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" /> */}
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="relative z-10 max-w-4xl px-5 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="mb-6 text-3xl sm:text-4xl md:text-6xl font-bold leading-tight md:leading-20">
            منصة GoWork لإدارة توظيف الشركات
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg md:text-xl opacity-90">
            نظام شامل يمكن الشركات من نشر الوظائف وإدارة طلبات التوظيف ومتابعة
            عمليات التوظيف بكفاءة عالية
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href="/register"
              className="rounded-lg bg-secondary px-8 py-3 md:px-10 md:py-3.5 text-base md:text-lg font-bold text-secondary-foreground hover:bg-secondary/90 transition text-center"
            >
              ابدأ الآن مجاناً
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-border bg-primary/20 px-8 py-3 md:px-10 md:py-3.5 text-base md:text-lg font-semibold backdrop-blur hover:bg-background/30 transition text-center"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-sm:py-12 px-6 max-sm:px-4">
        <div className="mb-12 max-sm:mb-8 text-center">
          <h3 className="mb-2 text-3xl max-sm:text-2xl font-bold text-foreground">
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
  );
}
