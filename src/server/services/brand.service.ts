import { Prisma } from '@prisma/client'

import { IIdParam } from '~/shared/dto/_common/req'
import {
  E_BULK_BRAND_TYPE,
  IBulkBrandBody,
  ICreateBrandBody,
  IGetBrandQuery,
  IUpdateBrandBody,
} from '~/shared/dto/brand/req'
import { IBrandDetailRes, IBrandRes } from '~/shared/dto/brand/res'

import { NotFoundException, OkListRes, OkRes, queryUtil } from '../common'
import {
  IAdminCtxBody,
  IAdminCtxParam,
  IAdminCtxParamBody,
  IAdminCtxQuery,
} from '../core/ctx'
import { prisma } from '../infra/db'

export const brandService = {
  GET_SORTABLE_FIELDS: [
    Prisma.BrandScalarFieldEnum.id,
    Prisma.BrandScalarFieldEnum.name,
    Prisma.BrandScalarFieldEnum.updatedAt,
    Prisma.BrandScalarFieldEnum.createdAt,
  ],

  get: async ({ query }: IAdminCtxQuery<IGetBrandQuery>) => {
    const where: Prisma.BrandWhereInput = {
      name: { contains: query.search ?? Prisma.skip },
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        ...queryUtil.skipTakeOrder(query),
      }),
      prisma.brand.count({ where }),
    ])

    return OkListRes(IBrandRes.list(brands), total)
  },

  getDetail: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    const brand = await prisma.brand
      .findUniqueOrThrow({
        where: { id },
        include: {
          products: true,
        },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    return OkRes(new IBrandDetailRes(brand))
  },

  create: async ({ body }: IAdminCtxBody<ICreateBrandBody>) => {
    const created = await prisma.brand.create({
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return OkRes(created)
  },

  update: async ({
    param: { id },
    body,
  }: IAdminCtxParamBody<IIdParam, IUpdateBrandBody>) => {
    await prisma.brand.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException()
    })

    const updated = await prisma.brand.update({
      where: { id },
      data: {
        name: body.name ?? Prisma.skip,
        description: body.description ?? Prisma.skip,
      },
    })

    return OkRes(updated)
  },

  delete: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    await prisma.brand.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException()
    })

    const deleted = await prisma.brand.delete({
      where: { id },
    })

    return OkRes(deleted)
  },

  bulk: async ({ body: { ids, type } }: IAdminCtxBody<IBulkBrandBody>) => {
    switch (type) {
      case E_BULK_BRAND_TYPE.DELETE: {
        await prisma.brand.deleteMany({
          where: { id: { in: ids } },
        })

        break
      }
    }

    return OkRes(true)
  },
}
