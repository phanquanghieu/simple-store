import { Prisma } from '@prisma/client'
import { difference } from 'lodash'

import { IIdParam, ILiteQuery } from '~/shared/dto/_common/req'
import {
  E_BULK_ATTRIBUTE_TYPE,
  IBulkAttributeBody,
  ICreateAttributeBody,
  IGetAttributeQuery,
  IUpdateAttributeBody,
} from '~/shared/dto/attribute/req'
import {
  E_ATTRIBUTE_EXCEPTION,
  IAttributeDetailRes,
  IAttributeLiteRes,
  IAttributeRes,
} from '~/shared/dto/attribute/res'

import {
  BadRequestException,
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

export const attributeService = {
  GET_SORTABLE_FIELDS: [
    Prisma.AttributeScalarFieldEnum.id,
    Prisma.AttributeScalarFieldEnum.name,
    Prisma.AttributeScalarFieldEnum.type,
    Prisma.AttributeScalarFieldEnum.updatedAt,
    Prisma.AttributeScalarFieldEnum.createdAt,
  ],

  GET_LITE_SORTABLE_FIELDS: [
    Prisma.AttributeScalarFieldEnum.id,
    Prisma.AttributeScalarFieldEnum.name,
  ],
  GET_LITE_SORT_DEFAULTS: [
    ['name', 'asc'],
    ['id', 'desc'],
  ],

  get: async ({ query }: IAdminCtxQuery<IGetAttributeQuery>) => {
    const where: Prisma.AttributeWhereInput = {
      name: { contains: query.search ?? Prisma.skip },
      type: { in: query.type ?? Prisma.skip },
    }

    const [attributes, total] = await Promise.all([
      prisma.attribute.findMany({
        where,
        ...queryUtil.skipTakeOrder(query),
      }),
      prisma.attribute.count({ where }),
    ])

    return OkListRes(IAttributeRes.list(attributes), total)
  },

  getLite: async ({ query }: IAdminCtxQuery<ILiteQuery>) => {
    const attributes = await prisma.attribute.findMany({
      where: query.ids
        ? { id: { in: query.ids } }
        : {
            name: { contains: query.search ?? Prisma.skip },
          },
      ...queryUtil.skipTakeOrder(query),
    })

    return OkLiteRes(IAttributeLiteRes.list(attributes))
  },

  getDetail: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    const attribute = await prisma.attribute
      .findUniqueOrThrow({
        where: { id },
        include: {
          attributeOptions: {
            orderBy: { position: 'asc' },
          },
        },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    return OkRes(new IAttributeDetailRes(attribute))
  },

  create: async ({ body }: IAdminCtxBody<ICreateAttributeBody>) => {
    const attribute = await prisma.attribute.findFirst({
      where: { key: body.key },
    })
    if (attribute) {
      throw new BadRequestException(E_ATTRIBUTE_EXCEPTION.KEY_EXISTED)
    }

    const created = await prisma.attribute.create({
      data: {
        name: body.name,
        key: body.key,
        description: body.description,
        type: body.type,
        attributeOptions: {
          create: body.options.map((option, index) => ({
            name: option.name,
            key: `${body.key}.${option.key}`,
            value: option.value ?? null,
            position: index + 1,
          })),
        },
      },
    })

    return OkRes(created)
  },

  update: async ({
    param: { id },
    body,
  }: IAdminCtxParamBody<IIdParam, IUpdateAttributeBody>) => {
    const currAttribute = await prisma.attribute
      .findUniqueOrThrow({
        where: {
          id,
          type: body.type,
        },
        include: {
          attributeOptions: true,
        },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    const attributeOptions = body.options.map((option, index) => ({
      ...option,
      position: index + 1,
    }))

    const attributeOptionCreates = attributeOptions.filter((x) => !x.id)

    const attributeOptionUpdates = attributeOptions.filter((x) => !!x.id)

    const attributeOptionDeleteIds = difference(
      currAttribute.attributeOptions.map((x) => x.id),
      attributeOptionUpdates.map((x) => x.id),
    )

    const updated = await prisma.attribute.update({
      where: { id },
      data: {
        name: body.name ?? Prisma.skip,
        description: body.description ?? Prisma.skip,
        attributeOptions: {
          delete: attributeOptionDeleteIds.length
            ? attributeOptionDeleteIds.map((id) => ({ id }))
            : Prisma.skip,
          create: attributeOptionCreates.length
            ? attributeOptionCreates.map((attributeOption) => ({
                name: attributeOption.name!,
                key: `${currAttribute.key}.${attributeOption.key!}`,
                value: attributeOption.value ?? null,
                position: attributeOption.position,
              }))
            : Prisma.skip,
          update: attributeOptionUpdates.length
            ? attributeOptionUpdates.map((attributeOption) => ({
                where: { id: attributeOption.id },
                data: {
                  name: attributeOption.name,
                  value: attributeOption.value ?? null,
                  position: attributeOption.position,
                },
              }))
            : Prisma.skip,
        },
      },
    })

    return OkRes(updated)
  },

  delete: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    await prisma.attribute.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException()
    })

    const deleted = await prisma.attribute.delete({
      where: { id },
    })

    return OkRes(deleted)
  },

  bulk: async ({ body: { ids, type } }: IAdminCtxBody<IBulkAttributeBody>) => {
    switch (type) {
      case E_BULK_ATTRIBUTE_TYPE.DELETE: {
        await prisma.attribute.deleteMany({
          where: { id: { in: ids } },
        })

        break
      }
    }

    return OkRes(true)
  },
}
