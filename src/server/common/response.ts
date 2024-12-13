import { NextResponse } from 'next/server'

import {
  IApiOkPaginationRes,
  IApiOkRes,
} from '~/shared/interfaces/api/response'

export function OkRes<IData>(data: IData) {
  return NextResponse.json<IApiOkRes<IData>>({ data })
}

export function OkPaginationRes<IData>(data: IData[], total: number) {
  return NextResponse.json<IApiOkPaginationRes<IData>>({ data, total })
}
