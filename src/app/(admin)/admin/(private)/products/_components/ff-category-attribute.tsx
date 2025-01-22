import { useTranslations } from 'next-intl'
import { useFieldArray, useWatch } from 'react-hook-form'
import { LuArrowDownUp, LuLink, LuPlus, LuX } from 'react-icons/lu'

import { differenceBy, isEmpty } from 'lodash'

import { Button } from '~/app/_components/ui/button'
import { Label } from '~/app/_components/ui/label'
import { Col, Grid } from '~/app/_components/ui/layout'
import { Select2 } from '~/app/_components/ui/select2'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '~/app/_components/ui/sortable'
import { TooltipS } from '~/app/_components/ui/tooltip'

import { useGetAttributesCategory } from '~/app/_apis/admin/category/useGetAttributesCategory'

import { FFCategory } from '../../../_components/form'
import { TCUProductFormValue } from '../_common'

export function FFCategoryAttribute() {
  const categoryId = useWatch<TCUProductFormValue, 'categoryId'>({
    name: 'categoryId',
  })
  const watchAttributes = useWatch<TCUProductFormValue, 'attributes'>({
    name: 'attributes',
  })
  const variantAttributeIds = useWatch<
    TCUProductFormValue,
    'variantAttributes'
  >({ name: 'variantAttributes' }).map((x) => x.id)

  const { data: attributes } = useGetAttributesCategory(categoryId)

  const {
    fields: fieldAttributes,
    append,
    move,
    update,
    remove,
  } = useFieldArray<TCUProductFormValue, 'attributes', '_id'>({
    keyName: '_id',
    name: 'attributes',
  })

  const selectedAttributes = fieldAttributes.map((fieldAttribute, index) => ({
    ...fieldAttribute,
    ...watchAttributes[index],
  }))

  const unselectedAttributes = differenceBy(
    attributes,
    selectedAttributes,
    'id',
  )

  const t = useTranslations()

  return (
    <Grid className='gap-3' grid={2}>
      <Col>
        <FFCategory label={'Admin.Category.category'} name='categoryId' />
      </Col>
      <Col col={2}>
        <Label variant={'form'}>{t('Admin.Product.productAttributes')}</Label>
        <div className='mt-2 flex flex-wrap gap-1.5'>
          {unselectedAttributes?.map((attribute) => (
            <Button
              onClick={() =>
                append({
                  ...attribute,
                  selectedOptionIds: [],
                })
              }
              key={attribute.id}
              size={'xs'}
              variant={'secondary'}
            >
              <LuPlus className='size-4' />
              {attribute.name}
            </Button>
          ))}
        </div>

        {!isEmpty(selectedAttributes) && (
          <Sortable
            onMove={({ activeIndex, overIndex }) =>
              move(activeIndex, overIndex)
            }
            orientation='mixed'
            value={selectedAttributes.map(({ id }) => ({ id }))}
          >
            <Grid className='mt-3 gap-3'>
              {selectedAttributes?.map((attribute, index) => (
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
                        onChange={(_selectedOptionIds) =>
                          update(index, {
                            ...attribute,
                            selectedOptionIds: _selectedOptionIds,
                          })
                        }
                        disabled={variantAttributeIds.includes(attribute.id)}
                        isClearable
                        isMultiSelect
                        isSearchable
                        options={attribute.options.map((option) => ({
                          value: option.id,
                          label: option.name,
                        }))}
                        value={attribute.selectedOptionIds}
                      />
                    </div>
                    <div className='flex-none'>
                      {variantAttributeIds.includes(attribute.id) ? (
                        <TooltipS
                          tooltip={t(
                            'Admin.Product.variantAttributeConnectedMessage',
                          )}
                        >
                          <Button
                            className='cursor-default'
                            size={'icon'}
                            variant={'outline'}
                          >
                            <LuLink />
                          </Button>
                        </TooltipS>
                      ) : (
                        <Button
                          onClick={() => remove(index)}
                          disabled={variantAttributeIds.includes(attribute.id)}
                          size={'icon'}
                          variant={'outline-destructive'}
                        >
                          <LuX />
                        </Button>
                      )}
                    </div>
                  </div>
                </SortableItem>
              ))}
            </Grid>
          </Sortable>
        )}
      </Col>
    </Grid>
  )
}
