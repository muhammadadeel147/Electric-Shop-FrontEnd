import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Printer, Download } from "lucide-react"
import Link from "next/link"

export default function ReceiptsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt History</CardTitle>
          <CardDescription>View and print receipts for all your sales.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search receipts..." className="pl-8 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export All
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">RCP-{receipt.id.toString().padStart(4, "0")}</TableCell>
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell>{receipt.customer || "Walk-in Customer"}</TableCell>
                    <TableCell className="text-right">₹{receipt.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/receipts/${receipt.id}`}>
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
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

const receipts = [
  {
    id: 1001,
    date: "2023-04-15",
    customer: "Rahul Sharma",
    amount: 1250.0,
  },
  {
    id: 1002,
    date: "2023-04-15",
    customer: "Priya Patel",
    amount: 850.0,
  },
  {
    id: 1003,
    date: "2023-04-14",
    customer: "Amit Kumar",
    amount: 1800.0,
  },
  {
    id: 1004,
    date: "2023-04-14",
    customer: "Neha Singh",
    amount: 2500.0,
  },
  {
    id: 1005,
    date: "2023-04-13",
    customer: "Vikram Joshi",
    amount: 1350.0,
  },
  {
    id: 1006,
    date: "2023-04-13",
    customer: null,
    amount: 750.0,
  },
  {
    id: 1007,
    date: "2023-04-12",
    customer: "Ananya Desai",
    amount: 3200.0,
  },
]
