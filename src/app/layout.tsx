import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import ReactQueryProvider from '@/lib/providers'

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Masarak',
  description:
    'نظام شامل يمكن الشركات من نشر الوظائف وإدارة طلبات التوظيف ومتابعة عمليات التوظيف بكفاءة عالية',
  icons: {
    icon: '/Masarak-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-['Cairo'] antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
