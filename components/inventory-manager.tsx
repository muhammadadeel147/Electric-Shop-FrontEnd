"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid3X3, List } from "lucide-react"
import { products, categories } from "@/lib/inventory-data"
import { ProductCard } from "@/components/product-card"
import { ProductTable } from "@/components/product-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InventoryManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  // Get all subcategories for filtering
  const allSubCategories = categories.flatMap((category) =>
    category.subCategories.map((sub) => ({
      id: sub.id.toString(),
      name: sub.name,
      category: category.name,
    })),
  )

  // Get all brands for filtering
  const allBrands = categories.flatMap((category) =>
    category.subCategories.flatMap((sub) =>
      sub.brands.map((brand) => ({
        id: brand.id.toString(),
        name: brand.name,
        category: category.name,
        subCategory: sub.name,
      })),
    ),
  )

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory) ? prev.filter((sc) => sc !== subCategory) : [...prev, subCategory],
    )
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSubCategories([])
    setSelectedBrands([])
    setSearchTerm("")
  }

  // Filter products based on search and selected filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variant.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)

    // SubCategory filter
    const matchesSubCategory = selectedSubCategories.length === 0 || selectedSubCategories.includes(product.subCategory)

    // Brand filter
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)

    return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {(selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedBrands.length > 0) && (
                  <Badge variant="secondary" className="ml-2 px-1 rounded-full">
                    {selectedCategories.length + selectedSubCategories.length + selectedBrands.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => handleCategoryChange(category.name)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Sub-Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allSubCategories.map((subCategory) => (
                <DropdownMenuCheckboxItem
                  key={subCategory.id}
                  checked={selectedSubCategories.includes(subCategory.name)}
                  onCheckedChange={() => handleSubCategoryChange(subCategory.name)}
                >
                  {subCategory.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Brand</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allBrands.map((brand) => (
                <DropdownMenuCheckboxItem
                  key={brand.id}
                  checked={selectedBrands.includes(brand.name)}
                  onCheckedChange={() => handleBrandChange(brand.name)}
                >
                  {brand.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedBrands.length > 0) && (
        <div className="flex flex-wrap gap-2 my-2">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="outline" className="bg-primary/10">
              Category: {category}
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleCategoryChange(category)}
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedSubCategories.map((subCategory) => (
            <Badge key={subCategory} variant="outline" className="bg-secondary/10">
              Sub-Category: {subCategory}
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleSubCategoryChange(subCategory)}
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedBrands.map((brand) => (
            <Badge key={brand} variant="outline" className="bg-accent/10">
              Brand: {brand}
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleBrandChange(brand)}
              >
                ×
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-5 px-2 text-xs">
            Clear All
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Products display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No products found matching your filters.
            </div>
          )}
        </div>
      ) : (
        <ProductTable products={filteredProducts} />
      )}
    </div>
  )
}
