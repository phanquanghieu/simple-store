import { E_ATTRIBUTE_TYPE } from '@prisma/client'

import { IOption } from '~/app/_interfaces/common.interface'

export const TYPE_OPTIONS: IOption<TMessageKey, E_ATTRIBUTE_TYPE>[] = [
  {
    label: 'Admin.Attribute.Type.TEXT',
    value: E_ATTRIBUTE_TYPE.TEXT,
  },
  {
    label: 'Admin.Attribute.Type.COLOR',
    value: E_ATTRIBUTE_TYPE.COLOR,
  },
  {
    label: 'Admin.Attribute.Type.BOOLEAN',
    value: E_ATTRIBUTE_TYPE.BOOLEAN,
  },
]
