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

export default function DashboardNavBar() {
  const pathname = usePathname()

  const title = routeTitles.find((r) => pathname === r.path)?.title ?? ''

  return (
    <div className="bg-sidebar flex items-center justify-between border-b-2 p-5">
      <div className="flex items-center gap-15">
        <SidebarTrigger className="-ms-1" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <AnimatedThemeToggler className="pl-5" />
    </div>
  )
}
