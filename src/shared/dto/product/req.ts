import { E_PRODUCT_STATUS } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetProductQuery extends IListQuery {
  status?: E_PRODUCT_STATUS[]
  totalVariants?: number
}

export enum E_BULK_PRODUCT_TYPE {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVE = 'ARCHIVE',
  DELETE = 'DELETE',
}
export interface IBulkProductBody {
  ids: string[]
  type: E_BULK_PRODUCT_TYPE
}
