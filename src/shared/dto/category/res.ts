import { Attribute, Category, Prisma } from '@prisma/client'

import { IAttributeLiteRes } from '../attribute/res'

export enum E_CATEGORY_EXCEPTION {
  TREE_HEIGHT_EXCEEDED = 'TREE_HEIGHT_EXCEEDED',
}

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

type ICategoryLiteTreeResParam = Category & {
  children?: ICategoryLiteTreeResParam[]
}
export class ICategoryLiteTreeRes extends ICategoryLiteRes {
  children: ICategoryLiteTreeRes[]
  constructor(data: ICategoryLiteTreeResParam) {
    super(data)
    this.children = data.children
      ? ICategoryLiteTreeRes.list(data.children)
      : []
  }

  static list(data: ICategoryLiteTreeResParam[]) {
    return data.map((d) => new ICategoryLiteTreeRes(d))
  }
}

type ICategoryDetailResParam = ICategoryLiteTreeResParam & {
  parent: Category | null
  attributes: Attribute[]
}
export class ICategoryDetailRes extends ICategoryRes {
  attributes: IAttributeLiteRes[]
  children: ICategoryLiteTreeRes[]
  constructor(data: ICategoryDetailResParam) {
    super(data)
    this.attributes = IAttributeLiteRes.list(data.attributes)
    this.children = ICategoryLiteTreeRes.list(data.children ?? [])
  }
}
