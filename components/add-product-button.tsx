"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, ImageIcon, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"

// Define interfaces for our data
interface CategoryType {
  _id: string
  name: string
  description?: string
  parent: string | null
  children: CategoryType[]
  totalProducts: number
  totalStockValue: number
}

export function AddProductButton() {
  const { toast } = useToast()
  
  // Dialog state
  const [open, setOpen] = useState(false)
  
  // API states
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingCategories, setIsFetchingCategories] = useState(false)
  
  // Categories data
  const [categories, setCategories] = useState<CategoryType[]>([])
  
  // Selection states
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("")
  
  // Form states for product details
  const [productName, setProductName] = useState("")
  const [sku, setSku] = useState("")
  const [stock, setStock] = useState("10")
  const [threshold, setThreshold] = useState("5")
  const [costPrice, setCostPrice] = useState("100.00")
  const [sellingPrice, setSellingPrice] = useState("150.00")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("regular")
  const [imageUrl, setImageUrl] = useState("")
  const [supplierName, setSupplierName] = useState("")
  const [supplierCode, setSupplierCode] = useState("")
  
  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories()
  }, [])
  
  // Fetch categories from API
  const fetchCategories = async () => {
    setIsFetchingCategories(true)
    try {
      const response = await apiClient.get("/categories")
      setCategories(response.data)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setIsFetchingCategories(false)
    }
  }
  
  // Get subcategories based on selected category
  const getSubCategories = (): CategoryType[] => {
    const category = categories.find(c => c._id === selectedCategory)
    return category?.children || []
  }

  // Get brands based on selected subcategory
  // For the API integration, we're treating the "brand" as another level in the category hierarchy
  const getBrands = (): CategoryType[] => {
    const subCategories = getSubCategories()
    const subCategory = subCategories.find(sc => sc._id === selectedSubCategory)
    return subCategory?.children || []
  }

  // Get variants based on selected brand
  // This would be the final level in our category hierarchy
  const getVariants = (): CategoryType[] => {
    const brands = getBrands()
    const brand = brands.find(b => b._id === selectedBrand)
    return brand?.children || []
  }

  // Generate a product name based on selections
  const generateProductName = () => {
    if (!selectedCategory || !selectedSubCategory || !selectedBrand || !selectedVariant) return ""

    const category = categories.find(c => c._id === selectedCategory)
    if (!category) return ""

    const subCategory = category.children.find(sc => sc._id === selectedSubCategory)
    if (!subCategory) return ""

    const brand = subCategory.children.find(b => b._id === selectedBrand)
    if (!brand) return ""

    const variant = brand.children.find(v => v._id === selectedVariant)
    if (!variant) return ""

    return `${brand.name} ${subCategory.name} ${variant.name}`
  }

  // Update form handlers
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubCategory("")
    setSelectedBrand("")
    setSelectedVariant("")
    updateProductName()
  }

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategory(value)
    setSelectedBrand("")
    setSelectedVariant("")
    updateProductName()
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
    setSelectedVariant("")
    updateProductName()
  }

  const handleVariantChange = (value: string) => {
    setSelectedVariant(value)
    updateProductName()
  }

  const updateProductName = () => {
    const name = generateProductName()
    if (name) {
      setProductName(name)
      
      // Generate a SKU based on selections
      const timestamp = Date.now().toString().slice(-4)
      const brandCode = getBrands().find(b => b._id === selectedBrand)?.name.slice(0, 3).toUpperCase() || 'XXX'
      const variantCode = getVariants().find(v => v._id === selectedVariant)?.name.replace(/\s+/g, '').slice(0, 3) || 'XXX'
      
      setSku(`${brandCode}-${variantCode}-${timestamp}`)
    }
  }

  // Reset the form
  const resetForm = () => {
    setSelectedCategory("")
    setSelectedSubCategory("")
    setSelectedBrand("")
    setSelectedVariant("")
    setProductName("")
    setSku("")
    setStock("10")
    setThreshold("5")
    setCostPrice("100.00")
    setSellingPrice("150.00")
    setDescription("")
    setImageUrl("")
    setSupplierName("")
    setSupplierCode("")
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    // if (!selectedVariant) {
    //   toast({
    //     title: "Validation Error",
    //     description: "Please select all category levels",
    //     variant: "destructive",
    //   })
    //   return
    // }
    
    // if (!productName.trim()) {
    //   toast({
    //     title: "Validation Error",
    //     description: "Product name is required",
    //     variant: "destructive",
    //   })
    //   return
    // }
    
    // if (!sku.trim()) {
    //   toast({
    //     title: "Validation Error",
    //     description: "SKU is required",
    //     variant: "destructive",
    //   })
    //   return
    // }
    
    // Create product payload
    const payload = {
      name: productName,
      description: description,
      sku: sku,
      category: selectedVariant, // Use the most specific category (variant) as the leaf category
      type: type,
      specifications: {}, // You can add specifications if needed
      brand: getBrands().find(b => b._id === selectedBrand)?.name || "",
      price: {
        purchasePrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        profitMargin: ((parseFloat(sellingPrice) - parseFloat(costPrice)) / parseFloat(sellingPrice)) * 100
      },
      stock: {
        quantity: parseInt(stock),
        lowStockThreshold: parseInt(threshold)
      },
      supplier: {
        name: supplierName || "Generic Supplier",
        code: supplierCode || "GS001"
      },
      images: imageUrl ? [imageUrl] : []
    }
    
    // Submit to API
    setIsLoading(true)
    try {
      await apiClient.post("/products", payload)
      
      toast({
        title: "Success",
        description: "Product has been added successfully",
      })
      
      resetForm()
      setOpen(false)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter the details of the new product to add to your inventory.</DialogDescription>
          </DialogHeader>
          
          {isFetchingCategories ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 py-4">
                {/* Category selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Main Category</Label>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub Category</Label>
                    <Select
                      value={selectedSubCategory}
                      onValueChange={handleSubCategoryChange}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubCategories().map((subCategory) => (
                          <SelectItem key={subCategory._id} value={subCategory._id}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select 
                      value={selectedBrand} 
                      onValueChange={handleBrandChange} 
                      disabled={!selectedSubCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {getBrands().map((brand) => (
                          <SelectItem key={brand._id} value={brand._id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant">Variant</Label>
                    <Select 
                      value={selectedVariant} 
                      onValueChange={handleVariantChange} 
                      disabled={!selectedBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {getVariants().map((variant) => (
                          <SelectItem key={variant._id} value={variant._id}>
                            {variant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. PHX-10W-1234"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold">Low Stock Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (₹)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      placeholder="100.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="150.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierName">Supplier Name</Label>
                    <Input
                      id="supplierName"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      placeholder="Supplier name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierCode">Supplier Code</Label>
                    <Input
                      id="supplierCode"
                      value={supplierCode}
                      onChange={(e) => setSupplierCode(e.target.value)}
                      placeholder="e.g. SUP123"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview">
                <Card className="border-none shadow-none">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 flex justify-center">
                        <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={productName}
                              className="max-w-full max-h-full object-contain rounded-md"
                            />
                          ) : (
                            <ImageIcon className="h-16 w-16 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <h3 className="text-xl font-bold">{productName || "Product Name"}</h3>
                        <p className="text-sm text-muted-foreground">{sku || "SKU"}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCategory && (
                            <Badge variant="outline" className="bg-primary/10">
                              {categories.find(c => c._id === selectedCategory)?.name || "Category"}
                            </Badge>
                          )}
                          {selectedSubCategory && (
                            <Badge variant="outline" className="bg-primary/10">
                              {getSubCategories().find(sc => sc._id === selectedSubCategory)?.name || "Sub-Category"}
                            </Badge>
                          )}
                          {selectedBrand && (
                            <Badge variant="outline" className="bg-primary/10">
                              {getBrands().find(b => b._id === selectedBrand)?.name || "Brand"}
                            </Badge>
                          )}
                          {selectedVariant && (
                            <Badge variant="outline" className="bg-primary/10">
                              {getVariants().find(v => v._id === selectedVariant)?.name || "Variant"}
                            </Badge>
                          )}
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Stock:</p>
                            <p className="font-medium">{stock || "0"} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Low Stock Alert:</p>
                            <p className="font-medium">Below {threshold || "0"} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cost Price:</p>
                            <p className="font-medium">₹{costPrice || "0.00"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Selling Price:</p>
                            <p className="font-medium">₹{sellingPrice || "0.00"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Profit Margin:</p>
                            <p className="font-medium">
                              {costPrice && sellingPrice
                                ? `${(((parseFloat(sellingPrice) - parseFloat(costPrice)) / parseFloat(sellingPrice)) * 100).toFixed(2)}%`
                                : "0%"}
                            </p>
                          </div>
                        </div>

                        {(supplierName || supplierCode) && (
                          <>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Supplier:</p>
                                <p className="font-medium">{supplierName || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Supplier Code:</p>
                                <p className="font-medium">{supplierCode || "Not specified"}</p>
                              </div>
                            </div>
                          </>
                        )}

                        {description && (
                          <>
                            <Separator className="my-4" />
                            <div>
                              <p className="text-sm text-muted-foreground">Description:</p>
                              <p className="text-sm mt-1">{description}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isFetchingCategories || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}