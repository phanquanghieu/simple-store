import { E_PRODUCT_STATUS } from '@prisma/client'

import { E_BULK_PRODUCT_TYPE } from '~/shared/dto/product/req'
import { zod, zodRegex, zodt } from '~/shared/libs'

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
  categoryId: zod.string().uuid().nullable(),
  brandId: zod.string().uuid().nullable(),
  attributes: zod.array(
    zod.object({
      id: zod.string().uuid(),
      selectedOptionIds: zod.array(zod.string().uuid()).nonempty(),
    }),
  ),
  name: zod.string().trim().min(1).max(256),
  slug: zod.string().trim().regex(zodRegex.KEY).min(1).max(256),
  description: zod.string().trim().max(5000),
  price: zod.string().regex(zodRegex.MONEY),
  compareAtPrice: zod.string().regex(zodRegex.MONEY).nullable(),
  status: zod.enum([E_PRODUCT_STATUS.ACTIVE, E_PRODUCT_STATUS.DRAFT]),
})

export const BulkProductBodySchema = zod.object({
  ids: zod.array(zod.string().uuid()).min(1),
  type: zod.nativeEnum(E_BULK_PRODUCT_TYPE),
})
