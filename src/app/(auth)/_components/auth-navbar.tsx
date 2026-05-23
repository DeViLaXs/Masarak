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
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'

export default function AuthNavBar() {
  const { setTheme } = useTheme()
  return (
    <div className="flex justify-between items-center w-full shrink-0 pt-5">
              <Link href="/" className="flex h-10 items-center gap-2">
    
                <Image
                  src="/masarak-logo-light.png"
                  alt="Masarak Logo"
                  width={40}
                  height={40}
                  className="block dark:hidden"
                />
                <Image
                  src="/masarak-new-light.png"
                  alt="Masarak Logo"
                  width={100}
                  height={100}
                  className="block dark:hidden"
                />
    
                <Image
                  src="/masarak-logo-dark.png"
                  alt="Masarak Logo"
                  width={40}
                  height={40}
                  className="hidden dark:block"
                />
                <Image
                  src="/masarak-new-dark.png"
                  alt="Masarak Logo"
                  width={100}
                  height={100}
                  className="hidden dark:block"
                />
              </Link>
              {/* <AnimatedThemeToggler /> */}
              <ThemeTogglerButton />
            </div>
  )
}
