import { E_PRODUCT_STATUS, Product } from '@prisma/client'

export class IProductRes {
  id: string
  categoryId: string | null
  brandId: string | null
  name: string
  slug: string
  description: string
  price: string
  compareAtPrice: string | null
  totalVariants: number
  status: E_PRODUCT_STATUS
  updatedAt: string
  createdAt: string

  constructor(data: Product) {
    this.id = data.id
    this.categoryId = data.categoryId
    this.brandId = data.brandId
    this.name = data.name
    this.slug = data.slug
    this.description = data.description
    this.price = data.price.toString()
    this.compareAtPrice = data.compareAtPrice && data.compareAtPrice.toString()
    this.totalVariants = data.totalVariants
    this.status = data.status
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: Product[]) {
    return data.map((d) => new IProductRes(d))
  }
}
