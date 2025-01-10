import { Brand, Prisma } from '@prisma/client'

import { IProductRes } from '../product/res'

export class IBrandRes {
  id: string
  name: string
  description: string
  updatedAt: string
  createdAt: string

  constructor(data: Brand) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: Brand[]) {
    return data.map((d) => new IBrandRes(d))
  }
}

export class IBrandDetailRes extends IBrandRes {
  products: IProductRes[]

  constructor(
    data: Prisma.BrandGetPayload<{
      include: { products: true }
    }>,
  ) {
    super(data)
    this.products = IProductRes.list(data.products)
  }
}
