'use client'

import { Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { SidebarTrigger } from './ui/sidebar'
import { usePathname } from 'next/navigation'
import { routeTitles } from '@/lib/route-titles'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from './ui/skeleton'
import { useAuth } from '@/auth/use-auth'
import Logo from './logo'
import { ThemeTogglerButton } from './animate-ui/components/buttons/theme-toggler'

export default function NavBar({ minimal = false }: { minimal?: boolean }) {
  const { isAuthenticated, role, isLoading, user } = useAuth()
  const pathname = usePathname()

  const dashboardLink =
    role === 'Admin' || role === 'SubAdmin' ? '/admin' : '/company'

  const showDashboard =
    isAuthenticated && (!user?.status || user.status === 'Active')

  return (
    <nav className="bg-accent text-foreground sticky top-0 flex h-17.5 items-center justify-between rounded-2xl border border-border/80 px-5 shadow-2xl shadow-black/10 backdrop-blur-xl transition-colors duration-500 sm:px-8 dark:bg-accent/40 dark:text-white">
             <Logo />
   
             <div className="flex items-center gap-3 sm:gap-6">
                {!minimal && (
                  isLoading ? (
                    <div className="flex items-center gap-3">
                      {pathname !== '/login' && (
                        <Skeleton className="h-10 w-24 rounded-full bg-slate-300/80" />
                      )}
                      {pathname !== '/register' && (
                        <Skeleton className="hidden h-10 w-32 rounded-full bg-slate-300/80 sm:block" />
                      )}
                    </div>
                  ) : showDashboard ? (
                    <Link
                      href={dashboardLink}
                      className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:px-7"
                    >
                      لوحة التحكم
                    </Link>
                  ) : (
                    <>
                      {pathname !== '/login' && (
                        <Link
                          href="/login"
                          className="text-sm font-bold dark:text-white text-slate-900 transition hover:text-primary sm:text-base"
                        >
                          <span className="hidden sm:inline">تسجيل الدخول</span>
                          <span className="inline sm:hidden">دخول</span>
                        </Link>
                      )}
                      {pathname !== '/register' && (
                        <Link
                          href="/register"
                          className="rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:px-8 sm:text-base"
                        >
                          <span className="hidden sm:inline">تسجيل شركة جديدة</span>
                          <span className="inline sm:hidden">سجل شركة</span>
                        </Link>
                      )}
                    </>
                  )
                )}
   
               <div className="text-foreground flex size-10 items-center justify-center rounded-full transition hover:bg-slate-300 dark:text-white dark:hover:bg-accent/40">
                 {/* <AnimatedThemeToggler /> */}
                  <ThemeTogglerButton />
               </div>
             </div>
           </nav>
  )
}
