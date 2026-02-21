'use client'

import {
  LayoutDashboard,
  Settings,
  Building2,
  MessagesSquare,
  EllipsisVertical,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar'
import { useAuth } from '@/auth/use-auth'
import Logo from '@/components/logo'
import { useUser } from '@/hooks/use-users'

const links = [
  {
    title: 'لوحة التحكم ',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'إدارة الشركات',
    path: '/admin/companies',
    icon: Building2,
  },
  {
    title: 'إدارة التعليقات',
    path: '/admin/feedbacks',
    icon: MessagesSquare,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  console.log('الصفحة الحالية:', pathname)

  const { logout, isLoggingOut } = useAuth()
  const { user } = useUser()

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar side="right">
      <SidebarHeader className="text-primary me-2 mt-2 mb-5 text-2xl font-bold">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {links.map((link) => {
              const isActive = pathname === link.path

              return (
                <SidebarMenuItem key={link.title} className="mx-2">
                  <SidebarMenuButton
                    isActive={isActive}
                    asChild
                    className="transition-all"
                  >
                    <Link href={link.path}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="mt-3">
          <SidebarMenuItem>
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="transition-all">
                  <Avatar>
                    <AvatarImage src={user?.sasUrl} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                      {user?.companyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {user?.companyName}
                  <EllipsisVertical className="ms-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" sideOffset={2}>
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem variant="destructive" onClick={() => logout()} > */}
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
