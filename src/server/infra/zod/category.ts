import * as z from "zod"
import { CompleteProduct, RelatedProductSchema } from "./index"

export const CategorySchema = z.object({
  id: z.string(),
  pathIds: z.string().array(),
  parentId: z.string().nullish(),
  name: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export interface CompleteCategory extends z.infer<typeof CategorySchema> {
  parent?: CompleteCategory | null
  children: CompleteCategory[]
  product: CompleteProduct[]
}

/**
 * RelatedCategorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategorySchema: z.ZodSchema<CompleteCategory> = z.lazy(() => CategorySchema.extend({
  parent: RelatedCategorySchema.nullish(),
  children: RelatedCategorySchema.array(),
  product: RelatedProductSchema.array(),
}))
