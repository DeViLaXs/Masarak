'use client'

import {
  LayoutDashboard,
  MailIcon,
  Users,
  Briefcase,
  CirclePlus,
  ClipboardList,
  List,
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
import { useAuth } from '@/auth/use-auth'
import Logo from '@/components/logo'
import { useUser } from '@/hooks/use-users'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const links = [
  {
    title: 'لوحة التحكم',
    path: '/company',
    icon: LayoutDashboard,
  },
  {
    title: 'إدارة الوظائف',
    path: '/company/manage-job',
    icon: Briefcase,
  },
  {
    title: 'إضافة وظيفة جديدة',
    path: '/company/add-job',
    icon: CirclePlus,
  },
  {
    title: 'طلبات التوظيف',
    path: '/company/job-order',
    icon: ClipboardList,
  },
  {
    title: 'سجل التوظيف',
    path: '/company/job-history',
    icon: List,
  },
  {
    title: 'المقابلات',
    path: '/company/interview',
    icon: Users,
  },
  {
    title: 'تواصل معنا',
    path: '/company/contact-us',
    icon: MailIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, isLoggingOut } = useAuth()
  const { user } = useUser()

  return (
    <Sidebar side="right">
      <SidebarHeader className="text-primary me-2 mt-2 mb-5 mr-2 text-2xl font-bold">
        <Logo/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mb-30">
          <SidebarGroupLabel className="px-4 text-[11px] font-semibold tracking-wide uppercase bg-accent dark:bg-input  mb-2 rounded-none">
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
          <SidebarGroupLabel className="text-[11px] px-4 bg-accent mb-2 rounded-none font-semibold dark:bg-input tracking-wide uppercase">
              الحساب
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mx-2">
                <SidebarMenuButton
                  isActive={pathname === '/company/profile'}
                  asChild
                  className="transition-all"
                >
                  <Link href="/company/profile">
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
        <SidebarMenu className="mx-2 border-t py-2 flex-row items-center gap-2">
          
              <Avatar>
                    <AvatarImage src={user?.sasUrl || '/User-icon.webp'} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                <span className="font-medium capitalize">{user?.name}</span>
             
              
           
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
