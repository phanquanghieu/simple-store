import { useMemo, useState } from 'react'

import { ICategoryLiteTreeRes } from '~/shared/dto/category/res'

import { treeUtil } from '~/app/_libs/tree'

import { useGetTreeCategories } from '~/app/_apis/admin/category/useGetTreeCategories'
import { IOptionTree } from '~/app/_interfaces/common.interface'

import {
  ISelectTreeFormFieldProps,
  SelectTreeFormField,
} from '../form-field/select-tree-form-field'

export function CategoryFormField(
  props: Omit<ISelectTreeFormFieldProps, 'options'>,
) {
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
    <SelectTreeFormField
      {...props}
      setIsPopoverOpen={setIsPopoverOpen}
      disableNodeLevel={5}
      isFetching={isFetching}
      isPopoverOpen={isPopoverOpen}
      options={options}
    />
  )
}
