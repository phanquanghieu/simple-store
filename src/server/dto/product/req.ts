import { E_PRODUCT_STATUS } from '@prisma/client'

import { E_BULK_PRODUCT_TYPE } from '~/shared/dto/product/req'
import { zod, zodt } from '~/shared/libs/zod'

export const GetProductQuerySchema = zod.object({
  status: zod
    .preprocess(
      zodt.toArray,
      zod.array(zod.nativeEnum(E_PRODUCT_STATUS)).nonempty(),
    )
    .optional(),
  brandIds: zod
    .preprocess(zodt.toArray, zod.array(zod.string().uuid()).nonempty())
    .optional(),
})

export const CreateProductBodySchema = zod.object({
  name: zod.string().trim().min(1),
  price: zod.number().positive(),
  status: zod.enum(['active', 'inactive']),
})

export const BulkProductBodySchema = zod.object({
  ids: zod.array(zod.string().uuid()).min(1),
  type: zod.nativeEnum(E_BULK_PRODUCT_TYPE),
})
