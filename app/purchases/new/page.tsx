"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, Loader2, Search, Check, ChevronsUpDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  sku: string
  price: {
    purchasePrice: number
    sellingPrice: number
  }
  stock: {
    quantity: number
    minThreshold: number
  }
  brand: string
  category: {
    _id: string
    name: string
  }
}

interface PurchaseItem {
  product: string
  productName: string
  productSku: string
  quantity: number
  price: number
  total: number
}

export default function NewPurchasePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [reference, setReference] = useState("")
  const [supplier, setSupplier] = useState("")
  const [notes, setNotes] = useState("")
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { product: "", productName: "", productSku: "", quantity: 1, price: 0, total: 0 }
  ])
  const [openDropdowns, setOpenDropdowns] = useState<{[key: number]: boolean}>({})

  useEffect(() => {
    fetchProducts()
    generateReference()
  }, [])

  const fetchProducts = async () => {
    setProductsLoading(true)
    try {
      console.log("Fetching products...")
      const response = await apiClient.get('/products')
      console.log("Products response:", response.data)
      
      // Handle both possible response structures
      const productsData = response.data.products || response.data || []
      setProducts(productsData)
      
      if (productsData.length === 0) {
        toast({
          title: "Warning",
          description: "No products found. Please add products first.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive"
      })
    } finally {
      setProductsLoading(false)
    }
  }

  const generateReference = () => {
    const timestamp = Date.now().toString().slice(-6)
    setReference(`PO-${timestamp}`)
  }

  const addItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      { product: "", productName: "", productSku: "", quantity: 1, price: 0, total: 0 }
    ])
  }

  const removeItem = (index: number) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(purchaseItems.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...purchaseItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === 'product') {
      const selectedProduct = products.find(p => p._id === value)
      if (selectedProduct) {
        updatedItems[index].productName = selectedProduct.name
        updatedItems[index].productSku = selectedProduct.sku
        // Use purchase price as default, but allow user to modify
        updatedItems[index].price = selectedProduct.price.purchasePrice || 0
      }
    }

    // Calculate total
    if (field === 'quantity' || field === 'price' || field === 'product') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price
    }

    setPurchaseItems(updatedItems)
  }

  const calculateGrandTotal = () => {
    return purchaseItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supplier.trim()) {
      toast({
        title: "Error",
        description: "Supplier name is required",
        variant: "destructive"
      })
      return
    }

    const validItems = purchaseItems.filter(item => item.product && item.quantity > 0)
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "At least one valid product is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const purchaseData = {
        reference,
        notes: supplier + (notes ? ` - ${notes}` : ''),
        totalAmount: calculateGrandTotal(),
        products: validItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }))
      }

      console.log("Submitting purchase data:", purchaseData)
      await apiClient.post('/inventory/purchases', purchaseData)
      
      toast({
        title: "Success",
        description: "Purchase order created successfully",
      })
      
      router.push('/purchases')
    } catch (error) {
      console.error("Error creating purchase:", error)
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleDropdown = (index: number, open: boolean) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: open
    }))
  }

  const getSelectedProductDisplay = (item: PurchaseItem) => {
    if (!item.product) return "Select product"
    return `${item.productName} (${item.productSku})`
  }

  const getProductSearchText = (product: Product) => {
    return `${product.name} ${product.sku} ${product.brand || ''} ${product.category?.name || ''}`.toLowerCase()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Purchase Order</h1>
          <p className="text-muted-foreground">Create a new purchase order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Purchase Info */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Purchase Order #</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="PO-123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Supplier name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or comments"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No products available. Please add products first.</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={fetchProducts}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {purchaseItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label>Product</Label>
                      <Popover 
                        open={openDropdowns[index] || false} 
                        onOpenChange={(open) => toggleDropdown(index, open)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDropdowns[index] || false}
                            className="w-full justify-between"
                          >
                            <span className="truncate">
                              {getSelectedProductDisplay(item)}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Search products..." 
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No products found.</CommandEmpty>
                              <CommandGroup>
                                {products.map((product) => (
                                  <CommandItem
                                    key={product._id}
                                    value={getProductSearchText(product)}
                                    onSelect={() => {
                                      updateItem(index, 'product', product._id)
                                      toggleDropdown(index, false)
                                    }}
                                  >
                                    <div className="flex flex-col w-full">
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">{product.name}</span>
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            item.product === product._id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </div>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <span>SKU: {product.sku}</span>
                                        <span>Stock: {product.stock?.quantity || 0}</span>
                                        <span>₹{product.price?.purchasePrice || 0}</span>
                                        {product.brand && <span>{product.brand}</span>}
                                      </div>
                                      {product.category?.name && (
                                        <span className="text-xs text-muted-foreground">
                                          Category: {product.category.name}
                                        </span>
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      
                      {/* Selected Product Preview */}
                      {item.product && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-xs text-muted-foreground">
                            SKU: {item.productSku} | Purchase Price: ₹{item.price}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div>
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="Enter price"
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Total</Label>
                        <Input
                          type="number"
                          value={item.total.toFixed(2)}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={purchaseItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Grand Total:</span>
              <span>₹{calculateGrandTotal().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || products.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Purchase Order"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}