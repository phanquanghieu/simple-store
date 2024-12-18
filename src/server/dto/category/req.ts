import { zod } from '~/shared/libs/zod'

export const CreateCategorySchema = zod.object({
  parentId: zod.string().nullable(),
  name: zod.string().trim().min(1).max(256),
  description: zod.string().trim(),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()
