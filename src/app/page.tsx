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
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-card px-6 py-4 shadow-sm md:px-12 border-b">
        <div className="flex justify-between items-center gap-10 ">
          <div className="text-2xl font-bold text-primary">GoWork</div>
          <div>{userInfo?.name ? userInfo.name : "null"}</div>
          <div>
            <Button onClick={handleRegister}>Register</Button>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            تسجيل شركة جديدة
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text leading-20">
            منصة GoWork لإدارة توظيف الشركات
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl opacity-90">
            نظام شامل يمكن الشركات من نشر الوظائف وإدارة طلبات التوظيف ومتابعة
            عمليات التوظيف بكفاءة عالية
          </p>

          <div className="flex flex-col gap-4 md:flex-row justify-center">
            <Link
              href="/register"
              className="rounded-lg bg-secondary px-10 py-3.5 text-lg font-bold text-secondary-foreground hover:bg-secondary/90 transition"
            >
              ابدأ الآن مجاناً
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-border bg-primary px-10 py-3.5 text-lg font-semibold backdrop-blur hover:bg-background/30 transition"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="mb-12 text-center">
          <h3 className="mb-2 text-3xl font-bold">مميزات النظام</h3>
          <p className="text-muted-foreground">
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
