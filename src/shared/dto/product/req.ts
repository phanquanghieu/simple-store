import { E_PRODUCT_STATUS } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IProductQuery extends Partial<IListQuery> {
  status?: E_PRODUCT_STATUS
}
