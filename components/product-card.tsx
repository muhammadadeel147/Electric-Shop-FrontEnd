"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileEdit, Trash2, Loader2, AlertCircle } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"

interface Product {
  _id: string
  name: string
  description: string
  sku: string
  category: {
    _id: string
    name: string
  }
  type: string
  specifications: Record<string, any>
  brand: string
  price: {
    purchasePrice: number
    sellingPrice: number
    compareAtPrice?: number
    profitMargin: number
  }
  stock: {
    quantity: number
    lowStockThreshold: number
  }
  supplier: {
    name: string
    code: string
  }
  images: string[]
  isActive: boolean
}

interface ProductCardProps {
  product: Product
  onUpdate?: () => void // Callback to refresh products list after update/delete
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  // UI state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Edit form state
  // Edit form state
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    sku: product.sku || "",
    brand: product.brand || "",
    purchasePrice: product.price?.purchasePrice?.toString() || "0",
    sellingPrice: product.price?.sellingPrice?.toString() || "0",
    compareAtPrice: product.price?.compareAtPrice?.toString() || "",
    stock: product.stock?.quantity?.toString() || "0",
    threshold: product.stock?.lowStockThreshold?.toString() || "0",
    supplierName: product.supplier?.name || "",
    supplierCode: product.supplier?.code || "",
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : "",
    isActive: product.isActive || false
  })
  const { toast } = useToast()
  
  // Handle input change in edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle select change in edit form
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Update product
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        brand: formData.brand,
        price: {
          purchasePrice: formData.purchasePrice,
          sellingPrice: formData.sellingPrice,
          compareAtPrice: formData.compareAtPrice ? formData.compareAtPrice : undefined,
          // profitMargin: ((formData.sellingPrice - formData.purchasePrice) / formData.sellingPrice) * 100
        },
        stock: {
          quantity: parseInt(formData.stock),
          lowStockThreshold: parseInt(formData.threshold)
        },
        supplier: {
          name: formData.supplierName,
          code: formData.supplierCode
        },
        images: formData.imageUrl ? [formData.imageUrl] : [],
        isActive: formData.isActive
      }
      
      await apiClient.put(`/products/${product._id}`, payload)
      
      toast({
        title: "Success",
        description: "Product updated successfully"
      })
      
      setEditDialogOpen(false)
      if (onUpdate) onUpdate()
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update product",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Delete product
  const handleDelete = async () => {
    setIsLoading(true)
    
    try {
      await apiClient.delete(`/products/${product._id}`)
      
      toast({
        title: "Success",
        description: "Product deleted successfully"
      })
      
      setDeleteDialogOpen(false)
      if (onUpdate) onUpdate()
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete product",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="aspect-square relative bg-muted">
          {product.images && product.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
          )}
        </div>
        <CardContent className="p-4"> 
          <h3 className="font-semibold truncate">{product.name}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="bg-primary/10">
              {product.category.name}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              {product.brand}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Stock:</p>
              <StockStatus stock={product.stock.quantity} threshold={product.stock.lowStockThreshold} />
            </div>
            <div>
              <p className="text-muted-foreground">Price:</p>
              <p className="font-medium">₹{product.price.sellingPrice.toFixed(2)}</p>
            </div>
          </div>
          {product.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <FileEdit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for this product. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    name="threshold"
                    type="number"
                    min="1"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Cost Price (₹)</Label>
                  <Input
                    id="purchasePrice"
                    name="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                  <Input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare At Price (₹) (Optional)</Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    value={formData.isActive ? "active" : "inactive"}
                    onValueChange={(value) => handleSelectChange("isActive", value === "active" ? "true" : "false")}
                  >
                    <SelectTrigger id="isActive">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierCode">Supplier Code</Label>
                  <Input
                    id="supplierCode"
                    name="supplierCode"
                    value={formData.supplierCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle>Delete Product</DialogTitle>
            </div>
            <DialogDescription className="pt-3">
              Are you sure you want to delete <span className="font-medium">{product.name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StockStatus({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock <= 0) {
    return <p className="font-medium text-destructive">Out of Stock</p>
  } else if (stock < threshold) {
    return <p className="font-medium text-amber-500">Low Stock ({stock})</p>
  } else {
    return <p className="font-medium text-emerald-500">In Stock ({stock})</p>
  }
}