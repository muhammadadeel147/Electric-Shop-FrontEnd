"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, ImageIcon } from "lucide-react"

export function AddACPartButton() {
  const [open, setOpen] = useState(false)
  const [partType, setPartType] = useState<string>("")
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [compatibleWith, setCompatibleWith] = useState("")
  const [stock, setStock] = useState("10")
  const [threshold, setThreshold] = useState("5")
  const [price, setPrice] = useState("1000.00")
  const [weight, setWeight] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add AC Part
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New AC Part</DialogTitle>
            <DialogDescription>Enter the details of the new AC part to add to your inventory.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Part Details</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partType">Part Type</Label>
                  <Select value={partType} onValueChange={setPartType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select part type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gas">Gas/Refrigerant</SelectItem>
                      <SelectItem value="Compressor">Compressor</SelectItem>
                      <SelectItem value="Capacitor">Capacitor</SelectItem>
                      <SelectItem value="PCB">PCB/Control Board</SelectItem>
                      <SelectItem value="Fan Motor">Fan Motor</SelectItem>
                      <SelectItem value="Pipe">Copper Pipe</SelectItem>
                      <SelectItem value="Valve">Valve</SelectItem>
                      <SelectItem value="Filter">Filter</SelectItem>
                      <SelectItem value="Tool">Service Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daikin">Daikin</SelectItem>
                      <SelectItem value="Voltas">Voltas</SelectItem>
                      <SelectItem value="Blue Star">Blue Star</SelectItem>
                      <SelectItem value="Carrier">Carrier</SelectItem>
                      <SelectItem value="Honeywell">Honeywell</SelectItem>
                      <SelectItem value="Dupont">Dupont</SelectItem>
                      <SelectItem value="Tecumseh">Tecumseh</SelectItem>
                      <SelectItem value="Havells">Havells</SelectItem>
                      <SelectItem value="Danfoss">Danfoss</SelectItem>
                      <SelectItem value="Generic">Generic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Part Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., R-410A Refrigerant, 1.5 Ton Compressor"
                  required
                />
              </div>

              {partType === "Gas" && (
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight/Volume</Label>
                  <Input
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 2kg Cylinder, 5kg Cylinder"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="compatibleWith">Compatible With</Label>
                <Input
                  id="compatibleWith"
                  value={compatibleWith}
                  onChange={(e) => setCompatibleWith(e.target.value)}
                  placeholder="e.g., Split ACs, Window ACs, 1.5 Ton Models"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="1"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1000.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the part..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="border-none shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={name}
                            className="max-w-full max-h-full object-contain rounded-md"
                          />
                        ) : (
                          <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-bold">{name || "AC Part Name"}</h3>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {partType && (
                          <Badge variant="outline" className="bg-primary/10">
                            {partType}
                          </Badge>
                        )}
                        {brand && (
                          <Badge variant="outline" className="bg-primary/10">
                            {brand}
                          </Badge>
                        )}
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Compatible With:</p>
                          <p className="font-medium">{compatibleWith || "Not specified"}</p>
                        </div>
                        {partType === "Gas" && (
                          <div>
                            <p className="text-sm text-muted-foreground">Weight/Volume:</p>
                            <p className="font-medium">{weight || "Not specified"}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Stock:</p>
                          <p className="font-medium">{stock || "0"} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price:</p>
                          <p className="font-medium">₹{price || "0.00"}</p>
                        </div>
                      </div>

                      {description && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <p className="text-sm text-muted-foreground">Description:</p>
                            <p className="text-sm mt-1">{description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button type="submit">Add AC Part</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
