'use client'

import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  isServer,
  keepPreviousData,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { toast } from '~/app/_hooks/use-toast'

function makeQueryClient(t: TTranslationFn) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: 'always',
        staleTime: 60_000,
        placeholderData: keepPreviousData,
      },
      mutations: {
        onError(error) {
          const errorMessageKey =
            `Admin.Common.Api.Exception.${error.message}` as TTranslationFnKey
          if (t.has(errorMessageKey)) {
            toast({
              variant: 'destructive',
              title: t(errorMessageKey),
            })
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError(error) {
        const errorMessageKey =
          `Admin.Common.Api.Exception.${error.message}` as TTranslationFnKey
        if (t.has(errorMessageKey)) {
          toast({
            variant: 'destructive',
            title: t(errorMessageKey),
          })
        }
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient(t: TTranslationFn) {
  if (isServer) {
    return makeQueryClient(t)
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient(t)
    return browserQueryClient
  }
}

export function ReactQueryProvider({ children }: PropsWithChildren) {
  const t = useTranslations()
  const queryClient = getQueryClient(t)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
