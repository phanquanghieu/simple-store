import * as z from "zod"
import { CompleteProduct, RelatedProductSchema } from "./index"

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export interface CompleteBrand extends z.infer<typeof BrandSchema> {
  product: CompleteProduct[]
}

/**
 * RelatedBrandSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBrandSchema: z.ZodSchema<CompleteBrand> = z.lazy(() => BrandSchema.extend({
  product: RelatedProductSchema.array(),
}))
