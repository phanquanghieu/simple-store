import { E_BULK_BRAND_TYPE } from '~/shared/dto/brand/req'
import { zod } from '~/shared/libs'

export const CreateBrandSchema = zod.object({
  name: zod.string().trim().min(1).max(256),
  description: zod.string().trim().max(5000),
})

export const UpdateBrandSchema = CreateBrandSchema.partial()

export const BulkBrandBodySchema = zod.object({
  ids: zod.array(zod.string().uuid()).min(1),
  type: zod.nativeEnum(E_BULK_BRAND_TYPE),
})
