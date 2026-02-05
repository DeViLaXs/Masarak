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

export default function NavBar() {
  const { setTheme } = useTheme()

  const pathname = usePathname()

  const title = routeTitles.find((r) => pathname === r.path)?.title ?? ''

  return (
    <div className="bg-sidebar flex items-center justify-between border-b-2 p-2">
      <div className="flex items-center gap-15">
        <SidebarTrigger className="-ms-1" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
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
      <AnimatedThemeToggler />
    </div>
  )
}
