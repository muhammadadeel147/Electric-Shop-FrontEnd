"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  CircleDollarSign,
  FolderTree,
  Home,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Wind,
} from "lucide-react"
import { NotificationSystem } from "@/components/notification-system"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: FolderTree,
  },
  {
    name: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
   {
    name: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
  },
  {
    name: "AC Parts",
    href: "/ac-parts",
    icon: Wind,
  },
  {
    name: "Receipts",
    href: "/receipts",
    icon: Receipt,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b h-16 px-6 flex items-center">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <CircleDollarSign className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ElectroInventory</span>
              </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <NotificationSystem />
        <UserMenu />
      </div>
    </header>
  )
}
