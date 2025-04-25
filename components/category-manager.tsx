"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CategoryManager() {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [addSubCategoryOpen, setAddSubCategoryOpen] = useState(false)
  const [addBrandOpen, setAddBrandOpen] = useState(false)
  const [addVariantOpen, setAddVariantOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)

  // Mock data for categories
  const categories = [
    {
      id: 1,
      name: "Lighting",
      description: "Bulbs, tube lights, and other lighting products",
      subCategories: [
        {
          id: 1,
          name: "Bulbs",
          description: "All types of bulbs",
          brands: [
            {
              id: 1,
              name: "Osaka",
              description: "Osaka brand bulbs",
              variants: [
                { id: 1, name: "10 Watt", description: "10W LED Bulb" },
                { id: 2, name: "18 Watt", description: "18W LED Bulb" },
                { id: 3, name: "20 Watt", description: "20W LED Bulb" },
              ],
            },
            {
              id: 2,
              name: "Phinix",
              description: "Phinix brand bulbs",
              variants: [
                { id: 4, name: "9 Watt", description: "9W LED Bulb" },
                { id: 5, name: "12 Watt", description: "12W LED Bulb" },
              ],
            },
            {
              id: 3,
              name: "Phipro",
              description: "Phipro brand bulbs",
              variants: [
                { id: 6, name: "15 Watt", description: "15W LED Bulb" },
                { id: 7, name: "22 Watt", description: "22W LED Bulb" },
              ],
            },
            {
              id: 4,
              name: "Philix",
              description: "Philix brand bulbs",
              variants: [
                { id: 8, name: "7 Watt", description: "7W LED Bulb" },
                { id: 9, name: "14 Watt", description: "14W LED Bulb" },
              ],
            },
          ],
        },
        {
          id: 2,
          name: "Tube Lights",
          description: "All types of tube lights",
          brands: [
            {
              id: 5,
              name: "Osaka",
              description: "Osaka brand tube lights",
              variants: [
                { id: 10, name: "20 Watt", description: "20W LED Tube Light" },
                { id: 11, name: "40 Watt", description: "40W LED Tube Light" },
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
          brands: [
            {
              id: 6,
              name: "Havells",
              description: "Havells brand wires",
              variants: [
                { id: 12, name: "1.5mm", description: "1.5mm Copper Wire" },
                { id: 13, name: "2.5mm", description: "2.5mm Copper Wire" },
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
          brands: [
            {
              id: 7,
              name: "Usha",
              description: "Usha brand fans",
              variants: [
                { id: 14, name: "3 Blade", description: "3 Blade Ceiling Fan" },
                { id: 15, name: "4 Blade", description: "4 Blade Ceiling Fan" },
              ],
            },
            {
              id: 8,
              name: "Orient",
              description: "Orient brand fans",
              variants: [
                { id: 16, name: "Standard", description: "Standard Ceiling Fan" },
                { id: 17, name: "Premium", description: "Premium Ceiling Fan" },
              ],
            },
          ],
        },
      ],
    },
  ]

  const handleAddSubCategory = (categoryId: number) => {
    setSelectedCategory(categoryId)
    setAddSubCategoryOpen(true)
  }

  const handleAddBrand = (categoryId: number, subCategoryId: number) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategoryId)
    setAddBrandOpen(true)
  }

  const handleAddVariant = (categoryId: number, subCategoryId: number, brandId: number) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategoryId)
    setSelectedBrand(brandId)
    setAddVariantOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage the hierarchical categories for your products.</CardDescription>
            </div>
            <Button onClick={() => setAddCategoryOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {categories.map((category) => (
              <AccordionItem key={category.id} value={`category-${category.id}`}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium">{category.name}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{category.subCategories.length} Sub-categories</Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddSubCategory(category.id)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Sub-category
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <div className="space-y-2 mt-2">
                    {category.subCategories.map((subCategory) => (
                      <Accordion key={subCategory.id} type="multiple" className="border rounded-md">
                        <AccordionItem value={`subcategory-${subCategory.id}`}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center">
                                <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">{subCategory.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{subCategory.brands.length} Brands</Badge>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAddBrand(category.id, subCategory.id)
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Brand
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-4">
                            <div className="space-y-2 mt-2">
                              {subCategory.brands.map((brand) => (
                                <Accordion key={brand.id} type="multiple" className="border rounded-md">
                                  <AccordionItem value={`brand-${brand.id}`}>
                                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                                      <div className="flex items-center justify-between w-full pr-4">
                                        <div className="flex items-center">
                                          <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span className="font-medium">{brand.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">{brand.variants.length} Variants</Badge>
                                          <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-8"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddVariant(category.id, subCategory.id, brand.id)
                                              }}
                                            >
                                              <Plus className="h-4 w-4 mr-1" />
                                              Add Variant
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4">
                                      <div className="space-y-2 mt-2">
                                        {brand.variants.map((variant) => (
                                          <div
                                            key={variant.id}
                                            className="flex items-center justify-between border rounded-md p-3"
                                          >
                                            <div className="flex items-center">
                                              <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                                              <span>{variant.name}</span>
                                              <span className="ml-2 text-sm text-muted-foreground">
                                                {variant.description}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new main category for your products.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input id="categoryName" placeholder="e.g., Lighting, Wiring, Fans" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description (Optional)</Label>
              <Textarea id="categoryDescription" placeholder="Brief description of this category" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddCategoryOpen(false)}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sub-Category Dialog */}
      <Dialog open={addSubCategoryOpen} onOpenChange={setAddSubCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sub-Category</DialogTitle>
            <DialogDescription>
              Create a new sub-category under{" "}
              {selectedCategory !== null
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "the selected category"}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subCategoryName">Sub-Category Name</Label>
              <Input id="subCategoryName" placeholder="e.g., Bulbs, Tube Lights" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subCategoryDescription">Description (Optional)</Label>
              <Textarea id="subCategoryDescription" placeholder="Brief description of this sub-category" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddSubCategoryOpen(false)}>Add Sub-Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Brand Dialog */}
      <Dialog open={addBrandOpen} onOpenChange={setAddBrandOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Create a new brand under{" "}
              {selectedSubCategory !== null &&
                categories
                  .find((c) => c.id === selectedCategory)
                  ?.subCategories.find((sc) => sc.id === selectedSubCategory)?.name}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input id="brandName" placeholder="e.g., Osaka, Phinix, Havells" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandDescription">Description (Optional)</Label>
              <Textarea id="brandDescription" placeholder="Brief description of this brand" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBrandOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddBrandOpen(false)}>Add Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Variant Dialog */}
      <Dialog open={addVariantOpen} onOpenChange={setAddVariantOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Variant</DialogTitle>
            <DialogDescription>
              Create a new variant under{" "}
              {selectedBrand !== null &&
                categories
                  .find((c) => c.id === selectedCategory)
                  ?.subCategories.find((sc) => sc.id === selectedSubCategory)
                  ?.brands.find((b) => b.id === selectedBrand)?.name}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="variantName">Variant Name</Label>
              <Input id="variantName" placeholder="e.g., 10 Watt, 1.5mm, 3 Blade" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variantDescription">Description (Optional)</Label>
              <Textarea id="variantDescription" placeholder="Brief description of this variant" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddVariantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddVariantOpen(false)}>Add Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
