"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, CreditCard, Package, FileText, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"

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

export default function SaleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [sale, setSale] = useState<Sale | null>(null)
  const [loading, setLoading] = useState(true)
console.log("SaleDetailPage mounted with params:", params)
  useEffect(() => {
    if (params.id) {
      fetchSaleDetails(params.id as string)
    }
  }, [params.id])

  const fetchSaleDetails = async (saleId: string) => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/inventory/sales/${saleId}`)
      setSale(response.data.transaction)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sale details",
        variant: "destructive"
      })
      router.push('/sales')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Sale not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {sale.reference || `INV-${sale._id.slice(-6)}`}
            </h1>
            <p className="text-muted-foreground">Sale Details</p>
          </div>
        </div>
      </div>

      {/* Sale Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">{format(new Date(sale.createdAt), "PPP")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="text-lg font-semibold">{sale.customer || "Walk-in Customer"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <Badge variant={
                  !sale.paymentMethod ? "outline" :
                  sale.paymentMethod === "cash" ? "outline" : 
                  sale.paymentMethod === "credit" ? "destructive" : 
                  "secondary"
                } className="mt-1">
                  {!sale.paymentMethod ? "Unknown" : 
                    sale.paymentMethod.charAt(0).toUpperCase() + 
                    sale.paymentMethod.slice(1)
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">₹{sale.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products ({sale.products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sale.products.map((item, idx) => {
              const itemTotal = item.total || (item.price * item.quantity * (1 - (item.discount || 0) / 100));
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 0;
              const itemDiscount = item.discount || 0;
              
              return (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name || "Product"}</h4>
                    {item.product?.sku && (
                      <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Qty: {itemQuantity}</span>
                      <span>Price: ₹{itemPrice.toFixed(2)}</span>
                      {itemDiscount > 0 && (
                        <span>Discount: {itemDiscount}%</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{itemTotal.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold">₹{sale.totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(sale.notes || sale.createdBy) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sale.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted/50 p-3 rounded-md">{sale.notes}</p>
              </CardContent>
            </Card>
          )}

          {sale.createdBy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Created By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{sale.createdBy.name}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}