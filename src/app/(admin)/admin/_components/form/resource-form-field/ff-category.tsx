import { useMemo, useState } from 'react'

import { ICategoryLiteTreeRes } from '~/shared/dto/category/res'

import { treeUtil } from '~/app/_libs/tree'

import { useGetTreeCategories } from '~/app/_apis/admin/category/useGetTreeCategories'
import { IOptionTree } from '~/app/_interfaces/common.interface'

import { FFSelectTree, IFFSelectTreeProps } from '../form-field/ff-select-tree'

export function FFCategory(props: IFFSelectTreeProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const { data: categoryTrees, isFetching } =
    useGetTreeCategories(isPopoverOpen)

  const options = useMemo(
    () =>
      treeUtil.transform<ICategoryLiteTreeRes, IOptionTree>(
        categoryTrees ?? [],
      ),
    [categoryTrees],
  )

  return (
    <FFSelectTree
      setIsPopoverOpen={setIsPopoverOpen}
      disableNodeLevel={5}
      isFetching={isFetching}
      isPopoverOpen={isPopoverOpen}
      options={options}
      {...props}
    />
  )
}
