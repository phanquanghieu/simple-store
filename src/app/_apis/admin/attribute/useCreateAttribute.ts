import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { ICreateAttributeBody } from '~/shared/dto/attribute/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useCreateAttribute() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: ICreateAttributeBody) =>
      fetcherAdmin.post<IOkRes<boolean>>('/attributes', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['attributes', 'list'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.CREATE',
      })
    },
  })
}
