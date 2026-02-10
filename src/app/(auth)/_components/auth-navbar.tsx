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
import Image from 'next/image'
import Link from 'next/link'

export default function AuthNavBar() {
  const { setTheme } = useTheme()
  return (
    <nav className="bg-card sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 shadow-sm max-sm:px-4 max-sm:py-3 md:px-12">
      <div className="flex w-full items-center justify-between">
        <div className="flex h-10 items-center justify-center">
          <Link href="/" className="flex h-10 items-center justify-center">
            <Image
              src="/masarak-dark.png"
              className="hidden dark:block"
              alt="Logo"
              width={110}
              height={110}
            />
            <Image
              src="/masarak-light.png"
              className="block dark:hidden"
              alt="Logo"
              width={110}
              height={110}
            />
            <Image
              src="/Masarak-logo-dark.png"
              className="block dark:hidden"
              alt="Logo"
              width={25}
              height={25}
            />
            <Image
              src="/Masarak-logo.png"
              className="hidden dark:block"
              alt="Logo"
              width={25}
              height={25}
            />
          </Link>
        </div>
        <AnimatedThemeToggler />
      </div>
    </nav>
  )
}
