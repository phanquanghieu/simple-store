'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuPlus } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { E_PRODUCT_STATUS } from '@prisma/client'
import { isEmpty } from 'lodash'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useCreateProduct } from '~/app/_apis/admin/product/useCreateProduct'

import {
  FFBrand,
  FFCurrency,
  FFInput,
  FFRichText,
  FFSelect2,
  Form,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { STATUS_OPTIONS } from '../_common'
import { FFCategoryAttribute } from '../_components/ff-category-attribute'
import { FFSlug } from '../_components/ff-slug'
import { FFVariantAttribute } from '../_components/ff-variant-attribute'

const CreateProductFormSchema = zod.object({
  brandId: zod.string().nullable(),
  categoryId: zod.string().nullable(),
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  slug: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
  price: zod.string({ message: E_ZOD_ERROR_CODE.REQUIRED }),
  compareAtPrice: zod.string().nullable(),
  status: zod.enum([E_PRODUCT_STATUS.ACTIVE, E_PRODUCT_STATUS.DRAFT]),
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
  hasVariants: zod.boolean(),
  variantAttributes: zod.array(
    zod.object({
      id: zod.string(),
    }),
  ),
})

type TCreateProductFormValue = z.infer<typeof CreateProductFormSchema>
const defaultValues: TCreateProductFormValue = {
  brandId: null,
  categoryId: null,
  name: '',
  slug: '',
  description: '',
  price: '0',
  compareAtPrice: null,
  status: E_PRODUCT_STATUS.ACTIVE,
  attributes: [],
  hasVariants: false,
  variantAttributes: [],
}

export default function Page() {
  const { mutate: mutateCreate, isPending } = useCreateProduct()

  const form = useForm<TCreateProductFormValue>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const handleCreate = (values: TCreateProductFormValue) => {
    console.log(values)
    mutateCreate(
      {
        brandId: values.brandId,
        categoryId: values.categoryId,
        name: values.name,
        slug: values.slug,
        description: values.description,
        price: values.price,
        compareAtPrice: values.compareAtPrice,
        status: values.status,
        attributes: values.attributes
          .filter((attribute) => !isEmpty(attribute.selectedOptionIds))
          .map((attribute) => ({
            id: attribute.id,
            selectedOptionIds: attribute.selectedOptionIds,
          })),
      },
      {
        onSuccess: () => {
          router.push('/admin/products')
        },
      },
    )
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/products'
        title={t('Admin.Product.createProduct')}
      >
        <Button
          disabled={isPending}
          form={formId}
          size={'sm-icon'}
          type='submit'
        >
          <LuPlus />
          {t('Common.create')}
        </Button>
      </PageHeader>

      <Container>
        <Form
          onSubmit={form.handleSubmit(handleCreate)}
          form={form}
          id={formId}
        >
          <Grid grid={3}>
            <Col col={2}>
              <Grid>
                <CardS>
                  <Grid className='gap-3'>
                    <FFInput label={'Admin.Product.name'} name='name' />
                    <FFSlug />
                    <FFRichText
                      label={'Admin.Product.description'}
                      name='description'
                    />
                  </Grid>
                </CardS>
                <CardS title={t('Admin.Product.price')}>
                  <Grid grid={2}>
                    <FFCurrency label={'Admin.Product.price'} name='price' />
                    <FFCurrency
                      label={'Admin.Product.compareAtPrice'}
                      name='compareAtPrice'
                    />
                  </Grid>
                </CardS>
                <CardS title={t('Admin.Product.categoryAndAttributes')}>
                  <FFCategoryAttribute />
                </CardS>
                <CardS title={t('Admin.Product.variants')}>
                  <FFVariantAttribute />
                </CardS>
              </Grid>
            </Col>

            <Col>
              <Grid>
                <CardS title={t('Admin.Product.status')}>
                  <FFSelect2
                    isOptionLabelMessageKey
                    name='status'
                    options={STATUS_OPTIONS.filter(
                      (option) => option.value !== E_PRODUCT_STATUS.ARCHIVED,
                    )}
                  />
                </CardS>
                <CardS title={t('Admin.Product.productOrganization')}>
                  <Grid className='gap-3'>
                    <FFBrand label={'Admin.Brand.brand'} name='brandId' />
                  </Grid>
                </CardS>
              </Grid>
            </Col>
          </Grid>
        </Form>
      </Container>
    </>
  )
}
