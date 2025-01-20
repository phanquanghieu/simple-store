import { Prisma } from '@prisma/client'

import { IIdParam, ILiteQuery } from '~/shared/dto/_common/req'
import {
  E_BULK_BRAND_TYPE,
  IBulkBrandBody,
  ICreateBrandBody,
  IGetBrandQuery,
  IUpdateBrandBody,
} from '~/shared/dto/brand/req'
import {
  IBrandDetailRes,
  IBrandLiteRes,
  IBrandRes,
} from '~/shared/dto/brand/res'

import {
  NotFoundException,
  OkListRes,
  OkLiteRes,
  OkRes,
  queryUtil,
} from '../common'
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

  GET_LITE_SORTABLE_FIELDS: [
    Prisma.BrandScalarFieldEnum.id,
    Prisma.BrandScalarFieldEnum.name,
  ],
  GET_LITE_SORT_DEFAULTS: [
    ['name', 'asc'],
    ['id', 'desc'],
  ],

  get: async ({ query }: IAdminCtxQuery<IGetBrandQuery>) => {
    const where: Prisma.BrandWhereInput = {
      name: { contains: query.search ?? Prisma.skip, mode: 'insensitive' },
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

  getLite: async ({ query }: IAdminCtxQuery<ILiteQuery>) => {
    const brands = await prisma.brand.findMany({
      where: query.ids
        ? { id: { in: query.ids } }
        : {
            name: {
              contains: query.search ?? Prisma.skip,
              mode: 'insensitive',
            },
          },
      ...queryUtil.skipTakeOrder(query),
    })

    return OkLiteRes(IBrandLiteRes.list(brands))
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
