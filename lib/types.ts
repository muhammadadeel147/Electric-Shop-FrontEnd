export interface Product {
  id: number
  name: string
  categoryId: number
  subCategoryId: number
  brand: string
  variant: string
  stock: number
  threshold: number
  costPrice: number
  sellingPrice: number
  description?: string
  imageUrl?: string
}

export interface Category {
  id: number
  name: string
  description: string
  subCategories: SubCategory[]
}

export interface SubCategory {
  id: number
  name: string
  description: string
  parentId: number
  brands: Brand[]
}

export interface Brand {
  id: number
  name: string
  description: string
  subCategoryId: number
  variants: Variant[]
}

export interface Variant {
  id: number
  name: string
  description: string
  brandId: number
}

export interface Sale {
  id: number
  date: string
  customer: string | null
  paymentMethod: "Cash" | "Digital"
  amount: number
  profit: number
  items: SaleItem[]
}

export interface SaleItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  discount: number
  total: number
}

export interface Receipt {
  id: number
  number: string
  date: string
  time: string
  customer: string | null
  paymentMethod: string
  items: {
    id: number
    name: string
    quantity: number
    price: number
    discount: number
    total: number
  }[]
  subtotal: number
  discount: number
  total: number
}
