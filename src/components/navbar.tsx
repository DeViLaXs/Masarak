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

export default function NavBar() {
  const { isAuthenticated, role, isLoading } = useAuth()

  const dashboardLink =
    role === 'Admin' || role === 'SubAdmin' ? '/admin' : '/company'

  return (
    <nav className="bg-card sticky top-0 z-50 flex h-19 items-center justify-between gap-4 border-b px-12 py-4 shadow-sm max-md:px-4 max-md:py-3">
      <Logo />

      <div className="flex items-center gap-6 max-sm:gap-3">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-35 bg-gray-700" />
            <Skeleton className="h-10 w-35 bg-gray-700" />
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
          </>
        )}

        <AnimatedThemeToggler />
      </div>
    </nav>
  )
}
