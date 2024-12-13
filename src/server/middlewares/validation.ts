import { NextRequest } from 'next/server'

import { pick } from 'lodash'

import { INextRouteParams } from '~/shared/interfaces/next'

import { ICtx } from '../interfaces/ctx'

export function validateParam(
  { params }: INextRouteParams,
  paramKeys: string[],
) {
  return async (ctx: ICtx) => {
    console.log(ctx)
    ctx.param = pick(await params, paramKeys)
  }
}

export function validatePaginationQuery(request: NextRequest) {
  return (ctx: ICtx) => {
    console.log(ctx)
  }
}
