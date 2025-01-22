import { E_PRODUCT_STATUS, Prisma } from '@prisma/client'

import { IIdParam } from '~/shared/dto/_common/req'
import {
  E_BULK_PRODUCT_TYPE,
  IBulkProductBody,
  ICreateProductBody,
  IGetProductQuery,
} from '~/shared/dto/product/req'
import { IProductDetailRes, IProductRes } from '~/shared/dto/product/res'

import {
  InternalServerErrorException,
  NotFoundException,
  OkListRes,
  OkRes,
  queryUtil,
} from '../common'
import { IAdminCtxBody, IAdminCtxParam, IAdminCtxQuery } from '../core/ctx'
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
      brandId: { in: query.brandIds ?? Prisma.skip },
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        ...queryUtil.skipTakeOrder(query),
      }),
      prisma.product.count({ where }),
    ])

    return OkListRes(IProductRes.list(products), total)
  },

  getDetail: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    const product = await prisma.product
      .findUniqueOrThrow({ where: { id }, include: { brand: true } })
      .catch(() => {
        throw new NotFoundException()
      })

    return OkRes(new IProductDetailRes(product))
  },

  create: async ({ body }: IAdminCtxBody<ICreateProductBody>) => {
    console.log(body)
    throw new InternalServerErrorException()
  },

  delete: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    await prisma.product.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException()
    })

    await prisma.product.delete({ where: { id } })

    return OkRes(true)
  },

  bulk: async ({ body: { ids, type } }: IAdminCtxBody<IBulkProductBody>) => {
    switch (type) {
      case E_BULK_PRODUCT_TYPE.ACTIVATE: {
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
