import { IOption } from '../_interfaces/common.interface'

export const SPECIAL_STRING = {
  null: '__null',
  all: '__all',
}

export const SPECIAL_OPTION: Record<'null', IOption<TMessageKey, string>> = {
  null: {
    label: 'Admin.Common.null',
    value: SPECIAL_STRING.null,
  },
}
