'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuPlus } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'

import { E_ATTRIBUTE_EXCEPTION } from '~/shared/dto/attribute/res'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useCreateAttribute } from '~/app/_apis/admin/attribute/useCreateAttribute'

import { FFInput, FFRichText, FFSelect2, Form } from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { TYPE_OPTIONS } from '../_common'
import { FFKey } from '../_components/ff-key'
import { FFOption } from '../_components/ff-option'
import {
  CreateAttributeFormSchema,
  TCreateAttributeFormValue,
  defaultCreateAttributeFormValue,
} from '../_schema'

export default function Page() {
  const { mutate: mutateCreate, isPending } = useCreateAttribute()

  const form = useForm<TCreateAttributeFormValue>({
    resolver: zodResolver(CreateAttributeFormSchema),
    defaultValues: defaultCreateAttributeFormValue,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const type = form.watch('type')
  useEffect(() => {
    const DEFAULT_OPTIONS_BY_TYPE = {
      TEXT: [{ name: '', key: '' }],
      COLOR: [{ name: '', key: '', value: '' }],
      BOOLEAN: [
        { name: 'True', key: 'true' },
        { name: 'False', key: 'false' },
      ],
    }
    form.resetField('options')
    form.setValue(
      'options',
      DEFAULT_OPTIONS_BY_TYPE[type] as TCreateAttributeFormValue['options'],
    )
  }, [type, form])

  const handleCreate = (values: TCreateAttributeFormValue) => {
    mutateCreate(values, {
      onSuccess: () => {
        router.push('/admin/attributes')
      },
      onError(error) {
        if (error.message in E_ATTRIBUTE_EXCEPTION) {
          form.setError('key', {
            message: `Admin.Attribute.ApiException.${error.message}`,
          })
        }
      },
    })
  }
  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/attributes'
        title={t('Admin.Attribute.createAttribute')}
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
                    label={'Admin.Attribute.name'}
                    name='name'
                  />
                  <FFKey />
                  <FFRichText
                    label={'Admin.Attribute.description'}
                    name='description'
                  />
                </Grid>
              </CardS>
            </Col>
            <Col>
              <CardS>
                <Grid className='gap-3' grid={2}>
                  <Col>
                    <FFSelect2
                      isOptionLabelMessageKey
                      label={'Admin.Attribute.type'}
                      name='type'
                      options={TYPE_OPTIONS}
                    />
                  </Col>
                  <Col col={2}>
                    <FFOption />
                  </Col>
                </Grid>
              </CardS>
            </Col>
          </Grid>
        </Form>
      </Container>
    </>
  )
}
