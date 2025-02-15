import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { snakeCase } from 'lodash'

import { zodRegex } from '~/shared/libs'

import { FFInput } from '../../../_components/form'

type TFormValue = { name: string; key: string }

export function FFKey() {
  const { formState, setValue } = useFormContext<TFormValue>()
  const name = useWatch<TFormValue, 'name'>({
    name: 'name',
  })

  useEffect(() => {
    if (!formState.dirtyFields.key) {
      setValue('key', snakeCase(name))
    }
  }, [name, setValue, formState])

  return (
    <FFInput
      label={'Admin.Attribute.key'}
      name='key'
      valueRegExp={zodRegex.KEY_REPLACE}
    />
  )
}
