'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuSave, LuTrash } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash'
import { useToggle } from 'usehooks-ts'

import { TIdParam } from '~/shared/dto/_common/req'
import { IUpdateProductBody } from '~/shared/dto/product/req'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useDeleteProduct } from '~/app/_apis/admin/product/useDeleteProduct'
import { useGetDetailProduct } from '~/app/_apis/admin/product/useGetDetailProduct'
import { useUpdateProduct } from '~/app/_apis/admin/product/useUpdateProduct'

import { ConfirmDialog } from '../../../_components/dialogs/confirm-dialog'
import {
  FFBrand,
  FFInput,
  FFRichText,
  FFSelect2,
  Form,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { STATUS_OPTIONS } from '../_common'
import { FFCategoryAttribute } from '../_components/ff-category-attribute'
import { FFPrice } from '../_components/ff-price'
import { FFSlug } from '../_components/ff-slug'
import { FFVariantAttribute } from '../_components/ff-variant-attribute'
import {
  CUProductFormSchema,
  TCUProductFormValue,
  defaultCUProductFormValue,
} from '../_schema'

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data } = useGetDetailProduct(id)

  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateProduct()
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteProduct()

  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false)

  const form = useForm<TCUProductFormValue>({
    resolver: zodResolver(CUProductFormSchema),
    values: data
      ? ({
          brandId: data.product.brandId,
          categoryId: data.product.categoryId,
          attributes: data.product.attributes,
          variantAttributes: data.product.variantAttributeIds.map((id) => ({
            id,
          })),
          variants: data.product.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku ?? '',
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            cost: variant.cost,
            attributeOptions: variant.attributeOptions,
            isNew: false,
            isDeleted: false,
          })),
          name: data.product.name,
          slug: data.product.slug,
          sku: data.product.sku ?? '',
          description: data.product.description,
          price: data.product.price,
          compareAtPrice: data.product.compareAtPrice,
          cost: data.product.cost,
          status: data.product.status,
          hasVariants: data.product.hasVariants,
        } as TCUProductFormValue)
      : defaultCUProductFormValue,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const handleUpdate = (values: TCUProductFormValue) => {
    const hasVariants =
      values.variants.length === 0 ? false : values.hasVariants
    mutateUpdate(
      {
        id: id,
        body: {
          brandId: values.brandId,
          categoryId: values.categoryId,
          attributes: values.attributes
            .filter((attribute) => !isEmpty(attribute.selectedOptionIds))
            .map((attribute) => ({
              id: attribute.id,
              optionIds: attribute.selectedOptionIds,
            })),
          variantAttributeIds: hasVariants
            ? values.variantAttributes.map((x) => x.id)
            : null,
          variants: hasVariants
            ? values.variants
                .filter((variant) => !variant.isDeleted)
                .map((variant) => ({
                  id: variant.id,
                  sku: variant.sku || null,
                  price: variant.price,
                  compareAtPrice: variant.compareAtPrice,
                  cost: variant.cost,
                  attributeOptionIds: variant.attributeOptions.map((x) => x.id),
                }))
            : null,
          name: values.name,
          slug: values.slug,
          sku: values.sku || null,
          description: values.description,
          price: values.price,
          compareAtPrice: values.compareAtPrice,
          cost: values.cost,
          status: values.status as IUpdateProductBody['status'],
          hasVariants,
        },
      },
      {
        onSuccess: () => {
          router.push('/admin/products')
        },
      },
    )
  }

  const handleDelete = () => {
    mutateDelete(id, {
      onSuccess: () => {
        router.push('/admin/products')
      },
    })
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/products'
        title={t('Admin.Product.editProduct')}
      >
        <Button
          onClick={toggleOpenDeleteDialog}
          disabled={isDeletePending}
          size={'sm-icon'}
          variant={'destructive'}
        >
          <LuTrash />
          {t('Common.delete')}
        </Button>
        <Button
          disabled={isUpdatePending}
          form={formId}
          size={'sm-icon'}
          type='submit'
        >
          <LuSave />
          {t('Common.update')}
        </Button>
      </PageHeader>

      <Container>
        <Form
          onSubmit={form.handleSubmit(handleUpdate)}
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
                    <FFInput label={'Admin.Product.sku'} name='sku' />
                    <FFRichText
                      label={'Admin.Product.description'}
                      name='description'
                    />
                  </Grid>
                </CardS>
                <CardS title={t('Admin.Product.price')}>
                  <FFPrice />
                </CardS>
                <CardS title={t('Admin.Product.categoryAndAttributes')}>
                  <FFCategoryAttribute
                    initOptionCategory={data?.categoryOption}
                  />
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
                    options={STATUS_OPTIONS}
                  />
                </CardS>
                <CardS title={t('Admin.Product.productOrganization')}>
                  <Grid className='gap-3'>
                    <FFBrand
                      initOption={data?.brandOption}
                      label={'Admin.Brand.brand'}
                      name='brandId'
                    />
                  </Grid>
                </CardS>
              </Grid>
            </Col>
          </Grid>
        </Form>
      </Container>

      <ConfirmDialog
        onAction={handleDelete}
        onOpenChange={toggleOpenDeleteDialog}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isDeletePending}
        open={openDeleteDialog}
        title={t('Admin.Product.RowAction.Confirm.DELETE')}
      />
    </>
  )
}
