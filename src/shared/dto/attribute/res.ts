import { Attribute, E_ATTRIBUTE_TYPE, Prisma } from '@prisma/client'

import { IAttributeOptionRes } from './attribute-option/res'

export enum E_ATTRIBUTE_EXCEPTION {
  KEY_EXISTED = 'KEY_EXISTED',
}

export class IAttributeLiteRes {
  id: string
  name: string
  key: string
  type: E_ATTRIBUTE_TYPE

  constructor(data: Attribute) {
    this.id = data.id
    this.name = data.name
    this.key = data.key
    this.type = data.type
  }

  static list(data: Attribute[]) {
    return data.map((d) => new IAttributeLiteRes(d))
  }
}

type IAttributeLiteWithOptionsResParam = Prisma.AttributeGetPayload<{
  include: { attributeOptions: true }
}>
export class IAttributeLiteWithOptionsRes extends IAttributeLiteRes {
  options: IAttributeOptionRes[]

  constructor(data: IAttributeLiteWithOptionsResParam) {
    super(data)
    this.options = IAttributeOptionRes.list(data.attributeOptions)
  }

  static list(data: IAttributeLiteWithOptionsResParam[]) {
    return data.map((d) => new IAttributeLiteWithOptionsRes(d))
  }
}

export class IAttributeRes extends IAttributeLiteRes {
  description: string
  updatedAt: string
  createdAt: string

  constructor(data: Attribute) {
    super(data)
    this.description = data.description
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: Attribute[]) {
    return data.map((d) => new IAttributeRes(d))
  }
}

type IAttributeDetailResParam = Prisma.AttributeGetPayload<{
  include: { attributeOptions: true }
}>
export class IAttributeDetailRes extends IAttributeRes {
  options: IAttributeOptionRes[]

  constructor(data: IAttributeDetailResParam) {
    super(data)
    this.options = IAttributeOptionRes.list(data.attributeOptions)
  }

  static list(data: IAttributeDetailResParam[]) {
    return data.map((d) => new IAttributeDetailRes(d))
  }
}
