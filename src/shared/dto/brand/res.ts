import { Brand } from '@prisma/client'

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
