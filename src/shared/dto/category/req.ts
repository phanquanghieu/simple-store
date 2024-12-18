import { Category } from '@prisma/client'

export interface ICreateCategoryBody
  extends Pick<Category, 'parentId' | 'name' | 'description'> {}

export interface IUpdateCategoryBody extends Partial<ICreateCategoryBody> {}
