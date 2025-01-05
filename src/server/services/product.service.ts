import { E_PRODUCT_STATUS, Prisma } from '@prisma/client'

import { IIdParam, IPaginationQuery } from '~/shared/dto/_common/req'
import {
  E_BULK_PRODUCT_TYPE,
  IBulkProductBody,
  IGetProductQuery,
} from '~/shared/dto/product/req'

import { NotFoundException, OkListRes, OkRes, queryUtil } from '../common'
import {
  IAdminCtx,
  IAdminCtxBody,
  IAdminCtxParam,
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

  delete: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    await prisma.product.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException('Product not found')
    })

    await prisma.product.delete({ where: { id } })

    return OkRes(true)
  },

  bulk: async ({ body: { ids, type } }: IAdminCtxBody<IBulkProductBody>) => {
    switch (type) {
      case E_BULK_PRODUCT_TYPE.ACTIVE: {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { status: E_PRODUCT_STATUS.ACTIVE },
        })

        break
      }
      case E_BULK_PRODUCT_TYPE.DRAFT: {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { status: E_PRODUCT_STATUS.DRAFT },
        })
        break
      }
      case E_BULK_PRODUCT_TYPE.ARCHIVE: {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { status: E_PRODUCT_STATUS.ARCHIVED },
        })

        break
      }
      case E_BULK_PRODUCT_TYPE.DELETE: {
        await prisma.product.deleteMany({ where: { id: { in: ids } } })

        break
      }
    }

    return OkRes(true)
  },
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
