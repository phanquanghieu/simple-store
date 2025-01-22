import { useState } from 'react'

import { useDebounceValue } from 'usehooks-ts'

import { useGetInfiniteBrands } from '~/app/_apis/admin/brand/useGetInfiniteBrands'

import { FFSelect2, IFFSelect2Props } from '../form-field/ff-select2'

export function FFBrand(props: IFFSelect2Props) {
  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebounceValue(search, 500)
  const [openSelect, setOpenSelect] = useState(false)

  const { data, hasNextPage, fetchNextPage, isFetching } = useGetInfiniteBrands(
    { search: searchDebounced },
    openSelect,
  )

  return (
    <FFSelect2
      onLoadMore={fetchNextPage}
      setOpenSelect={setOpenSelect}
      setSearch={setSearch}
      hasMore={hasNextPage}
      isClearable
      isFetching={isFetching}
      isSearchable
      openSelect={openSelect}
      options={data?.options}
      search={search}
      {...props}
    />
  )
}
