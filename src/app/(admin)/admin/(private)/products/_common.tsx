import { E_PRODUCT_STATUS } from '@prisma/client'

import { IAttributeOptionRes } from '~/shared/dto/attribute/attribute-option/res'
import { IAttributeLiteWithOptionsRes } from '~/shared/dto/attribute/res'

import { IOption } from '~/app/_interfaces/common.interface'

export const STATUS_OPTIONS: IOption<TMessageKey, E_PRODUCT_STATUS>[] = [
  {
    label: 'Admin.Product.Status.DRAFT',
    value: E_PRODUCT_STATUS.DRAFT,
  },
  {
    label: 'Admin.Product.Status.ACTIVE',
    value: E_PRODUCT_STATUS.ACTIVE,
  },
  {
    label: 'Admin.Product.Status.ARCHIVED',
    value: E_PRODUCT_STATUS.ARCHIVED,
  },
]

export type TCUProductFormValue = {
  name: string
  slug: string
  categoryId: string | null
  attributes: (IAttributeLiteWithOptionsRes & {
    selectedOptionIds: string[]
  })[]
  hasVariants: boolean
  variantAttributes: {
    id: string
  }[]
  variants: {
    id?: string
    sku: string | null
    price: string
    compareAtPrice: string | null
    cost: string | null
    attributeOptions: IAttributeOptionRes[]
    isNew: boolean
    isDeleted: boolean
  }[]
}
