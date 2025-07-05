"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Minus, X, ShoppingCart, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Product {
  _id: string
  name: string
  brand: string
  price: { sellingPrice: number }
  stock: { quantity: number }
  category: { name: string }
  images?: string[]
}

interface SaleItem {
  id: number
  productId: string
  productName: string
  price: number
  quantity: number
  discount: number
  total: number
  maxQuantity: number
  image?: string
}

export function NewSaleButton() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<SaleItem[]>([])
  const [customer, setCustomer] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [reference, setReference] = useState(`SALE-${Date.now().toString().slice(-6)}`)
  const [notes, setNotes] = useState("")
  
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingProducts, setIsFetchingProducts] = useState(false)
  
  // For pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const productsPerPage = 10
  const observerRef = useRef(null)

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const globalDiscount = 0
  const total = subtotal - globalDiscount

  useEffect(() => {
    if (open) {
      fetchProducts()
      fetchCategories()
    }
  }, [open])
  
  // Reset page when search or category changes
  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [searchTerm, selectedCategory])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingProducts) {
          setPage(prevPage => prevPage + 1)
        }
      },
      { threshold: 0.5 }
    )
    
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasMore, isFetchingProducts])

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
      product.category?.name === selectedCategory

    return matchesSearch && matchesCategory
  })
  
  // Get paginated products
  const paginatedProducts = filteredProducts.slice(0, page * productsPerPage)

  const fetchProducts = async () => {
    setIsFetchingProducts(true)
    try {
      const response = await apiClient.get("/products")
      setProducts(response.data)
      setHasMore(response.data.length > productsPerPage)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsFetchingProducts(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/categories")
      
      // Create All Products option
      const categoryList = [{ id: "all", name: "All Products" }]
      
      // Extract all unique category names
      const uniqueCategories = Array.from(
        new Set(response.data.map((cat: any) => cat.name))
      ).map((name: string) => {
        const cat = response.data.find((c: any) => c.name === name)
        return { id: cat._id, name }
      })
      
      setCategories([...categoryList, ...uniqueCategories])
    } catch (err) {
      console.error("Failed to fetch categories", err)
    }
  }

  const addProductToSale = (product: Product) => {
    // Check if product is already in the sale
    const existingItem = items.find(item => item.productId === product._id)
    
    if (existingItem) {
      // If already in cart, increase quantity
      if (existingItem.quantity < existingItem.maxQuantity) {
        const updatedItems = items.map(item => {
          if (item.productId === product._id) {
            const newQuantity = item.quantity + 1
            return {
              ...item,
              quantity: newQuantity,
              total: (item.price * newQuantity) * (1 - item.discount / 100)
            }
          }
          return item
        })
        setItems(updatedItems)
      } else {
        toast({
          title: "Maximum stock reached",
          description: `Cannot add more of ${product.name}`,
          variant: "warning"
        })
      }
    } else {
      // Add as new item
      if (product.stock.quantity > 0) {
        const newItem: SaleItem = {
          id: Date.now(),
          productId: product._id,
          productName: product.name,
          price: product.price.sellingPrice,
          quantity: 1,
          discount: 0,
          total: product.price.sellingPrice,
          maxQuantity: product.stock.quantity,
          image: product.images?.[0]
        }
        setItems([...items, newItem])
      } else {
        toast({
          title: "Out of stock",
          description: `${product.name} is currently out of stock`,
          variant: "warning"
        })
      }
    }
  }

  const updateItemQuantity = (itemId: number, amount: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, Math.min(item.quantity + amount, item.maxQuantity))
        return {
          ...item,
          quantity: newQuantity,
          total: (item.price * newQuantity) * (1 - item.discount / 100)
        }
      }
      return item
    })
    setItems(updatedItems)
  }

  const updateItemDiscount = (itemId: number, discount: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          discount,
          total: (item.price * item.quantity) * (1 - discount / 100)
        }
      }
      return item
    })
    setItems(updatedItems)
  }

  const removeItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the sale",
        variant: "destructive"
      })
      return
    }
    
    const saleData = {
      products: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.total
      })),
      totalAmount: total,
      customer: customer || "Walk-in Customer",
      paymentMethod,
      reference,
      notes: notes || `Sale transaction on ${new Date().toLocaleDateString()}`
    }
    
    setIsLoading(true)
    
    try {
      await apiClient.post("/inventory/sales", saleData)
      
      toast({
        title: "Sale completed",
        description: `Sale of ₹${total.toFixed(2)} has been recorded`,
      })
      
      setItems([])
      setCustomer("")
      setPaymentMethod("cash")
      setReference(`SALE-${Date.now().toString().slice(-6)}`)
      setNotes("")
      setOpen(false)
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to complete sale",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(state) => {
      if (!isLoading) setOpen(state)
      if (!state) {
        setItems([])
        setSearchTerm("")
        setPage(1)
      }
    }}>
      <DialogTrigger asChild>
        <Button >
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </DialogTrigger>
<DialogContent className="sm:max-w-[950px] max-h-[90vh] p-0">
  <div className="flex h-[80vh] flex-col md:flex-row overflow-hidden">
    {/* Product selection panel with fixed height */}
    <div className="w-full md:w-3/5 border-b md:border-b-0 md:border-r h-full overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        <DialogHeader className="text-left mb-4 flex-shrink-0">
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>

        {/* Search and filter - fixed height */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-4 flex-shrink-0">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..." 
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
              
              {/* Category pills */}
            <ScrollArea className="w-full whitespace-nowrap pb-2 flex-shrink-0" orientation="horizontal">
          <div className="flex gap-2 mb-4">
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="rounded-full text-xs px-3"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

              {/* Products grid with infinite scroll */}
                      <div className="flex-1 overflow-hidden min-h-0">
         <ScrollArea className="flex-1 h-[calc(100%-120px)]" type="always">
                {isFetchingProducts && page === 1 ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : paginatedProducts.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-2" />
                    <p>No products found</p>
                    <p className="text-sm">Try adjusting your search or filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                    {paginatedProducts.map(product => (
                      <div
                        key={product._id}
                        className="group rounded-lg border hover:border-primary/50 bg-card transition-all hover:shadow-sm"
                        onClick={() => addProductToSale(product)}
                      >
                        <div className="p-3 flex gap-3 cursor-pointer">
                          {/* Product image or placeholder */}
                          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 overflow-hidden">
                            <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {product.category?.name && (
                                <Badge variant="outline" className="text-xs">
                                  {product.category.name}
                                </Badge>
                              )}
                              {product.brand && (
                                <span className="text-muted-foreground text-xs">{product.brand}</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="font-semibold">₹{product.price.sellingPrice.toFixed(2)}</span>
                              {product.stock.quantity > 0 ? (
                                <Badge 
                                  className="text-xs"
                                  variant={product.stock.quantity < 5 ? "warning" : "outline"}
                                >
                                  {product.stock.quantity < 5 
                                    ? `${product.stock.quantity} left` 
                                    : `${product.stock.quantity} in stock`}
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="text-xs">Out of stock</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Observer element for infinite scroll */}
                    {hasMore && (
                      <div 
                        ref={observerRef}
                        className="h-10 flex items-center justify-center"
                      >
                        {isFetchingProducts && page > 1 && (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
</div>
          {/* Cart panel */}
        <div className="w-full md:w-2/5 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Sale Summary ({items.length} items)</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
        <Tabs defaultValue="items" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 pt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="items">Cart</TabsTrigger>
                    <TabsTrigger value="details">Customer Details</TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Cart items tab */}
                <TabsContent value="items" className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full px-4" type="always">
                {items.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 mb-2" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add products from the left panel</p>
                  </div>
                ) : (
                  <div className="py-2 space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="border rounded-md p-2">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2 items-center">
                            {item.image ? (
                              <div className="h-8 w-8 bg-muted rounded">
                                <img src={item.image} alt="" className="h-full w-full object-contain" />
                              </div>
                            ) : null}
                            <div className="max-w-[180px]">
                              <p className="font-medium text-xs line-clamp-1">{item.productName}</p>
                              <p className="text-muted-foreground text-xs">₹{item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* ADDED PRICE EDITING */}
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor={`price-${item.id}`} className="text-xs text-muted-foreground">
                              Price (₹)
                            </Label>
                            <Input
                              id={`price-${item.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              className="h-8 text-xs"
                              value={item.price}
                              onChange={(e) => {
                                const price = parseFloat(e.target.value) || 0;
                                const updatedItems = items.map(i => {
                                  if (i.id === item.id) {
                                    return {
                                      ...i,
                                      price,
                                      total: price * i.quantity * (1 - i.discount / 100)
                                    };
                                  }
                                  return i;
                                });
                                setItems(updatedItems);
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground">
                              Quantity
                            </Label>
                            <div className="flex items-center border rounded-md h-8">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-none"
                                onClick={() => updateItemQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-7 text-center text-xs">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-none"
                                onClick={() => updateItemQuantity(item.id, 1)}
                                disabled={item.quantity >= item.maxQuantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`discount-${item.id}`} className="text-xs text-muted-foreground">
                              Discount (%)
                            </Label>
                            <div className="flex items-center border rounded-md h-8">
                              <Input
                                id={`discount-${item.id}`}
                                type="number"
                                className="w-full h-8 text-xs border-0 rounded-none"
                                value={item.discount}
                                min={0}
                                max={100}
                                onChange={(e) => updateItemDiscount(item.id, Number(e.target.value) || 0)}
                              />
                              <span className="text-xs text-muted-foreground px-1">%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-1 flex justify-end">
                          <div className="font-medium text-xs">
                            Total: ₹{item.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
                  
                  {/* Totals summary */}
                 <div className="border-t p-4 space-y-2 flex-shrink-0">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>₹{globalDiscount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
                </TabsContent>
                
                {/* Customer details tab */}
                     <TabsContent value="details" className="flex-1 overflow-hidden">
            <div className="h-full overflow-hidden">
              <ScrollArea className="h-full px-4 py-2" type="always">
                <div className="space-y-4 pb-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer">Customer Name</Label>
                        <Input
                          id="customer"
                          placeholder="Walk-in Customer"
                          value={customer}
                          onChange={(e) => setCustomer(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {["cash", "digital", "credit"].map((method) => (
                            <Button
                              key={method}
                              type="button"
                              variant={paymentMethod === method ? "default" : "outline"}
                              onClick={() => setPaymentMethod(method)}
                              className="justify-center"
                            >
                              {paymentMethod === method && <Check className="mr-1 h-3 w-3" />}
                              {method.charAt(0).toUpperCase() + method.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference No.</Label>
                        <Input
                          id="reference"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                          id="notes"
                          placeholder="Any special instructions or notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                    </div>
                </TabsContent>
              </Tabs>
              
              {/* Checkout button */}
             <div className="p-4 border-t flex-shrink-0">
          <Button 
            type="submit" 
            className="w-full "
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Complete Sale (₹{total.toFixed(2)})
              </>
            )}
          </Button>
        </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}