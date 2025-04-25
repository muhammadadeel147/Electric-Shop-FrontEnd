"use client"

import type React from "react"
import type { Category } from "@/lib/types"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, ShoppingCart } from "lucide-react"

export function NewSaleButton() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<SaleItem[]>([])

  // Mock data for categories
  const categories: Category[] = [
    {
      id: 1,
      name: "Lighting",
      description: "Bulbs, tube lights, and other lighting products",
      subCategories: [
        {
          id: 1,
          name: "Bulbs",
          description: "All types of bulbs",
          parentId: 1,
          brands: [
            {
              id: 1,
              name: "Osaka",
              description: "Osaka brand bulbs",
              subCategoryId: 1,
              variants: [
                { id: 1, name: "10 Watt", description: "10W LED Bulb", brandId: 1 },
                { id: 2, name: "18 Watt", description: "18W LED Bulb", brandId: 1 },
                { id: 3, name: "20 Watt", description: "20W LED Bulb", brandId: 1 },
              ],
            },
            {
              id: 2,
              name: "Phinix",
              description: "Phinix brand bulbs",
              subCategoryId: 1,
              variants: [
                { id: 4, name: "9 Watt", description: "9W LED Bulb", brandId: 2 },
                { id: 5, name: "12 Watt", description: "12W LED Bulb", brandId: 2 },
              ],
            },
          ],
        },
      ],
    },
  ]

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        product: "",
        category: "",
        subCategory: "",
        brand: "",
        variant: "",
        price: 0,
        quantity: 1,
        discount: 0,
        total: 0,
      },
    ])
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const discount = 0 // Global discount
  const total = subtotal - discount

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record New Sale</DialogTitle>
            <DialogDescription>Add products to the sale and record customer information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer Name (Optional)</Label>
                <Input id="customer" placeholder="Walk-in Customer" />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="digital">Digital Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Sale Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No items added. Click "Add Item" to add products to this sale.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="space-y-2">
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="osaka-bulb-10w">Osaka LED Bulb 10W</SelectItem>
                                  <SelectItem value="phinix-bulb-9w">Phinix LED Bulb 9W</SelectItem>
                                  <SelectItem value="phipro-bulb-15w">Phipro LED Bulb 15W</SelectItem>
                                  <SelectItem value="philix-bulb-7w">Philix LED Bulb 7W</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input type="number" min="0" step="0.01" placeholder="0.00" defaultValue="0.00" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" min="1" placeholder="1" defaultValue="1" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" min="0" max="100" placeholder="0" defaultValue="0" />
                          </TableCell>
                          <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex flex-col items-end">
                <div className="flex justify-between w-48 mb-1">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 mb-1">
                  <span>Discount:</span>
                  <span>₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 font-bold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Complete Sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface SaleItem {
  id: number
  product: string
  category: string
  subCategory: string
  brand: string
  variant: string
  price: number
  quantity: number
  discount: number
  total: number
}
