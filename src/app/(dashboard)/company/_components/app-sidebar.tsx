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
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '../../../../components/ui/avatar'
import { useAuth } from '@/auth/use-auth'
import Logo from '@/components/logo'

const links = [
  {
    title: 'لوحة التحكم ',
    path: '/company',
    icon: LayoutDashboard,
  },
  {
    title: 'إدارة الوظائف',
    path: '/company/manage-job',
    icon: Building2,
  },
  {
    title: 'إضافة وظيفة جديدة',
    path: '/company/new-job',
    icon: MessagesSquare,
  },
  {
    title: 'طلبات التوظيف ',
    path: '/company/job-order',
    icon: Settings,
  },
  {
    title: 'سجل التوظيف ',
    path: '/company/job-history',
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, isLoggingOut } = useAuth()

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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="transition-all">
                  <Avatar className="ms-2">
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <EllipsisVertical className="ms-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                sideOffset={2}
                className="text-right"
              >
                <DropdownMenuItem>
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
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
