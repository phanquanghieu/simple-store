import { E_PRODUCT_STATUS } from '@prisma/client'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs'

export const CUProductFormSchema = zod.object({
  brandId: zod.string().nullable(),
  categoryId: zod.string().nullable(),
  attributes: zod.array(
    zod.object({
      id: zod.string(),
      name: zod.string(),
      key: zod.string(),
      type: zod.string(),
      options: zod.array(
        zod.object({
          id: zod.string(),
          name: zod.string(),
          key: zod.string(),
          value: zod.string().optional(),
        }),
      ),
      selectedOptionIds: zod.array(zod.string()),
    }),
  ),
  variantAttributes: zod.array(
    zod.object({
      id: zod.string(),
    }),
  ),
  variants: zod.array(
    zod.object({
      id: zod.string().optional(),
      sku: zod.string().trim().max(100).nullable(),
      price: zod.string({ message: E_ZOD_ERROR_CODE.REQUIRED }),
      compareAtPrice: zod.string().nullable(),
      cost: zod.string().nullable(),
      attributeOptions: zod.array(
        zod.object({
          id: zod.string(),
          name: zod.string(),
          key: zod.string(),
          value: zod.string().optional(),
        }),
      ),
      isNew: zod.boolean(),
      isDeleted: zod.boolean(),
    }),
  ),
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  slug: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  sku: zod.string().trim().max(100),
  description: zod.string().trim().max(5000),
  price: zod.string({ message: E_ZOD_ERROR_CODE.REQUIRED }),
  compareAtPrice: zod.string().nullable(),
  cost: zod.string().nullable(),
  status: zod.string(),
  hasVariants: zod.boolean(),
})

export type TCUProductFormValue = z.infer<typeof CUProductFormSchema>

export const defaultCUProductFormValue: TCUProductFormValue = {
  brandId: null,
  categoryId: null,
  attributes: [],
  variantAttributes: [],
  variants: [],
  name: '',
  slug: '',
  sku: '',
  description: '',
  price: '0',
  compareAtPrice: null,
  cost: null,
  status: E_PRODUCT_STATUS.ACTIVE,
  hasVariants: false,
}
