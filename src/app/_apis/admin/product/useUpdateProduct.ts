import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IUpdateProductBody } from '~/shared/dto/product/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateProductBody }) =>
      fetcherAdmin.patch<IOkRes<boolean>>(`/products/${id}`, { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.UPDATE',
      })
    },
  })
}
