import { E_PRODUCT_STATUS } from '@prisma/client'

export interface IProductRes {
  id: string
  categoryId: string | null
  brandId: string | null
  variantAttribute1Id: string | null
  variantAttribute2Id: string | null
  variantAttribute3Id: string | null
  name: string
  slug: string
  description: string
  price: string
  compareAtPrice: string | null
  totalVariants: number
  status: E_PRODUCT_STATUS
  updatedAt: string
  createdAt: string
}
