"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CategoryFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const categories = [
    { id: "lighting", name: "Lighting" },
    { id: "wiring", name: "Wiring" },
    { id: "fans", name: "Fans" },
    { id: "switches", name: "Switches" },
    { id: "ac-parts", name: "AC Parts" },
  ]

  const brands = [
    { id: "osaka", name: "Osaka" },
    { id: "phinix", name: "Phinix" },
    { id: "phipro", name: "Phipro" },
    { id: "philix", name: "Philix" },
    { id: "hinix", name: "Hinix" },
    { id: "havells", name: "Havells" },
    { id: "finolex", name: "Finolex" },
    { id: "usha", name: "Usha" },
    { id: "orient", name: "Orient" },
    { id: "crompton", name: "Crompton" },
  ]

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <Badge variant="secondary" className="ml-2 px-1 rounded-full">
                {selectedCategories.length + selectedBrands.length}
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
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Brand</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {brands.map((brand) => (
            <DropdownMenuCheckboxItem
              key={brand.id}
              checked={selectedBrands.includes(brand.id)}
              onCheckedChange={() => handleBrandChange(brand.id)}
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

      {selectedCategories.length > 0 &&
        selectedCategories.map((category) => {
          const categoryName = categories.find((c) => c.id === category)?.name
          return (
            <Badge key={category} variant="outline" className="bg-primary/10">
              {categoryName}
            </Badge>
          )
        })}

      {selectedBrands.length > 0 &&
        selectedBrands.map((brand) => {
          const brandName = brands.find((b) => b.id === brand)?.name
          return (
            <Badge key={brand} variant="outline" className="bg-secondary/10">
              {brandName}
            </Badge>
          )
        })}
    </div>
  )
}
