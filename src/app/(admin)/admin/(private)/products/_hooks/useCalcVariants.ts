import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

import { isEmpty, xorBy } from 'lodash'

import { filterBy, sortByKeys } from '~/shared/libs'

import { TCUProductFormValue } from '../_schema'

export function useCalcVariants() {
  const { setValue, getValues } = useFormContext<TCUProductFormValue>()

  const calcVariants = useCallback(() => {
    const values = getValues()

    const variantAttributes = sortByKeys(
      filterBy(values.attributes, values.variantAttributes, 'id'),
      values.variantAttributes.map((x) => x.id),
    ).filter((variantAttribute) => !isEmpty(variantAttribute.selectedOptionIds))

    const newVariants: TCUProductFormValue['variants'] =
      calcVariantsFormVariantAttributes(variantAttributes, {
        sku: '',
        price: values.price,
        compareAtPrice: values.compareAtPrice,
        cost: values.cost,
        attributeOptions: [],
        isNew: true,
        isDeleted: false,
      })

    setValue('variants', mergeVariants(values.variants, newVariants))
  }, [getValues, setValue])

  return { calcVariants }
}

const calcVariantsFormVariantAttributes = (
  variantAttributes: TCUProductFormValue['attributes'],
  defaultVariant: TCUProductFormValue['variants'][number],
  variantAttributeIndex = 0,
): TCUProductFormValue['variants'] => {
  const variantAttribute = variantAttributes[variantAttributeIndex]

  if (!variantAttribute) {
    if (variantAttributeIndex === 0) {
      return []
    } else {
      return [defaultVariant]
    }
  } else {
    return variantAttribute.selectedOptionIds.flatMap((selectedOptionId) => {
      const selectedOption = variantAttribute.options.find(
        (o) => o.id === selectedOptionId,
      )!

      const nextVariants = calcVariantsFormVariantAttributes(
        variantAttributes,
        defaultVariant,
        variantAttributeIndex + 1,
      )

      return nextVariants.map((nextVariant) => ({
        ...nextVariant,
        attributeOptions: [selectedOption, ...nextVariant.attributeOptions],
      }))
    })
  }
}

const mergeVariants = (
  oldVariants: TCUProductFormValue['variants'],
  newVariants: TCUProductFormValue['variants'],
) => {
  const baseVariants = oldVariants
    .filter((oldVariant) => oldVariant.id)
    .map((variant) => ({ ...variant, isNew: false, isDeleted: false }))

  const variantDeletes: TCUProductFormValue['variants'] = baseVariants
    .filter(
      (oldVariant) =>
        !newVariants.some((newVariant) =>
          isSameVariant(oldVariant, newVariant),
        ),
    )
    .map((variant) => ({ ...variant, isDeleted: true }))

  const variants: TCUProductFormValue['variants'] = newVariants.map(
    (newVariant) => {
      const baseVariant = baseVariants.find((baseVariant) =>
        isSameVariant(baseVariant, newVariant),
      )
      if (baseVariant) {
        return {
          ...baseVariant,
          attributeOptions: newVariant.attributeOptions,
        }
      } else {
        return newVariant
      }
    },
  )

  variants.push(...variantDeletes)

  return variants
}

const isSameVariant = (
  variant1: TCUProductFormValue['variants'][number],
  variant2: TCUProductFormValue['variants'][number],
) => isEmpty(xorBy(variant1.attributeOptions, variant2.attributeOptions, 'id'))
