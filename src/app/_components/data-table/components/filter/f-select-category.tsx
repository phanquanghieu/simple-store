import { useState } from 'react'

import { isEmpty } from 'lodash'

import { zodt } from '~/shared/libs'

import { ISelectTreeProps, SelectTree } from '~/app/_components/ui/select-tree'

import { useGetLiteCategories } from '~/app/_apis/admin/category/useGetLiteCategories'
import { useGetTreeCategories } from '~/app/_apis/admin/category/useGetTreeCategories'

import { useTableGlobalFilter } from '../../hooks/use-table-global-filter'
import { IFilterProps } from './filter.interface'

export function FSelectCategory({
  queryField,
  ...props
}: IFilterProps & ISelectTreeProps) {
  const { globalFilterValue, setGlobalFilterValue } = useTableGlobalFilter<
    string | string[] | null
  >(queryField)

  const [initIds] = useState(
    globalFilterValue ? zodt.toArray(globalFilterValue) : undefined,
  )
  const { data: initData } = useGetLiteCategories(
    { ids: initIds },
    !isEmpty(initIds),
  )

  const [openSelect, setOpenSelect] = useState(false)

  const { data, isFetching } = useGetTreeCategories(openSelect)

  return (
    <SelectTree
      onChange={setGlobalFilterValue}
      setOpenSelect={setOpenSelect}
      initOption={initData?.options}
      isClearable
      isFetching={isFetching}
      isMultiSelect
      isSearchable
      openSelect={openSelect}
      options={data?.options}
      placeholder={'Admin.Category.category'}
      value={globalFilterValue}
      variant='filter'
      {...props}
    />
  )
}
