"use client";

import {
  LayoutDashboard,
  Settings,
  Building2,
  MessagesSquare,
  EllipsisVertical,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";

const adminLinks = [
  {
    title: "لوحة التحكم ",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "إدارة الشركات",
    path: "/admin/companies",
    icon: Building2,
  },
  {
    title: "إدارة التعليقات",
    path: "/admin/feedbacks",
    icon: MessagesSquare,
  },
  {
    title: "الإعدادات ",
    path: "/admin/settings",
    icon: Settings,
  },
];

const companyLinks = [
  {
    title: "لوحة التحكم ",
    path: "/company",
    icon: LayoutDashboard,
  },
  {
    title: "إدارة الوظائف",
    path: "/company/manage-job",
    icon: Building2,
  },
  {
    title: "إضافة وظيفة جديدة",
    path: "/company/new-job",
    icon: MessagesSquare,
  },
  {
    title: "طلبات التوظيف ",
    path: "/company/requested-job",
    icon: Settings,
  },
  {
    title: "سجل التوظيف ",
    path: "/company/job-history",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  console.log("الصفحة الحالية:", pathname);

  // const {user, logout} = useAuth();
  // const links = user?.role === "Company" ? companyLinks : adminLinks;

  const links = adminLinks;
  return (
    <Sidebar side="right">
      <SidebarHeader className="text-primary font-bold text-2xl me-2 mb-5 mt-2">
        GoWork
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {links.map((link) => {
              const isActive = pathname === link.path;

              return (
                <SidebarMenuItem key={link.title} className="mx-2">
                  <SidebarMenuButton
                    isActive={isActive}
                    asChild
                    className="transition-all "
                  >
                    <Link href={link.path}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className=" transition-all">
                  <Avatar className="ms-2">
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  {/* {user?.name} */}
                  <EllipsisVertical className="ms-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" sideOffset={2}>
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <Link href="/">
                  {/* <DropdownMenuItem variant="destructive" onClick={() => logout()} > */}
                  <DropdownMenuItem variant="destructive">
                    Sign out
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
