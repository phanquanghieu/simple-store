import { useMemo, useState } from 'react'

import { useDebounceValue } from 'usehooks-ts'

import { useGetInfinityAttributes } from '~/app/_apis/admin/attribute/useGetInfiniteAttributes'

import {
  ISelect2FormFieldProps,
  Select2FormField,
} from '../form-field/select2-form-field'

export function AttributeFormField(
  props: Omit<ISelect2FormFieldProps, 'options'>,
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
    <Select2FormField
      onLoadMore={fetchNextPage}
      setIsPopoverOpen={setIsPopoverOpen}
      setSearch={setSearch}
      hasMore={hasNextPage}
      isFetching={isFetching}
      isMultiSelect
      isPopoverOpen={isPopoverOpen}
      options={options}
      search={search}
      {...props}
    />
  )
}
