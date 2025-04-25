export interface Product {
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

export interface Variant {
  id: number
  name: string
  description: string
  brandId: number
}

export interface Brand {
  id: number
  name: string
  description: string
  subCategoryId: number
  variants: Variant[]
}

export interface SubCategory {
  id: number
  name: string
  description: string
  parentId: number
  brands: Brand[]
}

export interface Category {
  id: number
  name: string
  description: string
  subCategories: SubCategory[]
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Lighting",
    description: "Bulbs, tube lights, and other lighting products",
    subCategories: [
      {
        id: 1,
        name: "Bulbs",
        description: "All types of bulbs",
        parentId: 1,
        brands: [
          {
            id: 1,
            name: "Osaka",
            description: "Osaka brand bulbs",
            subCategoryId: 1,
            variants: [
              { id: 1, name: "4 Watt", description: "4W LED Bulb", brandId: 1 },
              { id: 2, name: "10 Watt", description: "10W LED Bulb", brandId: 1 },
              { id: 3, name: "18 Watt", description: "18W LED Bulb", brandId: 1 },
              { id: 4, name: "20 Watt", description: "20W LED Bulb", brandId: 1 },
            ],
          },
          {
            id: 2,
            name: "Phinix",
            description: "Phinix brand bulbs",
            subCategoryId: 1,
            variants: [
              { id: 5, name: "9 Watt", description: "9W LED Bulb", brandId: 2 },
              { id: 6, name: "12 Watt", description: "12W LED Bulb", brandId: 2 },
            ],
          },
          {
            id: 3,
            name: "Phipro",
            description: "Phipro brand bulbs",
            subCategoryId: 1,
            variants: [
              { id: 7, name: "15 Watt", description: "15W LED Bulb", brandId: 3 },
              { id: 8, name: "22 Watt", description: "22W LED Bulb", brandId: 3 },
            ],
          },
          {
            id: 4,
            name: "Philix",
            description: "Philix brand bulbs",
            subCategoryId: 1,
            variants: [
              { id: 9, name: "7 Watt", description: "7W LED Bulb", brandId: 4 },
              { id: 10, name: "14 Watt", description: "14W LED Bulb", brandId: 4 },
            ],
          },
          {
            id: 5,
            name: "Hinix",
            description: "Hinix brand bulbs",
            subCategoryId: 1,
            variants: [
              { id: 11, name: "4 Watt", description: "4W LED Bulb", brandId: 5 },
              { id: 12, name: "10 Watt", description: "10W LED Bulb", brandId: 5 },
              { id: 13, name: "15 Watt", description: "15W LED Bulb", brandId: 5 },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Tube Lights",
        description: "All types of tube lights",
        parentId: 1,
        brands: [
          {
            id: 6,
            name: "Osaka",
            description: "Osaka brand tube lights",
            subCategoryId: 2,
            variants: [
              { id: 14, name: "20 Watt", description: "20W LED Tube Light", brandId: 6 },
              { id: 15, name: "40 Watt", description: "40W LED Tube Light", brandId: 6 },
            ],
          },
          {
            id: 7,
            name: "Philips",
            description: "Philips brand tube lights",
            subCategoryId: 2,
            variants: [
              { id: 16, name: "18 Watt", description: "18W LED Tube Light", brandId: 7 },
              { id: 17, name: "36 Watt", description: "36W LED Tube Light", brandId: 7 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Wiring",
    description: "Wires, cables, and related accessories",
    subCategories: [
      {
        id: 3,
        name: "Copper Wires",
        description: "All types of copper wires",
        parentId: 2,
        brands: [
          {
            id: 8,
            name: "Havells",
            description: "Havells brand wires",
            subCategoryId: 3,
            variants: [
              { id: 18, name: "1.5mm", description: "1.5mm Copper Wire", brandId: 8 },
              { id: 19, name: "2.5mm", description: "2.5mm Copper Wire", brandId: 8 },
              { id: 20, name: "4.0mm", description: "4.0mm Copper Wire", brandId: 8 },
            ],
          },
          {
            id: 9,
            name: "Finolex",
            description: "Finolex brand wires",
            subCategoryId: 3,
            variants: [
              { id: 21, name: "1.0mm", description: "1.0mm Copper Wire", brandId: 9 },
              { id: 22, name: "1.5mm", description: "1.5mm Copper Wire", brandId: 9 },
              { id: 23, name: "2.5mm", description: "2.5mm Copper Wire", brandId: 9 },
            ],
          },
        ],
      },
      {
        id: 4,
        name: "Cables",
        description: "All types of cables",
        parentId: 2,
        brands: [
          {
            id: 10,
            name: "Polycab",
            description: "Polycab brand cables",
            subCategoryId: 4,
            variants: [
              { id: 24, name: "3 Core 1.5mm", description: "3 Core 1.5mm Cable", brandId: 10 },
              { id: 25, name: "3 Core 2.5mm", description: "3 Core 2.5mm Cable", brandId: 10 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Fans",
    description: "Ceiling, table, and exhaust fans",
    subCategories: [
      {
        id: 5,
        name: "Ceiling Fans",
        description: "All types of ceiling fans",
        parentId: 3,
        brands: [
          {
            id: 11,
            name: "Usha",
            description: "Usha brand fans",
            subCategoryId: 5,
            variants: [
              { id: 26, name: "3 Blade", description: "3 Blade Ceiling Fan", brandId: 11 },
              { id: 27, name: "4 Blade", description: "4 Blade Ceiling Fan", brandId: 11 },
            ],
          },
          {
            id: 12,
            name: "Orient",
            description: "Orient brand fans",
            subCategoryId: 5,
            variants: [
              { id: 28, name: "Standard", description: "Standard Ceiling Fan", brandId: 12 },
              { id: 29, name: "Premium", description: "Premium Ceiling Fan", brandId: 12 },
            ],
          },
          {
            id: 13,
            name: "Crompton",
            description: "Crompton brand fans",
            subCategoryId: 5,
            variants: [
              { id: 30, name: "High Speed", description: "High Speed Ceiling Fan", brandId: 13 },
              { id: 31, name: "Decorative", description: "Decorative Ceiling Fan", brandId: 13 },
            ],
          },
        ],
      },
      {
        id: 6,
        name: "Table Fans",
        description: "All types of table fans",
        parentId: 3,
        brands: [
          {
            id: 14,
            name: "Havells",
            description: "Havells brand table fans",
            subCategoryId: 6,
            variants: [
              { id: 32, name: "400mm", description: "400mm Table Fan", brandId: 14 },
              { id: 33, name: "300mm", description: "300mm Table Fan", brandId: 14 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "AC Parts",
    description: "Air conditioning parts and components",
    subCategories: [
      {
        id: 7,
        name: "Refrigerants",
        description: "AC gas and refrigerants",
        parentId: 4,
        brands: [
          {
            id: 15,
            name: "Honeywell",
            description: "Honeywell refrigerants",
            subCategoryId: 7,
            variants: [
              { id: 34, name: "R-410A", description: "R-410A Refrigerant", brandId: 15 },
              { id: 35, name: "R-32", description: "R-32 Refrigerant", brandId: 15 },
            ],
          },
          {
            id: 16,
            name: "Dupont",
            description: "Dupont refrigerants",
            subCategoryId: 7,
            variants: [
              { id: 36, name: "R-22", description: "R-22 Refrigerant", brandId: 16 },
              { id: 37, name: "R-134a", description: "R-134a Refrigerant", brandId: 16 },
            ],
          },
        ],
      },
      {
        id: 8,
        name: "Components",
        description: "AC components and spare parts",
        parentId: 4,
        brands: [
          {
            id: 17,
            name: "Tecumseh",
            description: "Tecumseh compressors",
            subCategoryId: 8,
            variants: [
              { id: 38, name: "1.5 Ton Rotary", description: "1.5 Ton Rotary Compressor", brandId: 17 },
              { id: 39, name: "2 Ton Rotary", description: "2 Ton Rotary Compressor", brandId: 17 },
            ],
          },
          {
            id: 18,
            name: "Havells",
            description: "Havells AC components",
            subCategoryId: 8,
            variants: [
              { id: 40, name: "Capacitor 50+5 μF", description: "AC Capacitor 50+5 μF", brandId: 18 },
              { id: 41, name: "Capacitor 35+5 μF", description: "AC Capacitor 35+5 μF", brandId: 18 },
            ],
          },
        ],
      },
    ],
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: "Osaka LED Bulb 10W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Osaka",
    variant: "10 Watt",
    stock: 5,
    threshold: 10,
    costPrice: 120,
    sellingPrice: 180,
    description: "Energy efficient LED bulb with warm white light",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Phinix LED Bulb 9W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Phinix",
    variant: "9 Watt",
    stock: 8,
    threshold: 5,
    costPrice: 110,
    sellingPrice: 160,
    description: "Energy efficient LED bulb with cool white light",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Phipro LED Bulb 15W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Phipro",
    variant: "15 Watt",
    stock: 3,
    threshold: 15,
    costPrice: 150,
    sellingPrice: 220,
    description: "High brightness LED bulb for large rooms",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Philix LED Bulb 7W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Philix",
    variant: "7 Watt",
    stock: 12,
    threshold: 5,
    costPrice: 90,
    sellingPrice: 130,
    description: "Energy saving LED bulb for small areas",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Osaka Tube Light 20W",
    category: "Lighting",
    subCategory: "Tube Lights",
    brand: "Osaka",
    variant: "20 Watt",
    stock: 20,
    threshold: 10,
    costPrice: 250,
    sellingPrice: 320,
    description: "Bright LED tube light for office spaces",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Havells Copper Wire 1.5mm",
    category: "Wiring",
    subCategory: "Copper Wires",
    brand: "Havells",
    variant: "1.5mm",
    stock: 15,
    threshold: 8,
    costPrice: 1200,
    sellingPrice: 1500,
    description: "High quality copper wire for residential wiring (100m)",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 7,
    name: "Usha Ceiling Fan 3 Blade",
    category: "Fans",
    subCategory: "Ceiling Fans",
    brand: "Usha",
    variant: "3 Blade",
    stock: 0,
    threshold: 10,
    costPrice: 1500,
    sellingPrice: 1800,
    description: "Energy efficient 3-blade ceiling fan",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Osaka LED Bulb 4W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Osaka",
    variant: "4 Watt",
    stock: 25,
    threshold: 10,
    costPrice: 80,
    sellingPrice: 120,
    description: "Energy efficient LED bulb for small areas",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 9,
    name: "Hinix LED Bulb 10W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Hinix",
    variant: "10 Watt",
    stock: 18,
    threshold: 8,
    costPrice: 115,
    sellingPrice: 170,
    description: "Bright LED bulb with daylight color",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 10,
    name: "Hinix LED Bulb 4W",
    category: "Lighting",
    subCategory: "Bulbs",
    brand: "Hinix",
    variant: "4 Watt",
    stock: 30,
    threshold: 12,
    costPrice: 75,
    sellingPrice: 110,
    description: "Energy saving LED bulb for small spaces",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 11,
    name: "Philips Tube Light 18W",
    category: "Lighting",
    subCategory: "Tube Lights",
    brand: "Philips",
    variant: "18 Watt",
    stock: 15,
    threshold: 7,
    costPrice: 220,
    sellingPrice: 280,
    description: "Energy efficient tube light for home and office",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 12,
    name: "Finolex Copper Wire 1.5mm",
    category: "Wiring",
    subCategory: "Copper Wires",
    brand: "Finolex",
    variant: "1.5mm",
    stock: 22,
    threshold: 10,
    costPrice: 1150,
    sellingPrice: 1450,
    description: "High quality copper wire for residential wiring (100m)",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 13,
    name: "R-410A Refrigerant",
    category: "AC Parts",
    subCategory: "Refrigerants",
    brand: "Honeywell",
    variant: "R-410A",
    stock: 15,
    threshold: 5,
    costPrice: 3500,
    sellingPrice: 4200,
    description: "Environmentally friendly refrigerant for modern AC units",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
]

// Helper functions to filter products
export function getProductsByCategory(categoryName: string): Product[] {
  if (!categoryName) return products.slice(0, 6) // Return a limited set of products for the overview
  return products.filter((product) => product.category === categoryName)
}

export function getProductsBySubCategory(categoryName: string, subCategoryName: string): Product[] {
  if (!categoryName || !subCategoryName) return []
  return products.filter((product) => product.category === categoryName && product.subCategory === subCategoryName)
}

export function getProductsByBrand(categoryName: string, subCategoryName: string, brandName: string): Product[] {
  if (!categoryName || !subCategoryName || !brandName) return []
  return products.filter(
    (product) =>
      product.category === categoryName && product.subCategory === subCategoryName && product.brand === brandName,
  )
}

export function getProductsByVariant(
  categoryName: string,
  subCategoryName: string,
  brandName: string,
  variantName: string,
): Product[] {
  if (!categoryName || !subCategoryName || !brandName || !variantName) return []
  return products.filter(
    (product) =>
      product.category === categoryName &&
      product.subCategory === subCategoryName &&
      product.brand === brandName &&
      product.variant === variantName,
  )
}
