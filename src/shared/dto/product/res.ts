import { E_PRODUCT_STATUS, Prisma, Product } from '@prisma/client'
import { compact } from 'lodash'

import { IAttributeLiteWithOptionsRes } from '../attribute/res'
import { IBrandLiteRes } from '../brand/res'
import { ICategoryLiteRes } from '../category/res'
import { IProductVariantRes } from '../product-variant/res'

export enum E_PRODUCT_EXCEPTION {
  SLUG_EXISTED = 'SLUG_EXISTED',
}

export class IProductRes {
  id: string
  categoryId: string | null
  brandId: string | null
  name: string
  slug: string
  sku: string | null
  description: string
  price: string
  compareAtPrice: string | null
  cost: string | null
  totalVariants: number
  hasVariants: boolean
  status: E_PRODUCT_STATUS
  updatedAt: string
  createdAt: string

  constructor(data: Product) {
    this.id = data.id
    this.categoryId = data.categoryId
    this.brandId = data.brandId
    this.name = data.name
    this.slug = data.slug
    this.sku = data.sku
    this.description = data.description
    this.price = data.price.toString()
    this.compareAtPrice = data.compareAtPrice && data.compareAtPrice.toString()
    this.cost = data.cost && data.cost.toString()
    this.totalVariants = data.totalVariants
    this.hasVariants = data.totalVariants <= 1 ? false : true
    this.status = data.status
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: Product[]) {
    return data.map((d) => new IProductRes(d))
  }
}

type IProductDetailResParam = Prisma.ProductGetPayload<{
  include: {
    brand: true
    category: true
    productAttributes: {
      include: {
        attribute: { include: { attributeOptions: true } }
        productAttributeOptions: true
      }
    }
    productVariants: {
      include: {
        variantAttributeOption1: true
        variantAttributeOption2: true
        variantAttributeOption3: true
      }
    }
    variantAttribute1: true
    variantAttribute2: true
    variantAttribute3: true
  }
}>
export class IProductDetailRes extends IProductRes {
  brand: IBrandLiteRes | null
  category: ICategoryLiteRes | null
  attributes: (IAttributeLiteWithOptionsRes & { selectedOptionIds: string[] })[]
  variantAttributeIds: string[]
  variants: IProductVariantRes[]

  constructor(data: IProductDetailResParam) {
    super(data)
    this.brand = data.brand && new IBrandLiteRes(data.brand)
    this.category = data.category && new ICategoryLiteRes(data.category)
    this.attributes = data.productAttributes.map((productAttribute) => ({
      ...new IAttributeLiteWithOptionsRes(productAttribute.attribute),
      selectedOptionIds: productAttribute.productAttributeOptions.map(
        (x) => x.attributeOptionId,
      ),
    }))
    this.variantAttributeIds = compact([
      data.variantAttribute1Id,
      data.variantAttribute2Id,
      data.variantAttribute3Id,
    ])
    this.variants = this.hasVariants
      ? IProductVariantRes.list(data.productVariants)
      : []
  }
}
