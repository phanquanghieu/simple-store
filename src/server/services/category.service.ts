import { Prisma } from '@prisma/client'
import { isUndefined } from 'lodash'
import { v7 } from 'uuid'

import { IIdParam, IListQuery } from '~/shared/dto/_common/req'
import {
  ICreateCategoryBody,
  IUpdateCategoryBody,
} from '~/shared/dto/category/req'

import {
  BadRequestException,
  NotFoundException,
  OkListRes,
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
    Prisma.CategoryScalarFieldEnum.createdAt,
  ],
  CATEGORY_TREE_HEIGHT: 5,

  get: async ({ query }: IAdminCtxQuery<IListQuery>) => {
    const where: Prisma.CategoryWhereInput = {
      name: { contains: query.search ?? Prisma.skip },
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        ...queryUtil.skipTakeOrder(query),
      }),
      prisma.category.count({ where }),
    ])

    return OkListRes(categories, total)
  },

  getOne: async ({ param: { id } }: IAdminCtxParam<IIdParam>) => {
    const category = await prisma.category
      .findUniqueOrThrow({
        where: { id },
        include: {
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

    return OkRes(category)
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
        throw new BadRequestException('Category tree height exceeded.')
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
      },
    })

    return OkRes(created)
  },

  update: async ({
    param: { id },
    body,
  }: IAdminCtxParamBody<IIdParam, IUpdateCategoryBody>) => {
    const category = await prisma.category
      .findUniqueOrThrow({ where: { id } })
      .catch(() => {
        throw new NotFoundException()
      })

    if (isUndefined(body.parentId) || category.parentId === body.parentId) {
      const updated = await prisma.category.update({
        where: { id },
        data: {
          name: body.name ?? Prisma.skip,
          description: body.description ?? Prisma.skip,
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
          await categoryService._findMaxDepthOfDescendants(category.id)

        const newHeight =
          categoryParent.pathIds.length +
          (maxDepthOfDescendants - category.pathIds.length + 1)
        if (newHeight > categoryService.CATEGORY_TREE_HEIGHT) {
          throw new BadRequestException('Category tree height exceeded.')
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
