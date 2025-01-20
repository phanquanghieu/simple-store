import { useState } from 'react'

import { isEmpty } from 'lodash'
import { useDebounceValue } from 'usehooks-ts'

import { zodt } from '~/shared/libs'

import { ISelect2Props, Select2 } from '~/app/_components/ui/select2'

import { useGetInfiniteBrands } from '~/app/_apis/admin/brand/useGetInfiniteBrands'
import { useGetLiteBrands } from '~/app/_apis/admin/brand/useGetLiteBrands'

import { useTableGlobalFilter } from '../../hooks/use-table-global-filter'
import { IFilterProps } from './filter.interface'

export function FSelectBrand({
  queryField,
  ...props
}: IFilterProps & ISelect2Props) {
  const { globalFilterValue, setGlobalFilterValue } = useTableGlobalFilter<
    string | string[] | null
  >(queryField)

  const [initBrandIds] = useState(
    globalFilterValue ? zodt.toArray(globalFilterValue) : undefined,
  )
  const { data: liteBrandsData } = useGetLiteBrands(
    { ids: initBrandIds },
    !isEmpty(initBrandIds),
  )

  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebounceValue(search, 500)
  const [openSelect, setOpenSelect] = useState(false)

  const {
    data: brandsData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useGetInfiniteBrands({ search: searchDebounced }, openSelect)

  return (
    <Select2
      onChange={setGlobalFilterValue}
      onLoadMore={fetchNextPage}
      setOpenSelect={setOpenSelect}
      setSearch={setSearch}
      hasMore={hasNextPage}
      initOption={liteBrandsData?.options}
      isClearable
      isFetching={isFetching}
      isMultiSelect
      isSearchable
      openSelect={openSelect}
      options={brandsData?.options}
      placeholder={'Admin.Brand.brand'}
      search={search}
      value={globalFilterValue}
      variant='filter'
      {...props}
    />
  )
}
