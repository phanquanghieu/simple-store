import { Attribute, Category, Prisma } from '@prisma/client'

import { IAttributeLiteRes } from '../attribute/res'

export class ICategoryLiteRes {
  id: string
  parentId: string | null
  name: string

  constructor(data: Category) {
    this.id = data.id
    this.parentId = data.parentId
    this.name = data.name
  }

  static list(data: Category[]) {
    return data.map((d) => new ICategoryLiteRes(d))
  }
}

type ICategoryResParam = Prisma.CategoryGetPayload<{
  include: { parent: true }
}>
export class ICategoryRes extends ICategoryLiteRes {
  parent: ICategoryLiteRes | null
  description: string
  updatedAt: string
  createdAt: string

  constructor(data: ICategoryResParam) {
    super(data)
    this.parent = data.parent ? new ICategoryLiteRes(data.parent) : null
    this.description = data.description
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: ICategoryResParam[]) {
    return data.map((d) => new ICategoryRes(d))
  }
}

type ICategoryWithChildrenResParam = Category & {
  children?: ICategoryWithChildrenResParam[]
}
export class ICategoryWithChildrenRes extends ICategoryLiteRes {
  children: ICategoryWithChildrenRes[]
  constructor(data: ICategoryWithChildrenResParam) {
    super(data)
    this.children = data.children
      ? ICategoryWithChildrenRes.list(data.children)
      : []
  }

  static list(data: ICategoryWithChildrenResParam[]) {
    return data.map((d) => new ICategoryWithChildrenRes(d))
  }
}

type ICategoryDetailResParam = ICategoryWithChildrenResParam & {
  parent: Category | null
  attributes: Attribute[]
}
export class ICategoryDetailRes extends ICategoryRes {
  attributes: IAttributeLiteRes[]
  children: ICategoryWithChildrenRes[]
  constructor(data: ICategoryDetailResParam) {
    super(data)
    this.attributes = IAttributeLiteRes.list(data.attributes)
    this.children = ICategoryWithChildrenRes.list(data.children ?? [])
  }
}
