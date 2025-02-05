import { E_PRODUCT_STATUS, Prisma } from '@prisma/client'
import { v7 } from 'uuid'

import { IIdParam } from '~/shared/dto/_common/req'
import {
  E_BULK_PRODUCT_TYPE,
  IBulkProductBody,
  ICreateProductBody,
  IGetProductQuery,
} from '~/shared/dto/product/req'
import { IProductDetailRes, IProductRes } from '~/shared/dto/product/res'

import { NotFoundException, OkListRes, OkRes, queryUtil } from '../common'
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
    const id = v7()
    const createData: Prisma.ProductCreateInput = {
      id,
      category: {
        connect: body.categoryId ? { id: body.categoryId } : Prisma.skip,
      },
      brand: {
        connect: body.brandId ? { id: body.brandId } : Prisma.skip,
      },
      productAttributes: {
        create: body.attributes.length
          ? body.attributes.map((attribute, index) => ({
              attributeId: attribute.id,
              position: index + 1,
              productAttributeOptions: {
                create: attribute.optionIds.map((optionId, index) => ({
                  productId: id,
                  attributeOptionId: optionId,
                  position: index + 1,
                })),
              },
            }))
          : Prisma.skip,
      },
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      compareAtPrice: body.compareAtPrice,
      // cost: body.cost,
      status: body.status,
      totalVariants: body.hasVariants ? body.variants!.length : 1,
    }

    if (body.hasVariants) {
      createData.variantAttribute1 = {
        connect: body.variantAttributeIds![0]
          ? { id: body.variantAttributeIds![0] }
          : Prisma.skip,
      }
      createData.variantAttribute2 = {
        connect: body.variantAttributeIds![1]
          ? { id: body.variantAttributeIds![1] }
          : Prisma.skip,
      }
      createData.variantAttribute3 = {
        connect: body.variantAttributeIds![2]
          ? { id: body.variantAttributeIds![2] }
          : Prisma.skip,
      }
      createData.productVariants = {
        create: body.variants!.map((variant, index) => {
          const productVariantId = v7()
          return {
            id: productVariantId,
            variantAttributeOption1: {
              connect: variant.attributeOptionIds[0]
                ? { id: variant.attributeOptionIds[0] }
                : Prisma.skip,
            },
            variantAttributeOption2: {
              connect: variant.attributeOptionIds[1]
                ? { id: variant.attributeOptionIds[1] }
                : Prisma.skip,
            },
            variantAttributeOption3: {
              connect: variant.attributeOptionIds[2]
                ? { id: variant.attributeOptionIds[2] }
                : Prisma.skip,
            },
            inventory: {
              create: {
                productVariantId,
                sku: variant.sku,
                quantityAvailable: 0,
                quantityUnavailable: 0,
                quantityCommitted: 0,
                quantityTotal: 0,
              },
            },
            sku: variant.sku,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            cost: variant.cost,
            position: index + 1,
          }
        }),
      }
    } else {
      const productVariantId = v7()
      createData.productVariants = {
        create: {
          id: productVariantId,
          inventory: {
            create: {
              productVariantId,
              sku: null,
              quantityAvailable: 0,
              quantityUnavailable: 0,
              quantityCommitted: 0,
              quantityTotal: 0,
            },
          },
          sku: null,
          price: body.price,
          compareAtPrice: body.compareAtPrice,
          cost: body.cost,
          position: 1,
        },
      }
    }

    await prisma.product.create({
      data: createData,
    })

    return OkRes(true)
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
