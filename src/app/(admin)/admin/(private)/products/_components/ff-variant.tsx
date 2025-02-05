import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { LuX } from 'react-icons/lu'

import { isEmpty, xorBy } from 'lodash'

import { decimal, filterBy, sortByKeys } from '~/shared/libs'

import { Badge } from '~/app/_components/ui/badge'
import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Input } from '~/app/_components/ui/input'
import { Label } from '~/app/_components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '~/app/_components/ui/sheet'

import { useDeepCompareEffect } from '~/app/_hooks'

import { FFCurrency, FFInput } from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { TCUProductFormValue } from '../_common'

export function FFVariant() {
  const { setValue } = useFormContext<TCUProductFormValue>()
  const [watchAttributes, watchVariantAttributes, watchVariants] = useWatch<
    TCUProductFormValue,
    ['attributes', 'variantAttributes', 'variants']
  >({
    name: ['attributes', 'variantAttributes', 'variants'],
  })

  const { fields: fieldVariants, update } = useFieldArray<
    TCUProductFormValue,
    'variants',
    '_id'
  >({
    keyName: '_id',
    name: 'variants',
  })

  const variants = fieldVariants.map((fieldVariant, index) => ({
    ...fieldVariant,
    ...watchVariants[index],
  }))

  const variantAttributes = useMemo(() => {
    return sortByKeys(
      filterBy(watchAttributes, watchVariantAttributes, 'id'),
      watchVariantAttributes.map((x) => x.id),
    )
  }, [watchAttributes, watchVariantAttributes])

  useDeepCompareEffect(() => {
    const newVariants: TCUProductFormValue['variants'] =
      buildVariantsFormVariantAttributes(variantAttributes)

    setValue('variants', mergeVariants(variants, newVariants))
  }, [variantAttributes])

  const t = useTranslations()
  return (
    <div className='mt-4 flex items-center justify-between'>
      <div>{t('Admin.Product.countVariants', { count: variants.length })}</div>

      <Sheet>
        <SheetTrigger asChild>
          <Button size={'sm'} variant='outline'>
            {t('Admin.Product.editVariant')}
          </Button>
        </SheetTrigger>
        <SheetContent
          onInteractOutside={(e) => e.preventDefault()}
          className='bg-background2 md:w-5/6'
          side={'right'}
        >
          <PageHeader
            className='mb-4'
            title={t('Admin.Product.productVariants')}
          >
            <SheetClose asChild>
              <Button size={'sm'} variant={'outline'}>
                {t('Common.close')}
              </Button>
            </SheetClose>
          </PageHeader>
          <CardS className='pl-5'>
            <div className='w-full overflow-x-auto'>
              <div className='flex h-8 items-center gap-3'>
                <div className='w-9 flex-none'></div>
                <div className='w-8 flex-none'></div>
                <div className='w-64 flex-none'>
                  <Label variant={'form'}>{t('Admin.Product.variant')}</Label>
                </div>
                <div className='w-48 flex-none'>
                  <Label variant={'form'}>{t('Admin.Product.sku')}</Label>
                </div>
                <div className='w-40 flex-none'>
                  <Label variant={'form'}>{t('Admin.Product.price')}</Label>
                </div>
                <div className='w-40 flex-none'>
                  <Label variant={'form'}>
                    {t('Admin.Product.compareAtPrice')}
                  </Label>
                </div>
                <div className='w-40 flex-none'>
                  <Label variant={'form'}>{t('Admin.Product.cost')}</Label>
                </div>
                <div className='w-40 flex-none'>
                  <Label variant={'form'}>{t('Admin.Product.profit')}</Label>
                </div>
                <div className='w-32 flex-none'>
                  <Label variant={'form'}>{t('Admin.Product.margin')}</Label>
                </div>
              </div>
              {variants?.map((variant, index) => (
                <div className='flex h-12 items-center gap-3' key={variant._id}>
                  <div className='w-9 flex-none'>
                    <Button
                      onClick={() =>
                        update(index, {
                          ...variant,
                          isDeleted: !variant.isDeleted,
                        })
                      }
                      size={'icon'}
                      variant={'outline-destructive'}
                    >
                      <LuX />
                    </Button>
                  </div>
                  <div className='w-8 flex-none'>
                    <Badge
                      className='flex h-7 w-8 items-center justify-center'
                      variant={
                        variant.isDeleted
                          ? 'destructive'
                          : variant.isNew
                            ? 'success'
                            : 'secondary'
                      }
                    >
                      {index + 1}
                    </Badge>
                  </div>
                  <div className='w-64 flex-none'>
                    {variant.attributeOptions.map((option) => (
                      <Badge
                        className='mx-1'
                        key={option.id}
                        variant={'secondary'}
                      >
                        {option.name}
                      </Badge>
                    ))}
                  </div>
                  <div className='w-48 flex-none'>
                    <FFInput
                      disabled={variant.isDeleted}
                      name={`variants.${index}.sku`}
                    />
                  </div>
                  <div className='w-40 flex-none'>
                    <FFCurrency
                      disabled={variant.isDeleted}
                      name={`variants.${index}.price`}
                    />
                  </div>
                  <div className='w-40 flex-none'>
                    <FFCurrency
                      disabled={variant.isDeleted}
                      name={`variants.${index}.compareAtPrice`}
                    />
                  </div>
                  <div className='w-40 flex-none'>
                    <FFCurrency
                      disabled={variant.isDeleted}
                      name={`variants.${index}.cost`}
                    />
                  </div>
                  <div className='w-40 flex-none'>
                    <FFCurrency
                      disabled={variant.isDeleted}
                      name={''}
                      readOnly
                      value={
                        variant.cost
                          ? decimal.sub(variant.price, variant.cost)
                          : ''
                      }
                    />
                  </div>
                  <div className='w-24 flex-none'>
                    <Input
                      disabled={variant.isDeleted}
                      icon={<div className='flex w-4 justify-center'>%</div>}
                      readOnly
                      value={
                        variant.cost
                          ? decimal.round(
                              decimal.mul(
                                decimal.div(
                                  decimal.sub(variant.price, variant.cost),
                                  variant.price,
                                ),
                                100,
                              ),
                              2,
                            )
                          : ''
                      }
                      variant={'icon'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardS>
        </SheetContent>
      </Sheet>
    </div>
  )
}

const buildVariantsFormVariantAttributes = (
  variantAttributes: TCUProductFormValue['attributes'],
  variantAttributeIndex = 0,
): TCUProductFormValue['variants'] => {
  const variantAttribute = variantAttributes[variantAttributeIndex]

  if (!variantAttribute) {
    return [
      {
        sku: '',
        price: '0',
        compareAtPrice: null,
        cost: null,
        attributeOptions: [],
        isNew: true,
        isDeleted: false,
      },
    ]
  } else {
    return variantAttribute.selectedOptionIds.flatMap((selectedOptionId) => {
      const selectedOption = variantAttribute.options.find(
        (o) => o.id === selectedOptionId,
      )!

      const nextVariants = buildVariantsFormVariantAttributes(
        variantAttributes,
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
  const variantDeletes: TCUProductFormValue['variants'] = oldVariants
    .filter(
      (oldVariant) =>
        oldVariant.id &&
        !newVariants.some((newVariant) =>
          isSameVariant(oldVariant, newVariant),
        ),
    )
    .map((variant) => ({ ...variant, isDeleted: true }))

  const variants: TCUProductFormValue['variants'] = newVariants.map(
    (newVariant) => {
      const oldVariant = oldVariants.find((oldVariant) =>
        isSameVariant(oldVariant, newVariant),
      )
      if (oldVariant) {
        return {
          ...oldVariant,
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
