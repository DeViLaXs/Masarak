"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useTheme } from "../../../components/theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Image from "next/image";

export default function AuthNavBar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-sidebar border-b px-6 py-4 shadow-sm md:px-12 max-sm:px-4 max-sm:py-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Image
            src="/light-back1.png"
            alt="Logo"
            width={140}
            height={120}
            className="dark:hidden"
          />
          <Image
            src="/dark-back1.png"
            alt="Logo"
            width={140}
            height={120}
            className="hidden dark:block"
          />
        </div>
        <AnimatedThemeToggler />
      </div>
    </nav>
  );
}
