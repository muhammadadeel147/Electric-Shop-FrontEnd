import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { NewSaleButton } from "@/components/new-sale-button"

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <NewSaleButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>View and manage all your sales transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search sales..." className="pl-8 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">INV-{sale.id.toString().padStart(4, "0")}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.customer || "Walk-in Customer"}</TableCell>
                    <TableCell>
                      <Badge variant={sale.paymentMethod === "Cash" ? "outline" : "secondary"}>
                        {sale.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{sale.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{sale.profit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/receipts/${sale.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const sales = [
  {
    id: 1001,
    date: "2023-04-15",
    customer: "Rahul Sharma",
    paymentMethod: "Cash",
    amount: 1250.0,
    profit: 350.0,
  },
  {
    id: 1002,
    date: "2023-04-15",
    customer: "Priya Patel",
    paymentMethod: "Digital",
    amount: 850.0,
    profit: 220.0,
  },
  {
    id: 1003,
    date: "2023-04-14",
    customer: "Amit Kumar",
    paymentMethod: "Digital",
    amount: 1800.0,
    profit: 450.0,
  },
  {
    id: 1004,
    date: "2023-04-14",
    customer: "Neha Singh",
    paymentMethod: "Cash",
    amount: 2500.0,
    profit: 600.0,
  },
  {
    id: 1005,
    date: "2023-04-13",
    customer: "Vikram Joshi",
    paymentMethod: "Digital",
    amount: 1350.0,
    profit: 320.0,
  },
  {
    id: 1006,
    date: "2023-04-13",
    customer: null,
    paymentMethod: "Cash",
    amount: 750.0,
    profit: 180.0,
  },
  {
    id: 1007,
    date: "2023-04-12",
    customer: "Ananya Desai",
    paymentMethod: "Digital",
    amount: 3200.0,
    profit: 780.0,
  },
]
