"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { 
  Search, 
  Eye, 
  Download, 
  Filter, 
  Loader2, 
  Trash2, 
  AlertCircle,
  X,
  Plus,
  Package
} from "lucide-react"
import apiClient from "@/utils/apiClient"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/DateRangePicker"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/Pagination"

interface Purchase {
  _id: string
  reference: string
  createdAt: string
  notes: string
  totalAmount: number
  products: Array<{
    product: {
      _id: string
      name: string
      sku: string
    }
    quantity: number
    price: number
    total: number
  }>
  createdBy?: {
    _id: string
    name: string
  }
}

export default function PurchasesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [totalValue, setTotalValue] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  
  // Deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPurchaseId, setDeletingPurchaseId] = useState<string | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState("")
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined)

  // Load purchases on initial render
  useEffect(() => {
    fetchPurchases()
  }, [])
  
  // Apply search filter
  useEffect(() => {
    let result = [...purchases]
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase()
      result = result.filter(
        purchase => 
          (purchase.notes?.toLowerCase().includes(lowerCaseSearch)) ||
          purchase.reference?.toLowerCase().includes(lowerCaseSearch) ||
          purchase.totalAmount.toString().includes(searchTerm)
      )
    }
    
    setFilteredPurchases(result)
  }, [purchases, searchTerm])
  
  // Get current purchases for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPurchases = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage)

  const fetchPurchases = async (params = {}) => {
    setLoading(true)
    try {
      let queryParams = new URLSearchParams()
      
      if (params.startDate) {
        queryParams.append('startDate', params.startDate)
      }
      
      if (params.endDate) {
        queryParams.append('endDate', params.endDate)
      }
      
      if (params.supplier) {
        queryParams.append('supplier', params.supplier)
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
      const response = await apiClient.get(`/inventory/purchases${queryString}`)
      
      setPurchases(response.data.purchases)
      setFilteredPurchases(response.data.purchases)
      setTotalValue(response.data.totalValue)
      setTotalCount(response.data.count)
      setCurrentPage(1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch purchases data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }
  
  const applyFilters = () => {
    const params: any = {}
    
    if (tempDateRange?.from) {
      params.startDate = tempDateRange.from.toISOString()
      setDateRange(tempDateRange)
    }
    
    if (tempDateRange?.to) {
      params.endDate = tempDateRange.to.toISOString()
    }
    
    if (tempSearchTerm) {
      params.supplier = tempSearchTerm
      setSearchTerm(tempSearchTerm)
    }
    
    fetchPurchases(params)
    setFilterOpen(false)
  }
  
  const resetFilters = () => {
    setDateRange(undefined)
    setSearchTerm("")
    setTempDateRange(undefined)
    setTempSearchTerm("")
    fetchPurchases()
    setFilterOpen(false)
  }

  const clearFilter = (type: 'date' | 'supplier') => {
    if (type === 'date') {
      setDateRange(undefined)
      setTempDateRange(undefined)
    } else {
      setSearchTerm("")
      setTempSearchTerm("")
    }
    
    const params: any = {}
    if (type === 'supplier' && dateRange?.from) {
      params.startDate = dateRange.from.toISOString()
      if (dateRange.to) params.endDate = dateRange.to.toISOString()
    }
    if (type === 'date' && searchTerm) {
      params.supplier = searchTerm
    }
    
    fetchPurchases(params)
  }
  
  const handleDeletePurchase = async () => {
    if (!deletingPurchaseId) return
    
    setDeletingLoading(true)
    try {
      await apiClient.delete(`/inventory/purchases/${deletingPurchaseId}`)
      setPurchases(purchases.filter(purchase => purchase._id !== deletingPurchaseId))
      setFilteredPurchases(filteredPurchases.filter(purchase => purchase._id !== deletingPurchaseId))
      toast({
        title: "Success",
        description: "Purchase deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete purchase",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setDeletingPurchaseId(null)
      setDeletingLoading(false)
    }
  }
  
  const handleViewDetails = (purchaseId: string) => {
    router.push(`/purchases/${purchaseId}`)
  }
  
  const exportToCSV = () => {
    const headers = ["Purchase Order #", "Date", "Supplier", "Amount", "Products", "Notes"]
    
    const csvRows = [
      headers.join(","),
      ...filteredPurchases.map(purchase => {
        const productsInfo = purchase.products.map(p => `${p.product.name} (${p.quantity})`).join("; ")
        return [
          purchase.reference,
          new Date(purchase.createdAt).toLocaleDateString(),
          getSupplierFromNotes(purchase.notes),
          purchase.totalAmount.toFixed(2),
          productsInfo,
          purchase.notes?.replace(/,/g, ";") || ""
        ].join(",")
      })
    ]
    
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `purchases-export-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getSupplierFromNotes = (notes: string) => {
    // Extract supplier from notes or return "Unknown Supplier"
    return notes?.split(' ')[0] || "Unknown Supplier"
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
        <Button onClick={() => router.push('/purchases/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>View and manage all your purchase transactions.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Badge variant="secondary" className="w-auto px-2 py-1 text-xs">
              {totalCount} Transactions
            </Badge>
            <Badge variant="outline" className="w-auto px-2 py-1 text-xs">
              Total: ₹{totalValue.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search purchases..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                    {(dateRange?.from || searchTerm) && (
                      <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                        {[dateRange?.from && "Date", searchTerm && "Supplier"].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Date Range</Label>
                      <DateRangePicker
                        value={tempDateRange}
                        onChange={setTempDateRange}
                        placeholder="Select date range"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Supplier</Label>
                      <Input
                        placeholder="Search by supplier name"
                        value={tempSearchTerm}
                        onChange={(e) => setTempSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(dateRange?.from || searchTerm) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {dateRange?.from && (
                <Badge variant="secondary" className="text-xs">
                  Date: {dateRange.from.toLocaleDateString()} - {dateRange.to?.toLocaleDateString() || "..."}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => clearFilter('date')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Supplier: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => clearFilter('supplier')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : currentPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8 mb-2" />
                        <p>No purchases found</p>
                        {searchTerm && (
                          <p className="text-sm mt-1">Try adjusting your search</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPurchases.map((purchase) => (
                    <TableRow key={purchase._id}>
                      <TableCell className="font-medium">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-medium text-primary hover:underline"
                          onClick={() => handleViewDetails(purchase._id)}
                        >
                          {purchase.reference || `PO-${purchase._id.slice(-6)}`}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {format(new Date(purchase.createdAt), "PPP")}
                      </TableCell>
                      <TableCell>{getSupplierFromNotes(purchase.notes)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {purchase.products.length} item{purchase.products.length !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{purchase.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(purchase._id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setDeletingPurchaseId(purchase._id)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Purchase
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle>Delete Purchase</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-3">
              Are you sure you want to delete this purchase? This action cannot be undone and will affect your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePurchase}
              disabled={deletingLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}