import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IUpdateAttributeBody } from '~/shared/dto/attribute/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useUpdateAttribute() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateAttributeBody }) =>
      fetcherAdmin.patch<IOkRes<boolean>>(`/attributes/${id}`, { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['attributes'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.UPDATE',
      })
    },
  })
}
