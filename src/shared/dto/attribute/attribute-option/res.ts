import { AttributeOption } from '@prisma/client'

export class IAttributeOptionRes {
  id: string
  name: string
  key: string
  value?: string

  constructor(data: AttributeOption) {
    this.id = data.id
    this.name = data.name
    this.key = data.key.split('.')[1]
    this.value = data.value ?? undefined
  }

  static list(data: AttributeOption[]) {
    return data.map((d) => new IAttributeOptionRes(d))
  }
}
