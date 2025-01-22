import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { ICreateProductBody } from '~/shared/dto/product/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: ICreateProductBody) =>
      fetcherAdmin.post<IOkRes<boolean>>('/products', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.CREATE',
      })
    },
  })
}
