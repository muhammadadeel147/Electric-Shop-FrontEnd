"use client"

import type React from "react"
import type { Category, SubCategory, Brand, Variant } from "@/lib/types"

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
import { Textarea } from "@/components/ui/textarea"
import { Plus, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function AddProductButton() {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("")
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [productName, setProductName] = useState("")
  const [stock, setStock] = useState("10")
  const [threshold, setThreshold] = useState("5")
  const [costPrice, setCostPrice] = useState("100.00")
  const [sellingPrice, setSellingPrice] = useState("150.00")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")

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
            {
              id: 3,
              name: "Phipro",
              description: "Phipro brand bulbs",
              subCategoryId: 1,
              variants: [
                { id: 6, name: "15 Watt", description: "15W LED Bulb", brandId: 3 },
                { id: 7, name: "22 Watt", description: "22W LED Bulb", brandId: 3 },
              ],
            },
            {
              id: 4,
              name: "Philix",
              description: "Philix brand bulbs",
              subCategoryId: 1,
              variants: [
                { id: 8, name: "7 Watt", description: "7W LED Bulb", brandId: 4 },
                { id: 9, name: "14 Watt", description: "14W LED Bulb", brandId: 4 },
              ],
            },
          ],
        },
        {
          id: 2,
          name: "Tube Lights",
          description: "All types of tube lights",
          parentId: 1,
          brands: [
            {
              id: 5,
              name: "Osaka",
              description: "Osaka brand tube lights",
              subCategoryId: 2,
              variants: [
                { id: 10, name: "20 Watt", description: "20W LED Tube Light", brandId: 5 },
                { id: 11, name: "40 Watt", description: "40W LED Tube Light", brandId: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Wiring",
      description: "Wires, cables, and related accessories",
      subCategories: [
        {
          id: 3,
          name: "Copper Wires",
          description: "All types of copper wires",
          parentId: 2,
          brands: [
            {
              id: 6,
              name: "Havells",
              description: "Havells brand wires",
              subCategoryId: 3,
              variants: [
                { id: 12, name: "1.5mm", description: "1.5mm Copper Wire", brandId: 6 },
                { id: 13, name: "2.5mm", description: "2.5mm Copper Wire", brandId: 6 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Fans",
      description: "Ceiling, table, and exhaust fans",
      subCategories: [
        {
          id: 4,
          name: "Ceiling Fans",
          description: "All types of ceiling fans",
          parentId: 3,
          brands: [
            {
              id: 7,
              name: "Usha",
              description: "Usha brand fans",
              subCategoryId: 4,
              variants: [
                { id: 14, name: "3 Blade", description: "3 Blade Ceiling Fan", brandId: 7 },
                { id: 15, name: "4 Blade", description: "4 Blade Ceiling Fan", brandId: 7 },
              ],
            },
            {
              id: 8,
              name: "Orient",
              description: "Orient brand fans",
              subCategoryId: 4,
              variants: [
                { id: 16, name: "Standard", description: "Standard Ceiling Fan", brandId: 8 },
                { id: 17, name: "Premium", description: "Premium Ceiling Fan", brandId: 8 },
              ],
            },
          ],
        },
      ],
    },
  ]

  const getSubCategories = (): SubCategory[] => {
    const category = categories.find((c) => c.id.toString() === selectedCategory)
    return category ? category.subCategories : []
  }

  const getBrands = (): Brand[] => {
    const subCategories = getSubCategories()
    const subCategory = subCategories.find((sc) => sc.id.toString() === selectedSubCategory)
    return subCategory ? subCategory.brands : []
  }

  const getVariants = (): Variant[] => {
    const brands = getBrands()
    const brand = brands.find((b) => b.id.toString() === selectedBrand)
    return brand ? brand.variants : []
  }

  const generateProductName = () => {
    if (!selectedCategory || !selectedSubCategory || !selectedBrand || !selectedVariant) return ""

    const category = categories.find((c) => c.id.toString() === selectedCategory)
    if (!category) return ""

    const subCategory = category.subCategories.find((sc) => sc.id.toString() === selectedSubCategory)
    if (!subCategory) return ""

    const brand = subCategory.brands.find((b) => b.id.toString() === selectedBrand)
    if (!brand) return ""

    const variant = brand.variants.find((v) => v.id.toString() === selectedVariant)
    if (!variant) return ""

    return `${brand.name} ${subCategory.name.slice(0, -1)} ${variant.name}`
  }

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
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Main Category</Label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
                        <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                          {subCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={selectedBrand} onValueChange={handleBrandChange} disabled={!selectedSubCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBrands().map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variant">Variant</Label>
                  <Select value={selectedVariant} onValueChange={handleVariantChange} disabled={!selectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {getVariants().map((variant) => (
                        <SelectItem key={variant.id} value={variant.id.toString()}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
            </TabsContent>

            <TabsContent value="preview">
              <Card className="border-none shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl || "/placeholder.svg"}
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

                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCategory && (
                          <Badge variant="outline" className="bg-primary/10">
                            {categories.find((c) => c.id.toString() === selectedCategory)?.name || "Category"}
                          </Badge>
                        )}
                        {selectedSubCategory && (
                          <Badge variant="outline" className="bg-primary/10">
                            {getSubCategories().find((sc) => sc.id.toString() === selectedSubCategory)?.name ||
                              "Sub-Category"}
                          </Badge>
                        )}
                        {selectedBrand && (
                          <Badge variant="outline" className="bg-primary/10">
                            {getBrands().find((b) => b.id.toString() === selectedBrand)?.name || "Brand"}
                          </Badge>
                        )}
                        {selectedVariant && (
                          <Badge variant="outline" className="bg-primary/10">
                            {getVariants().find((v) => v.id.toString() === selectedVariant)?.name || "Variant"}
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
                      </div>

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
          <DialogFooter>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
