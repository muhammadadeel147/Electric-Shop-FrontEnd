"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export function TopSellingProducts() {
  const products = [
    {
      id: 1,
      name: "LED Bulb 9W",
      category: "Lighting",
      sold: 120,
      revenue: 21600,
      progress: 100,
    },
    {
      id: 2,
      name: "Copper Wire 1.5mm",
      category: "Wiring",
      sold: 85,
      revenue: 12750,
      progress: 71,
    },
    {
      id: 3,
      name: "Wall Socket",
      category: "Accessories",
      sold: 78,
      revenue: 9360,
      progress: 65,
    },
    {
      id: 4,
      name: "Ceiling Fan",
      category: "Fans",
      sold: 45,
      revenue: 81000,
      progress: 38,
    },
    {
      id: 5,
      name: "MCB 32A",
      category: "Protection",
      sold: 42,
      revenue: 13440,
      progress: 35,
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead>Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">{product.sold}</TableCell>
              <TableCell className="text-right">₹{product.revenue.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={product.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{product.progress}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
