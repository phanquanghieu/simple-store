import { Prisma } from '@prisma/client'
import { compact } from 'lodash'

import { IAttributeOptionRes } from '../attribute-option/res'

type IProductVariantResParam = Prisma.ProductVariantGetPayload<{
  include: {
    variantAttributeOption1: true
    variantAttributeOption2: true
    variantAttributeOption3: true
  }
}>
export class IProductVariantRes {
  id: string
  attributeOptions: IAttributeOptionRes[]
  sku: string | null
  price: string
  compareAtPrice: string | null
  cost: string | null
  updatedAt: string
  createdAt: string

  constructor(data: IProductVariantResParam) {
    this.id = data.id
    this.attributeOptions = IAttributeOptionRes.list(
      compact([
        data.variantAttributeOption1,
        data.variantAttributeOption2,
        data.variantAttributeOption3,
      ]),
    )
    this.sku = data.sku
    this.price = data.price.toString()
    this.compareAtPrice = data.compareAtPrice && data.compareAtPrice.toString()
    this.cost = data.cost && data.cost.toString()
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: IProductVariantResParam[]) {
    return data.map((d) => new IProductVariantRes(d))
  }
}
