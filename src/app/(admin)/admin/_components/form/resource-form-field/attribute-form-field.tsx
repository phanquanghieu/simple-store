import { useState } from 'react'

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

  const { data, hasNextPage, fetchNextPage, isFetching } =
    useGetInfinityAttributes({ search: searchDebounced }, isPopoverOpen)

  return (
    <Select2FormField
      onLoadMore={fetchNextPage}
      setIsPopoverOpen={setIsPopoverOpen}
      setSearch={setSearch}
      hasMore={hasNextPage}
      isClearable
      isFetching={isFetching}
      isMultiSelect
      isPopoverOpen={isPopoverOpen}
      isSearchable
      options={data?.options}
      search={search}
      {...props}
    />
  )
}
