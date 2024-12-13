import { zod } from '~/shared/libs/zod'

export const CreateProductBodySchema = zod.object({
  name: zod.string().trim().min(1),
  price: zod.number().positive(),
  salePrice: zod.number().positive(),
})
