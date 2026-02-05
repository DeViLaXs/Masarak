'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Sun, Moon } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useTheme } from 'next-themes'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

export default function AuthNavBar() {
  const { setTheme } = useTheme()
  return (
    <nav className="bg-background/90 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 shadow-sm max-sm:px-4 max-sm:py-3 md:px-12">
      <div className="flex w-full items-center justify-between">
        <div className="text-primary text-2xl font-bold">GoWork</div>
        <AnimatedThemeToggler />
      </div>
    </nav>
  )
}
