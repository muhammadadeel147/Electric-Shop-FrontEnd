"use client"

import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Header } from "@/components/header"
import { LoadingStateProvider } from "@/components/loading-state-provider"

const inter = Inter({ subsets: ["latin"] })

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password") ||
    pathname === "/reset-success"
  const isRootPage = pathname === "/"

  if (isAuthPage || isRootPage) {
    return <LoadingStateProvider>{children}</LoadingStateProvider>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 relative">
          <LoadingStateProvider>{children}</LoadingStateProvider>
        </main>
      </div>
    </div>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  // Client component to check the current path
  return <ClientLayout>{children}</ClientLayout>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  )
}
