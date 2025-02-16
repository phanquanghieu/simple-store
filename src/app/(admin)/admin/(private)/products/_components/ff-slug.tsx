import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { snakeCase } from 'lodash'

import { zodRegex } from '~/shared/libs'

import { FFInput } from '../../../_components/form'
import { TCUProductFormValue } from '../_schema'

export function FFSlug() {
  const { formState, setValue } = useFormContext<TCUProductFormValue>()
  const name = useWatch<TCUProductFormValue, 'name'>({
    name: 'name',
  })
  useEffect(() => {
    if (!formState.dirtyFields.slug) {
      setValue('slug', snakeCase(name))
    }
  }, [name, setValue, formState])

  return (
    <FFInput
      label={'Admin.Product.slug'}
      name='slug'
      valueRegExp={zodRegex.KEY_REPLACE}
    />
  )
}
