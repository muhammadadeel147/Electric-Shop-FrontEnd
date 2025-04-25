import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function LowStockAlert() {
  const lowStockItems = [
    { id: 1, name: "LED Bulb 9W", quantity: 5, threshold: 10 },
    { id: 2, name: "Copper Wire 1.5mm", quantity: 8, threshold: 20 },
    { id: 3, name: "Wall Socket", quantity: 3, threshold: 15 },
  ]

  if (lowStockItems.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>The following items are running low on stock:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {lowStockItems.map((item) => (
              <Badge key={item.id} variant="outline" className="bg-destructive/10">
                {item.name}: {item.quantity}/{item.threshold}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/inventory">View Inventory</Link>
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
