import { Prisma } from '@prisma/client'

import { IIdParam, IListQuery } from '~/shared/dto/_common/req'
import { ICreateBrandBody, IUpdateBrandBody } from '~/shared/dto/brand/req'

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
    Prisma.BrandScalarFieldEnum.createdAt,
  ],

  get: async ({ query }: IAdminCtxQuery<IListQuery>) => {
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

    return OkListRes(brands, total)
  },

  getOne: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    const brand = await prisma.brand
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    return OkRes(brand)
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
}