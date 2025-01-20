'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuPlus } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useCreateCategory } from '~/app/_apis/admin/category/useCreateCategory'

import {
  FFAttribute,
  FFCategory,
  FFInput,
  FFRichText,
  Form,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'

const CreateCategoryFormSchema = zod.object({
  parentId: zod.string().nullable(),
  attributeIds: zod.array(zod.string()),
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
})

type TCreateCategoryFormValue = z.infer<typeof CreateCategoryFormSchema>
const defaultValues: TCreateCategoryFormValue = {
  parentId: null,
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
        parentId: values.parentId,
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
                  <FFInput
                    autoFocus
                    label={'Admin.Category.name'}
                    name='name'
                    placeholder={'Admin.Category.name'}
                  />
                  <FFRichText
                    label={'Admin.Category.description'}
                    name='description'
                  />
                </Grid>
              </CardS>
            </Col>
            <Col>
              <CardS>
                <Grid className='gap-3'>
                  <FFCategory label={'Admin.Category.parent'} name='parentId' />
                  <FFAttribute
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
