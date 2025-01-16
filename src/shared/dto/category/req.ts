import { Category } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetCategoryQuery extends IListQuery {
  parentId?: string
}

export interface ICreateCategoryBody
  extends Pick<Category, 'parentId' | 'name' | 'description'> {
  attributeIds: string[]
}

export interface IUpdateCategoryBody extends Partial<ICreateCategoryBody> {}

export enum E_BULK_CATEGORY_TYPE {
  CHANGE_PARENT = 'CHANGE_PARENT',
  DELETE = 'DELETE',
}
export interface IBulkCategoryBody {
  ids: string[]
  type: E_BULK_CATEGORY_TYPE
}
