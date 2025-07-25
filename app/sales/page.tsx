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
  CalendarRange, 
  Download, 
  Filter, 
  Loader2, 
  Trash2, 
  AlertCircle,
  X
} from "lucide-react"
import { NewSaleButton } from "@/components/new-sale-button"
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

interface Sale {
  _id: string
  reference: string
  createdAt: string
  customer: string
  paymentMethod: string
  totalAmount: number
  products: Array<{
    product: {
      _id: string
      name: string
      sku: string
    }
    quantity: number
    price: number
    discount: number
    total: number
  }>
  notes: string
  createdBy?: {
    _id: string
    name: string
  }
}

export default function SalesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [totalValue, setTotalValue] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  
  // Deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState("")
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined)

  // Load sales on initial render
  useEffect(() => {
    fetchSales()
  }, [])
  
  // Apply search filter
  useEffect(() => {
    let result = [...sales]
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase()
      result = result.filter(
        sale => 
          (sale.customer?.toLowerCase().includes(lowerCaseSearch)) ||
          sale.reference?.toLowerCase().includes(lowerCaseSearch) ||
          sale.totalAmount.toString().includes(searchTerm)
      )
    }
    
    setFilteredSales(result)
  }, [sales, searchTerm])
  
  // Get current sales for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)

  const fetchSales = async (params = {}) => {
    setLoading(true)
    try {
      let queryParams = new URLSearchParams()
      
      if (params.startDate) {
        queryParams.append('startDate', params.startDate)
      }
      
      if (params.endDate) {
        queryParams.append('endDate', params.endDate)
      }
      
      if (params.customer) {
        queryParams.append('customer', params.customer)
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
      const response = await apiClient.get(`/inventory/sales${queryString}`)
      
      setSales(response.data.sales)
      setFilteredSales(response.data.sales)
      setTotalValue(response.data.totalValue)
      setTotalCount(response.data.count)
      setCurrentPage(1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
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
      params.customer = tempSearchTerm
      setSearchTerm(tempSearchTerm)
    }
    
    fetchSales(params)
    setFilterOpen(false)
  }
  
  const resetFilters = () => {
    setDateRange(undefined)
    setSearchTerm("")
    setTempDateRange(undefined)
    setTempSearchTerm("")
    fetchSales()
    setFilterOpen(false)
  }

  const clearFilter = (type: 'date' | 'customer') => {
    if (type === 'date') {
      setDateRange(undefined)
      setTempDateRange(undefined)
    } else {
      setSearchTerm("")
      setTempSearchTerm("")
    }
    
    const params: any = {}
    if (type === 'customer' && dateRange?.from) {
      params.startDate = dateRange.from.toISOString()
      if (dateRange.to) params.endDate = dateRange.to.toISOString()
    }
    if (type === 'date' && searchTerm) {
      params.customer = searchTerm
    }
    
    fetchSales(params)
  }
  
  const handleDeleteSale = async () => {
    if (!deletingSaleId) return
    
    setDeletingLoading(true)
    try {
      await apiClient.delete(`/inventory/sales/${deletingSaleId}`)
      setSales(sales.filter(sale => sale._id !== deletingSaleId))
      setFilteredSales(filteredSales.filter(sale => sale._id !== deletingSaleId))
      toast({
        title: "Success",
        description: "Sale deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sale",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setDeletingSaleId(null)
      setDeletingLoading(false)
    }
  }
  
  const handleViewDetails = (saleId: string) => {
    router.push(`/sales/${saleId}`)
  }
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Invoice #", "Date", "Customer", "Payment Method", "Amount", "Products", "Notes"]
    
    const csvRows = [
      headers.join(","),
      ...filteredSales.map(sale => {
        const productsInfo = sale.products.map(p => `${p.product.name} (${p.quantity})`).join("; ")
        return [
          sale.reference,
          new Date(sale.createdAt).toLocaleDateString(),
          sale.customer || "Walk-in Customer",
          sale.paymentMethod,
          sale.totalAmount.toFixed(2),
          productsInfo,
          sale.notes?.replace(/,/g, ";") || ""
        ].join(",")
      })
    ]
    
    // Download as file
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sales-export-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <NewSaleButton />
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>View and manage all your sales transactions.</CardDescription>
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
                placeholder="Search sales..." 
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
                        {[dateRange?.from && "Date", searchTerm && "Customer"].filter(Boolean).length}
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
                      <Label className="text-sm font-medium">Customer</Label>
                      <Input
                        placeholder="Search by customer name"
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
                  Customer: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => clearFilter('customer')}
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
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Method</TableHead>
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
                ) : currentSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>No sales found</p>
                        {searchTerm && (
                          <p className="text-sm mt-1">Try adjusting your search</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentSales.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell className="font-medium">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-medium text-primary hover:underline"
                          onClick={() => handleViewDetails(sale._id)}
                        >
                          {sale.reference || `INV-${sale._id.slice(-6)}`}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {format(new Date(sale.createdAt), "PPP")}
                      </TableCell>
                      <TableCell>{sale.customer || "Walk-in Customer"}</TableCell>
                      <TableCell>
                        <Badge variant={
                          !sale.paymentMethod ? "outline" :
                          sale.paymentMethod === "cash" ? "outline" : 
                          sale.paymentMethod === "credit" ? "destructive" : 
                          "secondary"
                        }>
                          {!sale.paymentMethod ? "Unknown" : 
                            sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{sale.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(sale._id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setDeletingSaleId(sale._id)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Sale
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
              <AlertDialogTitle>Delete Sale</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-3">
              Are you sure you want to delete this sale? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSale}
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