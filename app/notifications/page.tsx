import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, ShoppingCart, AlertTriangle, Info, Search, Filter, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotificationsPage() {
  // This would be fetched from your API in a real application
  const notifications = generateMockNotifications()
  const unreadNotifications = notifications.filter((n) => !n.read)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search notifications..." className="pl-8 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2">
              {unreadNotifications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View all your notifications in one place.</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationList notifications={notifications} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications you haven't read yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationList notifications={unreadNotifications} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationList({ notifications }: { notifications: any[] }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    )
  }

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(notifications)

  return (
    <ScrollArea className="h-[600px] pr-4">
      {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
        <div key={date} className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-card py-2">{date}</h3>
          <div className="space-y-4 mt-2">
            {dateNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${!notification.read ? "bg-primary/5" : ""}`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-end mt-2">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          Mark as Read
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "low-stock":
      return <Package className="h-5 w-5 text-amber-500" />
    case "order":
      return <ShoppingCart className="h-5 w-5 text-green-500" />
    case "system":
      return <AlertTriangle className="h-5 w-5 text-blue-500" />
    case "info":
      return <Info className="h-5 w-5 text-gray-500" />
    default:
      return <Info className="h-5 w-5 text-gray-500" />
  }
}

function formatTime(date: Date) {
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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
}

function groupNotificationsByDate(notifications: any[]) {
  const groups: { [key: string]: any[] } = {}

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
      // Format as "Month Day, Year" (e.g., "Apr 15, 2023")
      groupKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }

    groups[groupKey].push(notification)
  })

  return groups
}

function generateMockNotifications() {
  const types = ["low-stock", "order", "system", "info"]
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
  const mockNotifications = []
  for (let i = 0; i < 100; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const messageArray = messages[type as keyof typeof messages]
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
      title: titles[type as keyof typeof titles],
      message,
      timestamp,
      read: daysAgo > 2, // Notifications older than 2 days are marked as read
    })
  }

  // Sort by timestamp (newest first)
  mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return mockNotifications
}
