import { zod } from '~/shared/libs/zod'

export const CreateBrandSchema = zod.object({
  name: zod.string().trim().min(1).max(256),
  description: zod.string().trim(),
})

export const UpdateBrandSchema = CreateBrandSchema.partial()
