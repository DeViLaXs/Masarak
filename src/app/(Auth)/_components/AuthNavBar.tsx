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

export default function AuthNavBar() {
  const { setTheme } = useTheme();
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-background/90 border-b px-6 py-4 shadow-sm md:px-12 max-sm:px-4 max-sm:py-3">
      <div className="flex items-center justify-between w-full">
        <div className="text-2xl font-bold text-primary">GoWork</div>
        <AnimatedThemeToggler />
      </div>
    </nav>
  );
}
