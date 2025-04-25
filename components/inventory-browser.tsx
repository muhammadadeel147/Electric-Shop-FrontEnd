"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Home } from "lucide-react"
import {
  categories,
  products,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductsByVariant,
} from "@/lib/inventory-data"
import { ProductCard } from "@/components/product-card"

export function InventoryBrowser() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [displayProducts, setDisplayProducts] = useState<any[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; action: () => void }[]>([])

  // Update breadcrumbs when selections change
  useEffect(() => {
    const newBreadcrumbs = []

    newBreadcrumbs.push({
      label: "All Categories",
      action: () => {
        setSelectedCategory(null)
        setSelectedSubCategory(null)
        setSelectedBrand(null)
        setSelectedVariant(null)
      },
    })

    if (selectedCategory) {
      newBreadcrumbs.push({
        label: selectedCategory,
        action: () => {
          setSelectedSubCategory(null)
          setSelectedBrand(null)
          setSelectedVariant(null)
        },
      })
    }

    if (selectedSubCategory) {
      newBreadcrumbs.push({
        label: selectedSubCategory,
        action: () => {
          setSelectedBrand(null)
          setSelectedVariant(null)
        },
      })
    }

    if (selectedBrand) {
      newBreadcrumbs.push({
        label: selectedBrand,
        action: () => {
          setSelectedVariant(null)
        },
      })
    }

    if (selectedVariant) {
      newBreadcrumbs.push({
        label: selectedVariant,
        action: () => {},
      })
    }

    setBreadcrumbs(newBreadcrumbs)
  }, [selectedCategory, selectedSubCategory, selectedBrand, selectedVariant])

  // Update displayed products when selections change
  useEffect(() => {
    let filteredProducts = []

    if (selectedVariant && selectedBrand && selectedSubCategory && selectedCategory) {
      filteredProducts = getProductsByVariant(selectedCategory, selectedSubCategory, selectedBrand, selectedVariant)
    } else if (selectedBrand && selectedSubCategory && selectedCategory) {
      filteredProducts = getProductsByBrand(selectedCategory, selectedSubCategory, selectedBrand)
    } else if (selectedSubCategory && selectedCategory) {
      filteredProducts = getProductsBySubCategory(selectedCategory, selectedSubCategory)
    } else if (selectedCategory) {
      filteredProducts = getProductsByCategory(selectedCategory)
    } else {
      // Show a limited set of products for the overview
      filteredProducts = products.slice(0, 8)
    }

    // Apply search filter if there's a search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.variant.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setDisplayProducts(filteredProducts)
  }, [selectedCategory, selectedSubCategory, selectedBrand, selectedVariant, searchTerm])

  // Get the current view items based on the selected level
  const getCurrentViewItems = () => {
    if (selectedBrand && selectedSubCategory && selectedCategory) {
      // Show variants
      const category = categories.find((c) => c.name === selectedCategory)
      if (!category) return []

      const subCategory = category.subCategories.find((sc) => sc.name === selectedSubCategory)
      if (!subCategory) return []

      const brand = subCategory.brands.find((b) => b.name === selectedBrand)
      if (!brand) return []

      return brand.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        description: variant.description,
        type: "variant",
      }))
    } else if (selectedSubCategory && selectedCategory) {
      // Show brands
      const category = categories.find((c) => c.name === selectedCategory)
      if (!category) return []

      const subCategory = category.subCategories.find((sc) => sc.name === selectedSubCategory)
      if (!subCategory) return []

      return subCategory.brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        description: brand.description,
        type: "brand",
      }))
    } else if (selectedCategory) {
      // Show subcategories
      const category = categories.find((c) => c.name === selectedCategory)
      if (!category) return []

      return category.subCategories.map((subCategory) => ({
        id: subCategory.id,
        name: subCategory.name,
        description: subCategory.description,
        type: "subCategory",
      }))
    } else {
      // Show main categories
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        type: "category",
      }))
    }
  }

  const handleItemClick = (item: any) => {
    if (item.type === "category") {
      setSelectedCategory(item.name)
      setSelectedSubCategory(null)
      setSelectedBrand(null)
      setSelectedVariant(null)
    } else if (item.type === "subCategory") {
      setSelectedSubCategory(item.name)
      setSelectedBrand(null)
      setSelectedVariant(null)
    } else if (item.type === "brand") {
      setSelectedBrand(item.name)
      setSelectedVariant(null)
    } else if (item.type === "variant") {
      setSelectedVariant(item.name)
    }
  }

  const viewItems = getCurrentViewItems()

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory(null)
              setSelectedSubCategory(null)
              setSelectedBrand(null)
              setSelectedVariant(null)
              setSearchTerm("")
            }}
          >
            <Home className="h-4 w-4 mr-2" />
            Reset View
          </Button>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="flex items-center flex-wrap gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
            <Button variant="link" className="p-0 h-auto text-sm font-medium" onClick={crumb.action}>
              {crumb.label}
            </Button>
          </div>
        ))}
      </div>

      {/* Category/SubCategory/Brand/Variant browser */}
      {viewItems.length > 0 && !selectedVariant && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {viewItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="h-16 flex items-center justify-center">
                    {item.type === "category" && (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{item.name.charAt(0)}</span>
                      </div>
                    )}
                    {item.type === "subCategory" && (
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-secondary">{item.name.charAt(0)}</span>
                      </div>
                    )}
                    {item.type === "brand" && (
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">{item.name.charAt(0)}</span>
                      </div>
                    )}
                    {item.type === "variant" && (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg font-bold">{item.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Products display */}
      <div>
        {selectedVariant ? (
          <h3 className="text-lg font-medium mb-4">Products - {selectedVariant}</h3>
        ) : selectedBrand ? (
          <h3 className="text-lg font-medium mb-4">Products - {selectedBrand}</h3>
        ) : selectedSubCategory ? (
          <h3 className="text-lg font-medium mb-4">Products - {selectedSubCategory}</h3>
        ) : selectedCategory ? (
          <h3 className="text-lg font-medium mb-4">Products - {selectedCategory}</h3>
        ) : (
          <h3 className="text-lg font-medium mb-4">Featured Products</h3>
        )}

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No products found in this category.</div>
        )}
      </div>
    </div>
  )
}
