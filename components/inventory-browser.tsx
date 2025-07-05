"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Home, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/product-card"
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
    profitMargin?: number
  }
  stock: {
    quantity: number
    minThreshold: number
    reorderPoint?: number
    maxStock?: number
    alertSent?: boolean
  }
  stockStatus: string
  supplier: {
    name: string
    code?: string
  }
  images: string[]
  isActive: boolean
}

export function InventoryBrowser() {
  // State for UI
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for data
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  
  // State for category navigation
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<{id: string, name: string}[]>([])
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null)
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching initial data...")
        
        // Fetch categories and featured products in parallel
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiClient.get("/categories"),
          apiClient.get("/products?limit=8") // Limit to 8 featured products for initial view
        ])
        
        console.log("Categories response:", categoriesResponse.data)
        console.log("Products response:", productsResponse.data)
        
        // Handle response structure properly
        const categoriesData = categoriesResponse.data.categories || categoriesResponse.data || []
        const productsData = productsResponse.data.products || productsResponse.data || []
        
        setCategories(categoriesData)
        setProducts(productsData)
        setDisplayProducts(productsData) // Show the limited products from API
        
        console.log("Data loaded successfully:", { 
          categories: categoriesData.length, 
          products: productsData.length 
        })
      } catch (err) {
        setError("Failed to load inventory data")
        console.error("Error loading initial data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchInitialData()
  }, [])

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      return
    }
    
    setIsSearching(true)
    try {
      let response
      
      // If a category is selected, search within that category
      if (currentCategory) {
        response = await apiClient.get(`/products?search=${searchTerm}&category=${currentCategory._id}`)
      } else {
        response = await apiClient.get(`/products?search=${searchTerm}`)
      }
      
      const searchResults = response.data.products || response.data || []
      setDisplayProducts(searchResults)
    } catch (err) {
      setError("Failed to search products")
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  // Reset search
  const resetSearch = () => {
    setSearchTerm("")
    // Re-fetch products based on current category selection
    if (currentCategory) {
      fetchProductsByCategory(currentCategory._id)
    } else {
      // Reset to initial featured products
      fetchInitialProducts()
    }
  }

  // Fetch initial products (limited set)
  const fetchInitialProducts = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get("/products?limit=8")
      const productsData = response.data.products || response.data || []
      setDisplayProducts(productsData)
    } catch (err) {
      setError("Failed to load products")
      console.error("Products error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch products by category
  const fetchProductsByCategory = async (categoryId: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(`/products?category=${categoryId}`)
      const categoryProducts = response.data.products || response.data || []
      setDisplayProducts(categoryProducts)
    } catch (err) {
      setError("Failed to load category products")
      console.error("Category products error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Find a category by ID in the nested structure
  const findCategoryById = (categoryId: string, categoriesList = categories): CategoryType | null => {
    for (const category of categoriesList) {
      if (category._id === categoryId) return category
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(categoryId, category.children)
        if (found) return found
      }
    }
    return null
  }

  // Build path to a category
  const buildCategoryPath = (categoryId: string): {id: string, name: string}[] => {
    const result: {id: string, name: string}[] = []
    const buildPath = (catId: string, path: {id: string, name: string}[]) => {
      const category = findCategoryById(catId)
      if (!category) return false
      
      // Add this category to the path
      path.unshift({ id: category._id, name: category.name })
      
      // If it has a parent, recursively add the parent
      if (category.parent) {
        buildPath(category.parent, path)
      }
      
      return true
    }
    
    buildPath(categoryId, result)
    return result
  }

  // Handle category selection
  const handleCategorySelect = async (category: any) => {
    const selectedCategory = findCategoryById(category._id || category.id)
    if (!selectedCategory) return
    
    setCurrentCategory(selectedCategory)
    
    // Build path to this category
    const path = buildCategoryPath(selectedCategory._id)
    setSelectedCategoryPath(path)
    
    // Fetch products for this category
    await fetchProductsByCategory(selectedCategory._id)
  }

  // Handle breadcrumb navigation
  const navigateToBreadcrumb = async (index: number) => {
    if (index === 0) {
      // Reset to home view
      setCurrentCategory(null)
      setSelectedCategoryPath([])
      await fetchInitialProducts()
      return
    }
    
    // Navigate to a specific category in the path
    const targetPath = selectedCategoryPath.slice(0, index + 1)
    const targetCategory = findCategoryById(targetPath[targetPath.length - 1].id)
    
    setCurrentCategory(targetCategory)
    setSelectedCategoryPath(targetPath)
    
    if (targetCategory) {
      await fetchProductsByCategory(targetCategory._id)
    }
  }

  // Get current view items (categories or subcategories)
  const getCurrentViewItems = () => {
    if (currentCategory) {
      // Show the children of the current category
      return currentCategory.children?.map(child => ({
        _id: child._id,
        name: child.name,
        description: child.description || "",
        totalProducts: child.totalProducts || 0
      })) || []
    } else {
      // Show top level categories
      return categories.map(category => ({
        _id: category._id,
        name: category.name,
        description: category.description || "",
        totalProducts: category.totalProducts || 0
      }))
    }
  }

  // Reset view to initial state
  const resetView = async () => {
    setCurrentCategory(null)
    setSelectedCategoryPath([])
    setSearchTerm("")
    await fetchInitialProducts()
  }

  const viewItems = getCurrentViewItems()

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className="absolute right-0 top-0 h-10"
              onClick={resetSearch}
            >
              Clear
            </Button>
          )}
        </form>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
        >
          <Home className="h-4 w-4 mr-2" />
          Reset View
        </Button>
      </div>

      {/* Breadcrumb navigation */}
      <div className="flex items-center flex-wrap gap-2 text-sm">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm font-medium" 
          onClick={() => navigateToBreadcrumb(0)}
        >
          All Categories
        </Button>
        
        {selectedCategoryPath.map((crumb, index) => (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm font-medium" 
              onClick={() => navigateToBreadcrumb(index)}
            >
              {crumb.name}
            </Button>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              setError(null)
              fetchInitialProducts()
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Category browser */}
          {viewItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {viewItems.map((item) => (
                <Card
                  key={item._id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleCategorySelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="h-16 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{item.name.charAt(0)}</span>
                        </div>
                      </div>
                      <h3 className="mt-2 font-medium truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      <div className="mt-1">
                        <Badge variant="outline">{item.totalProducts} Products</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Products display */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              {currentCategory 
                ? `Products in ${currentCategory.name}`
                : searchTerm 
                  ? `Search Results for "${searchTerm}"`
                  : "Featured Products"}
            </h3>

            {isSearching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No products found in this category.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}