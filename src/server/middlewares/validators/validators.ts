import { pick } from 'lodash'
import querystring from 'querystring'
import { ZodSchema } from 'zod'

import { buildErrorValidationResDetail } from '~/shared/libs/zod'

import { BadRequestException } from '~/server/common'
import { ICtx, IMiddlewareArgNext, IMiddlewareArgs } from '~/server/core'

import {
  ISortQuerySchemaParams,
  ListQuerySchema,
  LiteQuerySchema,
  PaginationQuerySchema,
} from '~/server/dto/_common/req'

export function paramValidator(paramKeys: string[]) {
  return async (ctx: ICtx, { params: { params } }: IMiddlewareArgNext) => {
    ctx.param = pick(await params, paramKeys)
  }
}

export function queryValidator(schema: ZodSchema) {
  return (ctx: ICtx, { request }: IMiddlewareArgNext) => {
    const queryObject = querystring.parse(request.nextUrl.search.slice(1))

    const validationResult = schema.safeParse(queryObject)

    if (!validationResult.success) {
      throw new BadRequestException({
        message: 'Invalid Request Query',
        detail: buildErrorValidationResDetail(validationResult),
      })
    }

    ctx.query = Object.assign(ctx.query ?? {}, validationResult.data)
  }
}

export function bodyValidator(schema: ZodSchema) {
  return async (ctx: ICtx, { request }: IMiddlewareArgNext) => {
    const validationResult = schema.safeParse(await request.json())

    if (!validationResult.success) {
      throw new BadRequestException({
        message: 'Invalid Request Body',
        detail: buildErrorValidationResDetail(validationResult),
      })
    }

    ctx.body = Object.assign(ctx.body ?? {}, validationResult.data)
  }
}

export function idParamValidator(...args: IMiddlewareArgs) {
  return paramValidator(['id'])(...args)
}

export function paginationQueryValidator(...args: IMiddlewareArgs) {
  queryValidator(PaginationQuerySchema)(...args)
}

export function listQueryValidator(...sortArgs: ISortQuerySchemaParams) {
  return (...args: IMiddlewareArgs) => {
    queryValidator(ListQuerySchema(...sortArgs))(...args)
  }
}

export function liteQueryValidator(...sortArgs: ISortQuerySchemaParams) {
  return (...args: IMiddlewareArgs) => {
    queryValidator(LiteQuerySchema(...sortArgs))(...args)
  }
}
