import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, FileEdit, Trash2, Filter, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddACPartButton } from "@/components/add-ac-part-button"

export default function ACPartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AC Parts Management</h1>
        <AddACPartButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AC Parts Inventory</CardTitle>
          <CardDescription>Manage your inventory of AC parts, gas, and maintenance components.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search AC parts..." className="pl-8 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Gas</DropdownMenuItem>
                  <DropdownMenuItem>Compressors</DropdownMenuItem>
                  <DropdownMenuItem>Capacitors</DropdownMenuItem>
                  <DropdownMenuItem>Filters</DropdownMenuItem>
                  <DropdownMenuItem>Valves</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Brand</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Daikin</DropdownMenuItem>
                  <DropdownMenuItem>Voltas</DropdownMenuItem>
                  <DropdownMenuItem>Blue Star</DropdownMenuItem>
                  <DropdownMenuItem>Carrier</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-2">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Parts</TabsTrigger>
              <TabsTrigger value="gas">Gas</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Compatible With</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10">
                            {part.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{part.compatibleWith}</TableCell>
                        <TableCell>{part.brand}</TableCell>
                        <TableCell className="text-right">
                          <StockBadge stock={part.stock} threshold={part.threshold} />
                        </TableCell>
                        <TableCell className="text-right">₹{part.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="gas">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gas Type</TableHead>
                      <TableHead>Weight/Volume</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acParts
                      .filter((part) => part.type === "Gas")
                      .map((part) => (
                        <TableRow key={part.id}>
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell>{part.weight}</TableCell>
                          <TableCell>{part.brand}</TableCell>
                          <TableCell className="text-right">
                            <StockBadge stock={part.stock} threshold={part.threshold} />
                          </TableCell>
                          <TableCell className="text-right">₹{part.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="components">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Compatible With</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acParts
                      .filter((part) => ["Compressor", "Capacitor", "PCB", "Fan Motor", "Valve"].includes(part.type))
                      .map((part) => (
                        <TableRow key={part.id}>
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell>{part.compatibleWith}</TableCell>
                          <TableCell>{part.brand}</TableCell>
                          <TableCell className="text-right">
                            <StockBadge stock={part.stock} threshold={part.threshold} />
                          </TableCell>
                          <TableCell className="text-right">₹{part.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="tools">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acParts
                      .filter((part) => part.type === "Tool")
                      .map((part) => (
                        <TableRow key={part.id}>
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell>{part.purpose}</TableCell>
                          <TableCell>{part.brand}</TableCell>
                          <TableCell className="text-right">
                            <StockBadge stock={part.stock} threshold={part.threshold} />
                          </TableCell>
                          <TableCell className="text-right">₹{part.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AC Service Records</CardTitle>
          <CardDescription>Track AC service and repair jobs that used parts from your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Services</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Service Record
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>AC Type</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Parts Used</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.customer}</TableCell>
                    <TableCell>{record.acType}</TableCell>
                    <TableCell>{record.serviceType}</TableCell>
                    <TableCell>{record.partsUsed.join(", ")}</TableCell>
                    <TableCell className="text-right">₹{record.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
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

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock <= 0) {
    return <Badge variant="destructive">Out of Stock</Badge>
  } else if (stock < threshold) {
    return <Badge variant="warning">Low Stock ({stock})</Badge>
  } else {
    return <Badge variant="outline">{stock}</Badge>
  }
}

const acParts = [
  {
    id: 1,
    name: "R-410A Refrigerant",
    type: "Gas",
    weight: "2kg Cylinder",
    brand: "Honeywell",
    compatibleWith: "Split & Window ACs",
    stock: 15,
    threshold: 5,
    price: 3500,
    description: "Environmentally friendly refrigerant for modern AC units",
  },
  {
    id: 2,
    name: "R-22 Refrigerant",
    type: "Gas",
    weight: "5kg Cylinder",
    brand: "Dupont",
    compatibleWith: "Older AC Models",
    stock: 8,
    threshold: 5,
    price: 4200,
    description: "Traditional refrigerant for older AC systems",
  },
  {
    id: 3,
    name: "R-32 Refrigerant",
    type: "Gas",
    weight: "3kg Cylinder",
    brand: "Daikin",
    compatibleWith: "Inverter ACs",
    stock: 12,
    threshold: 4,
    price: 3800,
    description: "Low GWP refrigerant for modern inverter air conditioners",
  },
  {
    id: 4,
    name: "1.5 Ton Rotary Compressor",
    type: "Compressor",
    brand: "Tecumseh",
    compatibleWith: "Split ACs (1.5 Ton)",
    stock: 6,
    threshold: 3,
    price: 5500,
    description: "High-efficiency rotary compressor for 1.5 ton split AC units",
  },
  {
    id: 5,
    name: "AC Capacitor 50+5 μF",
    type: "Capacitor",
    brand: "Havells",
    compatibleWith: "Most Split ACs",
    stock: 25,
    threshold: 10,
    price: 450,
    description: "Dual run capacitor for AC compressor and fan motor",
  },
  {
    id: 6,
    name: "Universal AC PCB",
    type: "PCB",
    brand: "Voltas",
    compatibleWith: "Multiple Brands",
    stock: 4,
    threshold: 2,
    price: 2800,
    description: "Universal replacement PCB compatible with multiple AC brands",
  },
  {
    id: 7,
    name: "Indoor Fan Motor",
    type: "Fan Motor",
    brand: "Blue Star",
    compatibleWith: "1-2 Ton Split ACs",
    stock: 8,
    threshold: 3,
    price: 1200,
    description: "Replacement indoor unit fan motor for split AC systems",
  },
  {
    id: 8,
    name: 'Copper Pipe 1/4"',
    type: "Pipe",
    brand: "Generic",
    compatibleWith: "All Split ACs",
    stock: 50,
    threshold: 20,
    price: 120,
    description: "1/4 inch copper pipe for refrigerant lines (price per foot)",
  },
  {
    id: 9,
    name: "Expansion Valve",
    type: "Valve",
    brand: "Danfoss",
    compatibleWith: "Multiple Brands",
    stock: 10,
    threshold: 5,
    price: 850,
    description: "Thermostatic expansion valve for refrigerant control",
  },
  {
    id: 10,
    name: "Digital Manifold Gauge",
    type: "Tool",
    brand: "Yellow Jacket",
    purpose: "Pressure Testing",
    stock: 3,
    threshold: 1,
    price: 12000,
    description: "Digital manifold gauge set for AC pressure testing and charging",
  },
]

const serviceRecords = [
  {
    id: 1,
    date: "2023-04-15",
    customer: "Rahul Sharma",
    acType: "Voltas 1.5 Ton Split AC",
    serviceType: "Gas Refill",
    partsUsed: ["R-410A Refrigerant"],
    totalAmount: 4500,
  },
  {
    id: 2,
    date: "2023-04-14",
    customer: "Priya Patel",
    acType: "Daikin 2 Ton Inverter AC",
    serviceType: "Compressor Replacement",
    partsUsed: ["Rotary Compressor", "Copper Pipe", "R-32 Refrigerant"],
    totalAmount: 8700,
  },
  {
    id: 3,
    date: "2023-04-13",
    customer: "Amit Kumar",
    acType: "Blue Star 1 Ton Window AC",
    serviceType: "Capacitor Replacement",
    partsUsed: ["AC Capacitor 50+5 μF"],
    totalAmount: 850,
  },
  {
    id: 4,
    date: "2023-04-12",
    customer: "Neha Singh",
    acType: "LG 1.5 Ton Split AC",
    serviceType: "Full Service",
    partsUsed: ["Indoor Fan Motor", "AC Capacitor", "Air Filter"],
    totalAmount: 3200,
  },
]
