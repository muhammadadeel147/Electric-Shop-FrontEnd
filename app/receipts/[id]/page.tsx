import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"

export default function ReceiptPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the receipt data based on the ID
  const receiptId = params.id

  // Mock receipt data
  const receipt = {
    id: receiptId,
    number: `RCP-${receiptId.padStart(4, "0")}`,
    date: "April 15, 2023",
    time: "14:30:25",
    customer: "Rahul Sharma",
    paymentMethod: "Cash",
    items: [
      {
        id: 1,
        name: "LED Bulb 9W",
        quantity: 5,
        price: 180,
        discount: 0,
        total: 900,
      },
      {
        id: 2,
        name: "Extension Cord",
        quantity: 1,
        price: 350,
        discount: 0,
        total: 350,
      },
    ],
    subtotal: 1250,
    discount: 0,
    total: 1250,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/receipts">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Receipt #{receipt.number}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">ElectroInventory</CardTitle>
          <CardDescription>123 Main Street, Electrical Market, City - 110001</CardDescription>
          <CardDescription>Phone: +91 98765 43210</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Receipt Number:</p>
              <p className="font-medium">{receipt.number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date & Time:</p>
              <p className="font-medium">
                {receipt.date} at {receipt.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer:</p>
              <p className="font-medium">{receipt.customer}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Payment Method:</p>
              <p className="font-medium">{receipt.paymentMethod}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{item.discount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col items-end">
            <div className="flex justify-between w-48 mb-1">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>₹{receipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-48 mb-1">
              <span className="text-muted-foreground">Discount:</span>
              <span>₹{receipt.discount.toFixed(2)}</span>
            </div>
            <Separator className="my-2 w-48" />
            <div className="flex justify-between w-48 font-bold">
              <span>Total:</span>
              <span>₹{receipt.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col border-t pt-6">
          <p className="text-center text-sm text-muted-foreground mb-2">Thank you for your business!</p>
          <p className="text-center text-xs text-muted-foreground">
            This is a computer-generated receipt and does not require a signature.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
