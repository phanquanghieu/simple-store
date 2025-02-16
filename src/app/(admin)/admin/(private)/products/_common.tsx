import { E_PRODUCT_STATUS } from '@prisma/client'

import { IOption } from '~/app/_interfaces/common.interface'

export const STATUS_OPTIONS: IOption<TMessageKey, E_PRODUCT_STATUS>[] = [
  {
    label: 'Admin.Product.Status.DRAFT',
    value: E_PRODUCT_STATUS.DRAFT,
  },
  {
    label: 'Admin.Product.Status.ACTIVE',
    value: E_PRODUCT_STATUS.ACTIVE,
  },
  {
    label: 'Admin.Product.Status.ARCHIVED',
    value: E_PRODUCT_STATUS.ARCHIVED,
  },
]
