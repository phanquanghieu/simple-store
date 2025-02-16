import { useTranslations } from 'next-intl'
import { useFieldArray, useWatch } from 'react-hook-form'
import { LuX } from 'react-icons/lu'

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

import { FFCurrency, FFInput } from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { TCUProductFormValue } from '../_schema'
import { calcMargin, calcProfit } from '../_util'

export function FFVariant() {
  const watchVariants = useWatch<TCUProductFormValue, 'variants'>({
    name: 'variants',
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

  const t = useTranslations()
  return (
    <div className='mt-4 flex items-center justify-between'>
      <div>
        {t('Admin.Product.countVariants', {
          count: variants.filter((variant) => !variant.isDeleted).length,
        })}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button size={'sm'} variant='outline'>
            {t('Admin.Product.editVariant')}
          </Button>
        </SheetTrigger>
        <SheetContent
          onInteractOutside={(e) => e.preventDefault()}
          className='overflow-auto bg-background2 md:w-[calc(100%-16rem)]'
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
                      value={calcProfit(variant.cost, variant.price)}
                    />
                  </div>
                  <div className='w-24 flex-none'>
                    <Input
                      disabled={variant.isDeleted}
                      icon={<div className='flex w-4 justify-center'>%</div>}
                      readOnly
                      value={calcMargin(variant.cost, variant.price)}
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
