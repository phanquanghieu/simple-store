import { useState } from 'react'

import { useDebounceValue } from 'usehooks-ts'

import { useGetInfinityAttributes } from '~/app/_apis/admin/attribute/useGetInfiniteAttributes'

import { FFSelect2, IFFSelect2Props } from '../form-field/ff-select2'

export function FFAttribute(props: IFFSelect2Props) {
  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebounceValue(search, 500)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const { data, hasNextPage, fetchNextPage, isFetching } =
    useGetInfinityAttributes({ search: searchDebounced }, isPopoverOpen)

  return (
    <FFSelect2
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
