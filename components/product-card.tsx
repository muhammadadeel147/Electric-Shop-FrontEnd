import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileEdit, Trash2 } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  subCategory: string
  brand: string
  variant: string
  stock: number
  threshold: number
  costPrice: number
  sellingPrice: number
  description?: string
  imageUrl?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-muted">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="bg-primary/10">
            {product.category}
          </Badge>
          <Badge variant="outline" className="bg-primary/10">
            {product.brand}
          </Badge>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Stock:</p>
            <StockStatus stock={product.stock} threshold={product.threshold} />
          </div>
          <div>
            <p className="text-muted-foreground">Price:</p>
            <p className="font-medium">₹{product.sellingPrice.toFixed(2)}</p>
          </div>
        </div>
        {product.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          <FileEdit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

function StockStatus({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock <= 0) {
    return <p className="font-medium text-destructive">Out of Stock</p>
  } else if (stock < threshold) {
    return <p className="font-medium text-amber-500">Low Stock ({stock})</p>
  } else {
    return <p className="font-medium text-emerald-500">In Stock ({stock})</p>
  }
}
