import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { LuArrowDownUp, LuPlus, LuX } from 'react-icons/lu'

import { produce } from 'immer'
import { differenceBy, isEmpty } from 'lodash'

import { filterBy, sortByKeys } from '~/shared/libs'

import { Button } from '~/app/_components/ui/button'
import { Label } from '~/app/_components/ui/label'
import { Col, Grid } from '~/app/_components/ui/layout'
import { Select2 } from '~/app/_components/ui/select2'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '~/app/_components/ui/sortable'

import { FFCheckbox } from '../../../_components/form'
import { TCUProductFormValue } from '../_common'
import { FFVariant } from './ff-variant'

const MAX_VARIANT_ATTRIBUTES = 3

export function FFVariantAttribute() {
  const { setValue } = useFormContext<TCUProductFormValue>()

  const hasVariants = useWatch<TCUProductFormValue, 'hasVariants'>({
    name: 'hasVariants',
  })
  const attributes = useWatch<TCUProductFormValue, 'attributes'>({
    name: 'attributes',
  })

  const {
    fields: variantAttributes,
    append,
    move,
    remove,
  } = useFieldArray<TCUProductFormValue, 'variantAttributes', '_id'>({
    keyName: '_id',
    name: 'variantAttributes',
  })

  const [selectedVariantAttributes, unselectedAttributeOptions] =
    useMemo(() => {
      const selectedVariantAttributes = sortByKeys(
        filterBy(attributes, variantAttributes, 'id'),
        variantAttributes.map((x) => x.id),
      )

      const unselectedVariantAttributeOptions = differenceBy(
        attributes,
        variantAttributes,
        'id',
      ).map((attribute) => ({
        label: attribute.name,
        value: attribute.id,
      }))

      return [
        selectedVariantAttributes,
        unselectedVariantAttributeOptions,
      ] as const
    }, [attributes, variantAttributes])

  const handleSelectVariantAttribute = (value: string | null) => {
    if (!value) return
    if (variantAttributes.some((x) => x.id === value)) return

    append({ id: value })
  }

  const handleChangeOptions = (
    attributeId: string,
    selectedOptionIds: string[],
  ) => {
    setValue(
      'attributes',
      produce(attributes, (_attributes) => {
        const index = _attributes.findIndex((x) => x.id === attributeId)
        _attributes[index].selectedOptionIds = selectedOptionIds
      }),
    )
  }

  const t = useTranslations()
  return (
    <Grid className='gap-3' grid={2}>
      <Col className='my-1'>
        <FFCheckbox label={'Admin.Product.hasVariants'} name='hasVariants' />
      </Col>

      {hasVariants && (
        <Col col={2}>
          <Label variant={'form'}>{t('Admin.Product.variantAttributes')}</Label>

          {!isEmpty(selectedVariantAttributes) && (
            <Sortable
              onMove={({ activeIndex, overIndex }) =>
                move(activeIndex, overIndex)
              }
              value={selectedVariantAttributes.map(({ id }) => ({ id }))}
            >
              <Grid className='mt-2 gap-3'>
                {selectedVariantAttributes?.map((attribute, index) => (
                  <SortableItem asChild key={attribute.id} value={attribute.id}>
                    <div className='flex w-full items-center justify-center gap-3'>
                      <div className='flex-none'>
                        <SortableDragHandle>
                          <LuArrowDownUp />
                        </SortableDragHandle>
                      </div>
                      <div className='w-1/4'>{attribute.name}</div>
                      <div className='flex-1'>
                        <Select2
                          onChange={(selectedOptionIds) =>
                            handleChangeOptions(attribute.id, selectedOptionIds)
                          }
                          isClearable
                          isMultiSelect
                          isSearchable
                          options={attribute.options.map((option) => ({
                            value: option.id,
                            label: option.name,
                          }))}
                          value={attribute.selectedOptionIds}
                          variant='sortable'
                        />
                      </div>
                      <div className='flex-none'>
                        <Button
                          onClick={() => remove(index)}
                          size={'icon'}
                          variant={'outline-destructive'}
                        >
                          <LuX />
                        </Button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </Grid>
            </Sortable>
          )}

          {selectedVariantAttributes.length < MAX_VARIANT_ATTRIBUTES && (
            <div className='mt-3'>
              <Select2
                onChange={handleSelectVariantAttribute}
                disabled={isEmpty(unselectedAttributeOptions)}
                options={unselectedAttributeOptions}
                placeholder={'Admin.Product.addVariantAttribute'}
                triggerIcon={<LuPlus />}
                variant='button'
              />
            </div>
          )}

          <FFVariant />
        </Col>
      )}
    </Grid>
  )
}
