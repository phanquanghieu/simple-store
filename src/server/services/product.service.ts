import { Prisma } from '@prisma/client'

import { IIdParam, IPaginationQuery } from '~/shared/dto/_common/req'
import { IGetProductQuery } from '~/shared/dto/product/req'

import { OkListRes, OkRes, queryUtil } from '../common'
import { IAdminCtx, IAdminCtxParamQuery, IAdminCtxQuery } from '../core/ctx'
import { prisma } from '../infra/db'

async function get({ query }: IAdminCtxQuery<IGetProductQuery>) {
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
}

async function getOne({
  param,
  query,
}: IAdminCtxParamQuery<IIdParam, IPaginationQuery>) {
  return OkRes({ id: param, query })
}

async function create({
  param,
  query,
  body,
}: IAdminCtx<IIdParam, IPaginationQuery>) {
  return OkRes({ param, query, body })
}

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
  get,
  getOne,
  create,
}
