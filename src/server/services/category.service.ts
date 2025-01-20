import { Prisma } from '@prisma/client'
import { difference, isUndefined } from 'lodash'
import { v7 } from 'uuid'

import { IIdParam, IListQuery } from '~/shared/dto/_common/req'
import {
  E_BULK_CATEGORY_TYPE,
  IBulkCategoryBody,
  ICreateCategoryBody,
  IUpdateCategoryBody,
} from '~/shared/dto/category/req'
import {
  E_CATEGORY_EXCEPTION,
  ICategoryDetailRes,
  ICategoryLiteTreeRes,
  ICategoryRes,
} from '~/shared/dto/category/res'

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

export const categoryService = {
  GET_SORTABLE_FIELDS: [
    Prisma.CategoryScalarFieldEnum.id,
    Prisma.CategoryScalarFieldEnum.name,
    Prisma.CategoryScalarFieldEnum.updatedAt,
    Prisma.CategoryScalarFieldEnum.createdAt,
  ],
  CATEGORY_TREE_HEIGHT: 5,

  get: async ({ query }: IAdminCtxQuery<IListQuery>) => {
    const where: Prisma.CategoryWhereInput = {
      name: { contains: query.search ?? Prisma.skip, mode: 'insensitive' },
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        ...queryUtil.skipTakeOrder(query),
        include: {
          parent: true,
        },
      }),
      prisma.category.count({ where }),
    ])

    return OkListRes(ICategoryRes.list(categories), total)
  },

  getTree: async () => {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: {
                      orderBy: { name: 'asc' },
                    },
                  },
                  orderBy: { name: 'asc' },
                },
              },
              orderBy: { name: 'asc' },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    return OkLiteRes(ICategoryLiteTreeRes.list(categories))
  },

  getOne: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    const category = await prisma.category
      .findUniqueOrThrow({
        where: { id },
        include: {
          parent: true,
          attributes: true,
          children: {
            include: {
              children: {
                include: {
                  children: {
                    include: {
                      children: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    return OkRes(new ICategoryDetailRes(category))
  },

  create: async ({ body }: IAdminCtxBody<ICreateCategoryBody>) => {
    const id = v7()

    const pathIds: string[] = [id]
    if (body.parentId) {
      const categoryParent = await prisma.category
        .findUniqueOrThrow({ where: { id: body.parentId } })
        .catch(() => {
          throw new NotFoundException()
        })

      if (
        categoryParent.pathIds.length >= categoryService.CATEGORY_TREE_HEIGHT
      ) {
        throw new BadRequestException(E_CATEGORY_EXCEPTION.TREE_HEIGHT_EXCEEDED)
      }

      pathIds.unshift(...categoryParent.pathIds)
    }

    const created = await prisma.category.create({
      data: {
        id,
        pathIds,
        parentId: body.parentId,
        name: body.name,
        description: body.description,
        attributes: {
          connect: body.attributeIds.length
            ? body.attributeIds.map((attributeId) => ({
                id: attributeId,
              }))
            : Prisma.skip,
        },
      },
    })

    return OkRes(created)
  },

  update: async ({
    param: { id },
    body,
  }: IAdminCtxParamBody<IIdParam, IUpdateCategoryBody>) => {
    const currCategory = await prisma.category
      .findUniqueOrThrow({ where: { id }, include: { attributes: true } })
      .catch(() => {
        throw new NotFoundException()
      })

    let updateDataAttributes:
      | Prisma.AttributeUpdateManyWithoutCategoriesNestedInput
      | undefined

    if (body.attributeIds) {
      const currAttributeIds = currCategory.attributes.map((x) => x.id)
      const attributeConnectIds = difference(
        body.attributeIds,
        currAttributeIds,
      )
      const attributeDisconnectIds = difference(
        currAttributeIds,
        body.attributeIds,
      )

      updateDataAttributes = {
        connect: attributeConnectIds.length
          ? attributeConnectIds.map((attributeId) => ({
              id: attributeId,
            }))
          : Prisma.skip,
        disconnect: attributeDisconnectIds.length
          ? attributeDisconnectIds.map((attributeId) => ({
              id: attributeId,
            }))
          : Prisma.skip,
      }
    }

    if (isUndefined(body.parentId) || currCategory.parentId === body.parentId) {
      const updated = await prisma.category.update({
        where: { id },
        data: {
          name: body.name ?? Prisma.skip,
          description: body.description ?? Prisma.skip,
          attributes: updateDataAttributes ?? Prisma.skip,
        },
      })

      return OkRes(updated)
    } else {
      const pathIds: string[] = []
      if (body.parentId) {
        const categoryParent = await prisma.category
          .findUniqueOrThrow({
            where: { id: body.parentId },
          })
          .catch(() => {
            throw new NotFoundException()
          })

        const maxDepthOfDescendants =
          await categoryService._findMaxDepthOfDescendants(id)

        const newHeight =
          categoryParent.pathIds.length +
          (maxDepthOfDescendants - currCategory.pathIds.length + 1)
        if (newHeight > categoryService.CATEGORY_TREE_HEIGHT) {
          throw new BadRequestException(
            E_CATEGORY_EXCEPTION.TREE_HEIGHT_EXCEEDED,
          )
        }

        pathIds.push(...categoryParent.pathIds)
      }

      const [, updated] = await prisma.$transaction([
        prisma.$executeRaw`
          UPDATE category
          SET path_ids = array_cat(
            array[${Prisma.raw(pathIds.map((pathId) => `'${pathId}'`).join(','))}]::uuid[],
            path_ids[array_position(path_ids, ${id}::uuid)::int : ])
          WHERE ${id}::uuid = ANY(path_ids)`,

        prisma.category.update({
          where: { id },
          data: {
            parentId: body.parentId,
            name: body.name ?? Prisma.skip,
            description: body.description ?? Prisma.skip,
            attributes: updateDataAttributes ?? Prisma.skip,
          },
        }),
      ])

      return OkRes(updated)
    }
  },

  delete: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    await prisma.category.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException()
    })

    const deleted = await prisma.category.delete({
      where: { id },
    })

    return OkRes(deleted)
  },

  bulk: async ({ body: { ids, type } }: IAdminCtxBody<IBulkCategoryBody>) => {
    switch (type) {
      case E_BULK_CATEGORY_TYPE.DELETE: {
        await prisma.category.deleteMany({
          where: { id: { in: ids } },
        })

        break
      }
    }

    return OkRes(true)
  },

  _findMaxDepthOfDescendants: async (id: string) => {
    const result: { depth: number }[] = await prisma.$queryRaw`
      SELECT array_length(path_ids, 1) as depth
      FROM category
      WHERE path_ids @> array[${id}::uuid]
      ORDER BY depth DESC
      LIMIT 1`

    return result[0].depth
  },
}
