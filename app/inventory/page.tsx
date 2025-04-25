import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddProductButton } from "@/components/add-product-button"
import { InventoryBrowser } from "@/components/inventory-browser"

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <AddProductButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Browser</CardTitle>
          <CardDescription>Browse your inventory by categories, brands, and variants.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryBrowser />
        </CardContent>
      </Card>
    </div>
  )
}
