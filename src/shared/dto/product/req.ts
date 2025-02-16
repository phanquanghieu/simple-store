import { E_PRODUCT_STATUS } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetProductQuery extends IListQuery {
  status?: E_PRODUCT_STATUS[]
  brandIds?: string[]
}

export interface ICreateProductBody {
  categoryId: string | null
  brandId: string | null
  attributes: { id: string; optionIds: string[] }[]
  variantAttributeIds: string[] | null
  variants:
    | {
        sku: string | null
        price: string
        compareAtPrice: string | null
        cost: string | null
        attributeOptionIds: string[]
      }[]
    | null
  name: string
  slug: string
  sku: string | null
  description: string
  price: string
  compareAtPrice: string | null
  cost: string | null
  status: Extract<E_PRODUCT_STATUS, 'ACTIVE' | 'DRAFT'>
  hasVariants: boolean
}

export interface IUpdateProductBody
  extends Omit<ICreateProductBody, 'variants' | 'status'> {
  variants:
    | {
        id?: string
        sku: string | null
        price: string
        compareAtPrice: string | null
        cost: string | null
        attributeOptionIds: string[]
      }[]
    | null
  status: E_PRODUCT_STATUS
}

export enum E_BULK_PRODUCT_TYPE {
  ACTIVATE = 'ACTIVATE',
  DRAFT = 'DRAFT',
  ARCHIVE = 'ARCHIVE',
  DELETE = 'DELETE',
}
export interface IBulkProductBody {
  ids: string[]
  type: E_BULK_PRODUCT_TYPE
}
