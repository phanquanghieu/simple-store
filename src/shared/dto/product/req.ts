import { E_PRODUCT_STATUS } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetProductQuery extends IListQuery {
  status?: E_PRODUCT_STATUS[]
  brandIds?: string[]
}

export interface ICreateProductBody {
  categoryId: string | null
  brandId: string | null
  attributes: { id: string; selectedOptionIds: string[] }[]
  name: string
  slug: string
  description: string
  price: string
  compareAtPrice: string | null
  status: Extract<E_PRODUCT_STATUS, 'ACTIVE' | 'DRAFT'>
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
