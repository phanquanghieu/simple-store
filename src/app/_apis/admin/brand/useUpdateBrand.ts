import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IUpdateBrandBody } from '~/shared/dto/brand/req'

import { useToast } from '~/app/_hooks/use-toast'

import { fetcherAdmin } from '../../fetcher'

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateBrandBody }) =>
      fetcherAdmin.patch<IOkRes<boolean>>(`/brands/${id}`, { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.UPDATE',
      })
    },
  })
}
