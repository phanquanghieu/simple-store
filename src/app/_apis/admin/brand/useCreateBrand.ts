import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { ICreateBrandBody } from '~/shared/dto/brand/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useCreateBrand() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: ICreateBrandBody) =>
      fetcherAdmin.post<IOkRes<boolean>>('/brands', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.CREATE',
      })
    },
  })
}
