import { E_PRODUCT_STATUS, Prisma } from '@prisma/client'
import { difference } from 'lodash'
import { v7 } from 'uuid'

import { IIdParam } from '~/shared/dto/_common/req'
import {
  E_BULK_PRODUCT_TYPE,
  IBulkProductBody,
  ICreateProductBody,
  IGetProductQuery,
  IUpdateProductBody,
} from '~/shared/dto/product/req'
import {
  E_PRODUCT_EXCEPTION,
  IProductDetailRes,
  IProductRes,
} from '~/shared/dto/product/res'

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
      .findUniqueOrThrow({
        where: { id },
        include: {
          brand: true,
          category: true,
          productAttributes: {
            include: {
              attribute: {
                include: {
                  attributeOptions: {
                    orderBy: { position: 'asc' },
                  },
                },
              },
              productAttributeOptions: {
                orderBy: { position: 'asc' },
              },
            },
            orderBy: { position: 'asc' },
          },
          productVariants: {
            include: {
              variantAttributeOption1: true,
              variantAttributeOption2: true,
              variantAttributeOption3: true,
            },
            orderBy: { position: 'asc' },
          },
          variantAttribute1: true,
          variantAttribute2: true,
          variantAttribute3: true,
        },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    return OkRes(new IProductDetailRes(product))
  },

  create: async ({ body }: IAdminCtxBody<ICreateProductBody>) => {
    const isSlugExisted = !!(await prisma.product.findUnique({
      where: { slug: body.slug },
      select: { id: true },
    }))
    if (isSlugExisted) {
      throw new BadRequestException(E_PRODUCT_EXCEPTION.SLUG_EXISTED)
    }

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
      sku: body.sku,
      description: body.description,
      price: body.price,
      compareAtPrice: body.compareAtPrice,
      cost: body.cost,
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
        create: body.variants!.map((variant, index) => ({
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
        })),
      }
    } else {
      createData.productVariants = {
        create: {
          inventory: {
            create: {
              sku: body.sku,
              quantityAvailable: 0,
              quantityUnavailable: 0,
              quantityCommitted: 0,
              quantityTotal: 0,
            },
          },
          sku: body.sku,
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

  update: async ({
    param: { id },
    body,
  }: IAdminCtxParamBody<IIdParam, IUpdateProductBody>) => {
    const currProduct = await prisma.product
      .findUniqueOrThrow({
        where: { id },
        include: {
          productVariants: true,
        },
      })
      .catch(() => {
        throw new NotFoundException()
      })

    if (body.slug !== currProduct.slug) {
      const isSlugExisted = !!(await prisma.product.findFirst({
        where: { id: { not: id }, slug: body.slug },
        select: { id: true },
      }))
      if (isSlugExisted) {
        throw new BadRequestException(E_PRODUCT_EXCEPTION.SLUG_EXISTED)
      }
    }

    const updateData: Prisma.ProductUpdateInput = {
      category: {
        disconnect: body.categoryId === null ? true : Prisma.skip,
        connect: body.categoryId ? { id: body.categoryId } : Prisma.skip,
      },
      brand: {
        disconnect: body.brandId === null ? true : Prisma.skip,
        connect: body.brandId ? { id: body.brandId } : Prisma.skip,
      },
      productAttributes: {
        deleteMany: {},
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
      sku: body.sku,
      description: body.description,
      price: body.price,
      compareAtPrice: body.compareAtPrice,
      cost: body.cost,
      status: body.status,
      totalVariants: body.hasVariants ? body.variants!.length : 1,
    }

    const currProductHasVariants = currProduct.totalVariants > 1
    if (currProductHasVariants && body.hasVariants) {
      updateData.variantAttribute1 = {
        disconnect: !body.variantAttributeIds?.[0] ? true : Prisma.skip,
        connect: body.variantAttributeIds?.[0]
          ? { id: body.variantAttributeIds?.[0] }
          : Prisma.skip,
      }
      updateData.variantAttribute2 = {
        disconnect: !body.variantAttributeIds?.[1] ? true : Prisma.skip,
        connect: body.variantAttributeIds?.[1]
          ? { id: body.variantAttributeIds?.[1] }
          : Prisma.skip,
      }
      updateData.variantAttribute3 = {
        disconnect: !body.variantAttributeIds?.[2] ? true : Prisma.skip,
        connect: body.variantAttributeIds?.[2]
          ? { id: body.variantAttributeIds?.[2] }
          : Prisma.skip,
      }

      const productVariants = body.variants!.map((variant, index) => ({
        ...variant,
        position: index + 1,
      }))

      const productVariantCreates = productVariants.filter((x) => !x.id)

      const productVariantUpdates = productVariants.filter((x) => !!x.id)

      const productVariantDeleteIds = difference(
        currProduct.productVariants.map((x) => x.id),
        productVariantUpdates.map((x) => x.id),
      )

      updateData.productVariants = {
        delete: productVariantDeleteIds.length
          ? productVariantDeleteIds.map((id) => ({ id }))
          : Prisma.skip,
        create: productVariantCreates.length
          ? productVariantCreates.map((variant) => ({
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
              position: variant.position,
            }))
          : Prisma.skip,
        update: productVariantUpdates.length
          ? productVariantUpdates.map((variant) => ({
              where: { id: variant.id! },
              data: {
                variantAttributeOption1: {
                  disconnect: !variant.attributeOptionIds[0]
                    ? true
                    : Prisma.skip,
                  connect: variant.attributeOptionIds[0]
                    ? { id: variant.attributeOptionIds[0] }
                    : Prisma.skip,
                },
                variantAttributeOption2: {
                  disconnect: !variant.attributeOptionIds[1]
                    ? true
                    : Prisma.skip,
                  connect: variant.attributeOptionIds[1]
                    ? { id: variant.attributeOptionIds[1] }
                    : Prisma.skip,
                },
                variantAttributeOption3: {
                  disconnect: !variant.attributeOptionIds[2]
                    ? true
                    : Prisma.skip,
                  connect: variant.attributeOptionIds[2]
                    ? { id: variant.attributeOptionIds[2] }
                    : Prisma.skip,
                },
                inventory: {
                  update: {
                    sku: variant.sku,
                  },
                },
                sku: variant.sku,
                price: variant.price,
                compareAtPrice: variant.compareAtPrice,
                cost: variant.cost,
                position: variant.position,
              },
            }))
          : Prisma.skip,
      }
    }
    if (currProductHasVariants && !body.hasVariants) {
      updateData.variantAttribute1 = {
        disconnect: true,
      }
      updateData.variantAttribute2 = {
        disconnect: true,
      }
      updateData.variantAttribute3 = {
        disconnect: true,
      }

      updateData.productVariants = {
        deleteMany: {},
        create: {
          inventory: {
            create: {
              sku: body.sku,
              quantityAvailable: 0,
              quantityUnavailable: 0,
              quantityCommitted: 0,
              quantityTotal: 0,
            },
          },
          sku: body.sku,
          price: body.price,
          compareAtPrice: body.compareAtPrice,
          cost: body.cost,
          position: 1,
        },
      }
    }
    if (!currProductHasVariants && body.hasVariants) {
      updateData.variantAttribute1 = {
        connect: body.variantAttributeIds?.[0]
          ? { id: body.variantAttributeIds?.[0] }
          : Prisma.skip,
      }
      updateData.variantAttribute2 = {
        connect: body.variantAttributeIds?.[1]
          ? { id: body.variantAttributeIds?.[1] }
          : Prisma.skip,
      }
      updateData.variantAttribute3 = {
        connect: body.variantAttributeIds?.[2]
          ? { id: body.variantAttributeIds?.[2] }
          : Prisma.skip,
      }

      updateData.productVariants = {
        deleteMany: {},
        create: body.variants!.map((variant, index) => ({
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
        })),
      }
    }
    if (!currProductHasVariants && !body.hasVariants) {
      updateData.productVariants = {
        update: {
          where: {
            id: currProduct.productVariants[0].id,
          },
          data: {
            inventory: {
              update: {
                sku: body.sku,
              },
            },
            sku: body.sku,
            price: body.price,
            compareAtPrice: body.compareAtPrice,
            cost: body.cost,
          },
        },
      }
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
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
