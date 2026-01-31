"use client";

import { AppSidebar } from "@/app/(dashboard)/company/_component/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavBar from "@/components/NavBar";
import { useCompanyGuard } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
    const { isLoading, isError, error, status } = useCompanyGuard();
  
    useEffect(() => {
      if (status === "error") {
        const axiosError = error as any;
        const code = axiosError?.response?.status;
  
        if (code === 401) {
          router.replace("/login");
        } else if (code === 403) {
          router.replace("/forbidden");
        }
      }
    }, [status, error, router]);
  
    // ⛔ Block rendering بالكامل
    if (status === "pending") {
      return null; // أو <FullScreenLoader />
    }
  
    if (status === "error") {
      return null; // redirect حصل أو بيحصل
    }
  
  // ✅ فقط لو Authorized
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
