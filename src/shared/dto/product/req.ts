import { E_PRODUCT_STATUS } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetProductQuery extends IListQuery {
  status?: E_PRODUCT_STATUS[]
  totalVariants?: number
}
