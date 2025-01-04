import '@tanstack/react-query'

import { IErrorRes } from '~/shared/dto/_common/res'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: IErrorRes
  }
}
