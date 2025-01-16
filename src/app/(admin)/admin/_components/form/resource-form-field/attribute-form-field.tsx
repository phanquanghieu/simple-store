import { useMemo, useState } from 'react'

import { useDebounceValue } from 'usehooks-ts'

import { useGetInfinityAttributes } from '~/app/_apis/admin/attribute/useGetInfiniteAttributes'

import {
  ISelectMultiFormFieldProps,
  SelectMultiFormField,
} from '../form-field/select-multi-form-field'

export function AttributeFormField(
  props: Omit<ISelectMultiFormFieldProps, 'options'>,
) {
  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebounceValue(search, 500)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const {
    data: attributes,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useGetInfinityAttributes({ search: searchDebounced }, isPopoverOpen)

  const options = useMemo(
    () =>
      attributes?.map((attribute) => ({
        value: attribute.id,
        label: attribute.name,
      })) ?? [],
    [attributes],
  )

  return (
    <SelectMultiFormField
      {...props}
      onLoadMore={fetchNextPage}
      onSearchChange={setSearch}
      setIsPopoverOpen={setIsPopoverOpen}
      hasMore={hasNextPage}
      isFetching={isFetching}
      isPopoverOpen={isPopoverOpen}
      options={options}
      search={search}
    />
  )
}
