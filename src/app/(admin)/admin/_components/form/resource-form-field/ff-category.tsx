import { useState } from 'react'

import { useGetTreeCategories } from '~/app/_apis/admin/category/useGetTreeCategories'

import { FFSelectTree, IFFSelectTreeProps } from '../form-field/ff-select-tree'

export function FFCategory(props: IFFSelectTreeProps) {
  const [openSelect, setOpenSelect] = useState(false)

  const { data, isFetching } = useGetTreeCategories(openSelect)

  return (
    <FFSelectTree
      setOpenSelect={setOpenSelect}
      disableNodeLevel={5}
      isClearable
      isFetching={isFetching}
      isSearchable
      openSelect={openSelect}
      options={data?.options}
      {...props}
    />
  )
}
