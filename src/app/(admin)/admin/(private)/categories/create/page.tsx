'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuPlus } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useCreateCategory } from '~/app/_apis/admin/category/useCreateCategory'

import {
  Form,
  InputFormField,
  RichTextFormField,
  SelectFormField,
} from '../../../_components/form'
import { AttributeFormField } from '../../../_components/form/resource-form-field/attribute-form-field'
import { PageHeader } from '../../../_components/page-header'

const CreateCategoryFormSchema = zod.object({
  parentId: zod.string(),
  attributeIds: zod.array(zod.string()),
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
})

type TCreateCategoryFormValue = z.infer<typeof CreateCategoryFormSchema>
const defaultValues: TCreateCategoryFormValue = {
  parentId: '_null',
  attributeIds: [],
  name: '',
  description: '',
}

export default function Page() {
  const { mutate, isPending } = useCreateCategory()

  const form = useForm<TCreateCategoryFormValue>({
    resolver: zodResolver(CreateCategoryFormSchema),
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const handleCreate = (values: TCreateCategoryFormValue) => {
    mutate(
      {
        parentId: values.parentId === '_null' ? null : values.parentId,
        attributeIds: values.attributeIds,
        name: values.name,
        description: values.description,
      },
      {
        onSuccess: () => {
          router.push('/admin/categories')
        },
      },
    )
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/categories'
        title={t('Admin.Category.createCategory')}
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
          <Grid grid={2}>
            <Col>
              <CardS>
                <Grid className='gap-3'>
                  <InputFormField
                    autoFocus
                    label={'Admin.Category.name'}
                    name='name'
                    placeholder={'Admin.Category.name'}
                  />
                  <RichTextFormField
                    label={'Admin.Category.description'}
                    name='description'
                  />
                </Grid>
              </CardS>
            </Col>
            <Col>
              <CardS>
                <Grid className='gap-3'>
                  <SelectFormField
                    hasNullOption
                    label={'Admin.Category.parent'}
                    name='parentId'
                    options={[{ value: '1', label: '111' }]}
                  />
                  <AttributeFormField
                    label={'Admin.Attribute.attributes'}
                    name='attributeIds'
                  />
                </Grid>
              </CardS>
            </Col>
          </Grid>
        </Form>
      </Container>
    </>
  )
}
