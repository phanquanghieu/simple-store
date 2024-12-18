import * as z from "zod"
import { CompleteCategory, RelatedCategorySchema, CompleteBrand, RelatedBrandSchema } from "./index"

export const ProductSchema = z.object({
  id: z.string(),
  categoryId: z.string().nullish(),
  brandId: z.string().nullish(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int(),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export interface CompleteProduct extends z.infer<typeof ProductSchema> {
  category?: CompleteCategory | null
  brand?: CompleteBrand | null
}

/**
 * RelatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductSchema: z.ZodSchema<CompleteProduct> = z.lazy(() => ProductSchema.extend({
  category: RelatedCategorySchema.nullish(),
  brand: RelatedBrandSchema.nullish(),
}))
