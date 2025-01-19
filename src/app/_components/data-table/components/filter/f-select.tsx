import { ISelect2Props, Select2 } from '~/app/_components/ui/select2'

import { useTableGlobalFilter } from '../../hooks/use-table-global-filter'
import { IFilterProps } from './filter.interface'

export function FSelect({
  queryField,
  ...props
}: IFilterProps & ISelect2Props) {
  const { globalFilterValue, setGlobalFilterValue } = useTableGlobalFilter<
    string | string[] | null
  >(queryField)

  return (
    <Select2
      onChange={setGlobalFilterValue}
      isClearable
      isMultiSelect
      isOptionLabelMessageKey
      value={globalFilterValue}
      variant='filter'
      {...props}
    />
  )
}
