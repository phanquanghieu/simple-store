import { Prisma } from '@prisma/client'
import { random } from 'lodash'

import { IIdParam, IPaginationQuery } from '~/shared/dto/_common/req'
import { IBulkProductBody, IGetProductQuery } from '~/shared/dto/product/req'

import { BadRequestException, OkListRes, OkRes, queryUtil } from '../common'
import {
  IAdminCtx,
  IAdminCtxBody,
  IAdminCtxParamQuery,
  IAdminCtxQuery,
} from '../core/ctx'
import { prisma } from '../infra/db'

export const productService = {
  GET_SORTABLE_FIELDS: [
    'id',
    'name',
    'price',
    'status',
    'totalVariants',
    'createdAt',
  ],
  GET_SORT_DEFAULTS: [['name', 'asc']],

  get: async ({ query }: IAdminCtxQuery<IGetProductQuery>) => {
    const where: Prisma.ProductWhereInput = {
      name: { contains: query.search ?? Prisma.skip, mode: 'insensitive' },
      status: { in: query.status ?? Prisma.skip },
      totalVariants: query.totalVariants ?? Prisma.skip,
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        ...queryUtil.skipTakeOrder(query),
      }),
      prisma.product.count({ where }),
    ])

    return OkListRes(products, total)
  },

  getOne: async ({
    param,
    query,
  }: IAdminCtxParamQuery<IIdParam, IPaginationQuery>) => {
    return OkRes({ id: param, query })
  },

  create: async ({
    param,
    query,
    body,
  }: IAdminCtx<IIdParam, IPaginationQuery>) => {
    return OkRes({ param, query, body })
  },

  bulk: async ({ body }: IAdminCtxBody<IBulkProductBody>) => {
    const r = random(1, 2, false)
    console.log(r)
    await wait(1000)
    if (1 === 1) {
      throw new BadRequestException('Error')
    }
    console.log(body)
    return OkRes(true)
  },
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
