"use client"

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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"

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

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false)

  return (
    <div
      className={cn(
        "hidden border-r bg-background md:flex flex-col transition-all duration-300",
        collapsed ? "md:w-16" : "md:w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="border-b h-16 px-2 flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 ml-4">
              <CircleDollarSign className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ElectroInventory</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="flex items-center justify-center w-full">
              <CircleDollarSign className="h-6 w-6 text-primary" />
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className="border-t p-2">
          {collapsed ? (
            <div className="flex justify-center p-2">
              <UserMenu collapsed={true} />
            </div>
          ) : (
            <UserMenu collapsed={false} />
          )}
        </div>
      </div>
    </div>
  )
}
