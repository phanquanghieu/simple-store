import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IAttributeDetailRes } from '~/shared/dto/attribute/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetDetailAttribute(id: string) {
  return useQuery({
    queryKey: ['attributes', 'detail', id],
    queryFn: () =>
      fetcherAdmin.get<IOkRes<IAttributeDetailRes>>(`/attributes/${id}`),
    select: (data) => data.data,
  })
}
