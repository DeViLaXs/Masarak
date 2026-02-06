import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/lib/providers";
import { ThemeProviderWrapper } from "@/components/themeProvider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "GoWork - منصة إدارة توظيف الشركات",
  description:
    "نظام شامل يمكن الشركات من نشر الوظائف وإدارة طلبات التوظيف ومتابعة عمليات التوظيف بكفاءة عالية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased font-['Cairo']`}>
        <ReactQueryProvider>
          {/* <ThemeProvider defaultTheme="dark" storageKey="gowork-ui-theme"> */}
          <ThemeProviderWrapper>
            {children}
            {/* </ThemeProvider> */}
          </ThemeProviderWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
