import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IAttributeLiteWithOptionsRes } from '~/shared/dto/attribute/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetAttributesCategory(id: string | null) {
  return useQuery({
    queryKey: ['categories', 'attributes', id],
    queryFn: () =>
      fetcherAdmin.get<IOkRes<IAttributeLiteWithOptionsRes[]>>(
        `/categories/${id}/attributes`,
      ),
    select: (data) => data.data,
    enabled: !!id,
  })
}
