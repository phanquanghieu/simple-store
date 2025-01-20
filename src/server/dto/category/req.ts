import { E_BULK_CATEGORY_TYPE } from '~/shared/dto/category/req'
import { zod } from '~/shared/libs'

export const CreateCategoryBodySchema = zod.object({
  parentId: zod.string().uuid().nullable(),
  attributeIds: zod.array(zod.string().uuid()),
  name: zod.string().trim().min(1).max(256),
  description: zod.string().trim(),
})

export const UpdateCategoryBodySchema = CreateCategoryBodySchema.partial()

export const BulkCategoryBodySchema = zod.object({
  ids: zod.array(zod.string().uuid()).min(1),
  type: zod.nativeEnum(E_BULK_CATEGORY_TYPE),
})
