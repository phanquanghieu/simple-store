import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IBulkProductBody } from '~/shared/dto/product/req'

import { useToast } from '~/app/_hooks/use-toast'

import { fetcherAdmin } from '../../fetcher'

export function useBulkProducts() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (body: IBulkProductBody) =>
      fetcherAdmin.put<IOkRes<boolean>>('/products/bulk', { body }),
    onSuccess(data, variables) {
      toast({
        variant: 'success',
        title: `${variables.type} product success`,
      })
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    throwOnError: false,
  })
}
