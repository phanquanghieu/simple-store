import { Attribute, E_ATTRIBUTE_TYPE, Prisma } from '@prisma/client'

import { IAttributeOptionRes } from './attribute-option/res'

export enum E_ATTRIBUTE_EXCEPTION {
  KEY_EXISTED = 'KEY_EXISTED',
}

export class IAttributeRes {
  id: string
  name: string
  key: string
  description: string
  type: E_ATTRIBUTE_TYPE
  updatedAt: string
  createdAt: string

  constructor(data: Attribute) {
    this.id = data.id
    this.name = data.name
    this.key = data.key
    this.description = data.description
    this.type = data.type
    this.updatedAt = data.updatedAt.toISOString()
    this.createdAt = data.createdAt.toISOString()
  }

  static list(data: Attribute[]) {
    return data.map((d) => new IAttributeRes(d))
  }
}

type TDetailParam = Prisma.AttributeGetPayload<{
  include: { attributeOptions: true }
}>
export class IAttributeDetailRes extends IAttributeRes {
  options: IAttributeOptionRes[]

  constructor(data: TDetailParam) {
    super(data)
    this.options = IAttributeOptionRes.list(data.attributeOptions)
  }

  static list(data: TDetailParam[]) {
    return data.map((d) => new IAttributeDetailRes(d))
  }
}
