import { NextResponse } from 'next/server'

import { IErrorRes, IOkListRes, IOkRes } from '~/shared/dto/common/res'

export function OkRes<IData>(data: IData) {
  return NextResponse.json<IOkRes<IData>>({ data })
}

export function OkListRes<IData>(data: IData[], total: number) {
  return NextResponse.json<IOkListRes<IData>>({ data, total })
}

export function ErrorRes(res: IErrorRes, statusCode: number) {
  return NextResponse.json<IErrorRes>(res, { status: statusCode })
}
