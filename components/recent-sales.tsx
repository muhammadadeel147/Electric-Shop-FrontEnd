"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/loading-spinner"
import apiClient from "@/utils/apiClient"

interface Sale {
  _id: string
  saleDate: string
  customerName: string
  products: Array<{
    product: {
      name: string
    }
    quantity: number
  }>
  totalAmount: number
}

export function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentSales()
  }, [])

  const fetchRecentSales = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch recent sales with limit
      const response = await apiClient.get('/sales?limit=5&sortBy=saleDate&sortOrder=desc')
      setSales(response.data.sales || [])
    } catch (error: any) {
      console.error('Error fetching recent sales:', error)
      setError('Failed to load recent sales')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatProducts = (products: Sale['products']) => {
    return products
      .map(p => `${p.product.name} (${p.quantity})`)
      .join(", ")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground">
        <p>{error}</p>
        <button 
          onClick={fetchRecentSales}
          className="text-primary hover:underline mt-2"
        >
          Try again
        </button>
      </div>
    )
  }

  if (sales.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No recent sales found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(sale.customerName)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {formatProducts(sale.products)}
            </p>
          </div>
          <div className="ml-auto font-medium">₹{sale.totalAmount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}