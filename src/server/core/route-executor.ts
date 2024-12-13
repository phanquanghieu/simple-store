import { NextRequest, NextResponse } from 'next/server'

import { ICtx } from '~/server/core/ctx'

import { ErrorRes, HttpException } from '../common'

export interface IMiddlewareArgNext {
  request: NextRequest
  params: INextRouteParams
}

export type IMiddlewareArgs = [ICtx, IMiddlewareArgNext]

export function routeExecutor(request: NextRequest, params: INextRouteParams) {
  return async (
    ...middlewares: ((
      ctx: ICtx,
      next: IMiddlewareArgNext,
    ) => Promise<NextResponse | void> | NextResponse | void)[]
  ) => {
    const ctx = {} as ICtx

    for (const middleware of middlewares) {
      try {
        const response = await middleware(ctx, { request, params })
        if (response) {
          return response
        }
      } catch (error: unknown) {
        if (error instanceof HttpException) {
          return ErrorRes(error.getRes(), error.getStatusCode())
        } else {
          console.error(error)
          return ErrorRes(HttpException.getRes(), HttpException.getStatusCode())
        }
      }
    }
  }
}
