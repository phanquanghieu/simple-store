import { E_PRODUCT_STATUS } from '@prisma/client'

import { zod, zodt } from '~/shared/libs/zod'

export const GetProductQuerySchema = zod.object({
  status: zod
    .preprocess(zodt.toArray, zod.nativeEnum(E_PRODUCT_STATUS).array())
    .optional(),
  totalVariants: zod.coerce.number().min(0).optional(),
})

export const CreateProductBodySchema = zod.object({
  name: zod.string().trim().min(1),
  price: zod.number().positive(),
  status: zod.enum(['active', 'inactive']),
})
