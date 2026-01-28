"use client";

import { AdminSidebar } from "@/app/(dashboard)/admin/_component/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavBar from "@/components/NavBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <NavBar />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
