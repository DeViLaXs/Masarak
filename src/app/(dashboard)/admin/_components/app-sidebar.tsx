'use client'

import {
  LayoutDashboard,
  Building2,
  MessagesSquare,
  Users,
  UserPlus,
  UserRound,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarGroup,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/auth/use-auth'
import Logo from '@/components/logo'
import { useUser } from '@/hooks/use-users'

const adminLinks = [
  {
    title: 'لوحة التحكم',
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
  {
    title: 'إضافة مشرف فرعي',
    path: '/admin/create-sub-admin',
    icon: UserPlus,
  },
  {
    title: 'إدارة المشرفين الفرعيين',
    path: '/admin/manage-sub-admin',
    icon: Users,
  },
]

const subAdminLinks = [
  {
    title: 'لوحة التحكم',
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
  const { logout, isLoggingOut, role } = useAuth()
  const { user } = useUser()

  const links = role === 'SubAdmin' ? subAdminLinks : adminLinks

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="text-primary me-2 mt-2 mb-5 mr-2 text-2xl font-bold group-data-[state=collapsed]:me-0 group-data-[state=collapsed]:mr-0 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:flex group-data-[state=collapsed]:w-full">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mb-30">
          <SidebarGroupLabel className="bg-accent dark:bg-input mb-2 rounded-none px-4 text-[11px] font-semibold tracking-wide uppercase group-data-[state=collapsed]:hidden">
            القائمة الرئيسية
          </SidebarGroupLabel>
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
                      tooltip={{ children: link.title, side: 'left' }}
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
        </SidebarGroup>

        <SidebarGroup className="mb-auto pb-2">
          <SidebarGroupLabel className="bg-accent dark:bg-input mb-2 rounded-none px-4 text-[11px] font-semibold tracking-wide uppercase group-data-[state=collapsed]:hidden">
            الحساب
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mx-2">
                <SidebarMenuButton
                  isActive={pathname === '/admin/profile'}
                  asChild
                  className="transition-all"
                  tooltip={{ children: 'الملف الشخصي', side: 'left' }}
                >
                  <Link href="/admin/profile">
                    <UserRound />
                    <span>الملف الشخصي</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="mx-2">
                <SidebarMenuButton
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="text-destructive transition-all hover:text-destructive"
                  tooltip={{ children: isLoggingOut ? 'جاري تسجيل الخروج...' : 'الخروج', side: 'left' }}
                >
                  <LogOut />
                  <span>{isLoggingOut ? 'جاري تسجيل الخروج...' : 'الخروج'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="mx-2 flex-row items-center gap-2 border-t py-2 group-data-[state=collapsed]:mx-0 group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:gap-0">
          <Avatar>
            <AvatarImage src={user?.sasUrl || '/masarak-logo-light.png'} />
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium capitalize group-data-[state=collapsed]:hidden">{user?.name}</span>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
