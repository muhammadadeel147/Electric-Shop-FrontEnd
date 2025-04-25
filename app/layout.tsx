import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientlayout"

export const metadata: Metadata = {
  title: "ElectroInventory - Inventory Management System",
  description: "Inventory Management System for Electric Items Shop",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'