import { max, min } from 'lodash'
import { ZodSchema, z } from 'zod'

import { IPaginationQuery } from '../interfaces/api/request'

// z.defaultErrorMap(() => {})
const PaginationQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  size: z.coerce
    .number()
    .positive()
    .transform((size) => min([size, 100]))
    .default(10),
})

type t = z.infer<typeof PaginationQuerySchema>
const a = PaginationQuerySchema.safeParse({
  page: '1',
  size: '10',
})

export * from 'zod'
