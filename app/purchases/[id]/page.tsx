"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Package, FileText, Loader2, Truck } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"

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

export default function PurchaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPurchaseDetails(params.id as string)
    }
  }, [params.id])

  const fetchPurchaseDetails = async (purchaseId: string) => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/inventory/purchases/${purchaseId}`)
      setPurchase(response.data.transaction)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch purchase details",
        variant: "destructive"
      })
      router.push('/purchases')
    } finally {
      setLoading(false)
    }
  }

  const getSupplierFromNotes = (notes: string) => {
    return notes?.split(' ')[0] || "Unknown Supplier"
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

  if (!purchase) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Purchase not found</p>
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
              {purchase.reference || `PO-${purchase._id.slice(-6)}`}
            </h1>
            <p className="text-muted-foreground">Purchase Order Details</p>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">{format(new Date(purchase.createdAt), "PPP")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                <p className="text-lg font-semibold">{getSupplierFromNotes(purchase.notes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Items</p>
                <p className="text-lg font-semibold">{purchase.products.length} Products</p>
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
                <p className="text-lg font-semibold">₹{purchase.totalAmount.toFixed(2)}</p>
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
            Products ({purchase.products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {purchase.products.map((item, idx) => {
              const itemTotal = item.total || (item.price * item.quantity);
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 0;
              
              return (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name || "Product"}</h4>
                    {item.product?.sku && (
                      <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Qty: {itemQuantity}</span>
                      <span>Unit Price: ₹{itemPrice.toFixed(2)}</span>
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
            <span className="text-2xl font-bold">₹{purchase.totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(purchase.notes || purchase.createdBy) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchase.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted/50 p-3 rounded-md">{purchase.notes}</p>
              </CardContent>
            </Card>
          )}

          {purchase.createdBy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Created By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{purchase.createdBy.name}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}