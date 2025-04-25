"use client"

import { useState, useEffect } from "react"
import { Bell, X, ShoppingCart, Package, AlertTriangle, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

type NotificationType = "low-stock" | "order" | "system" | "info"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const NOTIFICATIONS_PER_PAGE = 10

  // Generate a large number of mock notifications for demonstration
  useEffect(() => {
    const generateMockNotifications = () => {
      const types: NotificationType[] = ["low-stock", "order", "system", "info"]
      const titles = {
        "low-stock": "Low Stock Alert",
        order: "New Order",
        system: "System Update",
        info: "Tip",
      }

      const messages = {
        "low-stock": [
          "Osaka LED Bulb 10W is running low on stock (5 remaining).",
          "Phinix LED Bulb 9W is running low on stock (3 remaining).",
          "Usha Ceiling Fan 3 Blade is out of stock.",
          "Havells Copper Wire 1.5mm is running low on stock (8 remaining).",
          "Philips Tube Light 18W is running low on stock (7 remaining).",
        ],
        order: [
          "Order #1234 has been placed successfully.",
          "Order #2345 has been placed successfully.",
          "Order #3456 has been placed successfully.",
          "Order #4567 has been placed successfully.",
          "Order #5678 has been placed successfully.",
        ],
        system: [
          "ElectroInventory has been updated to version 2.1.0.",
          "New feature: Export to Excel is now available.",
          "Security update: Password requirements have been updated.",
          "Performance improvements have been applied.",
          "Database backup completed successfully.",
        ],
        info: [
          "Did you know you can export inventory reports to Excel?",
          "Try using keyboard shortcuts for faster navigation.",
          "You can customize your dashboard widgets.",
          "Set up automatic stock alerts to never run out of inventory.",
          "Use the barcode scanner for faster inventory management.",
        ],
      }

      // Generate 100 mock notifications
      const mockNotifications: Notification[] = []
      for (let i = 0; i < 100; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const messageArray = messages[type]
        const message = messageArray[Math.floor(Math.random() * messageArray.length)]

        // Create timestamps ranging from now to 30 days ago
        const daysAgo = Math.floor(Math.random() * 30)
        const hoursAgo = Math.floor(Math.random() * 24)
        const minutesAgo = Math.floor(Math.random() * 60)
        const timestamp = new Date()
        timestamp.setDate(timestamp.getDate() - daysAgo)
        timestamp.setHours(timestamp.getHours() - hoursAgo)
        timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

        mockNotifications.push({
          id: `notification-${i + 1}`,
          type,
          title: titles[type],
          message,
          timestamp,
          read: daysAgo > 2, // Notifications older than 2 days are marked as read
        })
      }

      // Sort by timestamp (newest first)
      mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setNotifications(mockNotifications)
      setTotalCount(mockNotifications.length)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
      loadNotifications(mockNotifications)
    }

    generateMockNotifications()
  }, [])

  const loadNotifications = (notificationsList = notifications) => {
    // Show the first 10 notifications in the dropdown
    setVisibleNotifications(notificationsList.slice(0, NOTIFICATIONS_PER_PAGE))
  }

  // Demo function to add a new notification
  const addDemoNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "low-stock",
      title: "Low Stock Alert",
      message: "Phinix LED Bulb 9W is running low on stock (3 remaining).",
      timestamp: new Date(),
      read: false,
    }

    const updatedNotifications = [newNotification, ...notifications]
    setNotifications(updatedNotifications)
    setVisibleNotifications([newNotification, ...visibleNotifications.slice(0, NOTIFICATIONS_PER_PAGE - 1)])
    setUnreadCount((prev) => prev + 1)
    setTotalCount((prev) => prev + 1)

    // Show a toast notification
    const toast = document.createElement("div")
    toast.className =
      "fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-md shadow-lg z-50 flex items-center gap-2 max-w-md animate-in fade-in slide-in-from-bottom-5"
    toast.innerHTML = `
      <div class="flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      </div>
      <div>
        <h4 class="font-medium">Low Stock Alert</h4>
        <p class="text-sm">Phinix LED Bulb 9W is running low on stock (3 remaining).</p>
      </div>
    `
    document.body.appendChild(toast)

    // Remove the toast after 5 seconds
    setTimeout(() => {
      toast.classList.add("animate-out", "fade-out", "slide-out-to-right-5")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 5000)
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setVisibleNotifications(visibleNotifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setVisibleNotifications(visibleNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "low-stock":
        return <Package className="h-5 w-5 text-amber-500" />
      case "order":
        return <ShoppingCart className="h-5 w-5 text-green-500" />
      case "system":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      case "info":
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {}

    notifications.forEach((notification) => {
      const date = notification.timestamp
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let groupKey = ""

      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday"
      } else {
        // Format as "Month Day" (e.g., "Apr 15")
        groupKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(notification)
    })

    return groups
  }

  const groupedNotifications = groupNotificationsByDate(visibleNotifications)

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            variant="destructive"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 md:w-96 max-h-[70vh] overflow-hidden z-50 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Notifications</h3>
              <Badge variant="secondary" className="ml-1">
                {totalCount}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                Mark all as read
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[calc(70vh-120px)]">
            {visibleNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            ) : (
              <div>
                {Object.entries(groupedNotifications).map(([date, notifications]) => (
                  <div key={date}>
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm p-2 border-b text-xs font-medium text-muted-foreground">
                      {date}
                    </div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer",
                          !notification.read && "bg-primary/5",
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-3 border-t flex justify-between items-center">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link href="/notifications">
                View All <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={addDemoNotification}>
              Demo: Add New
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
