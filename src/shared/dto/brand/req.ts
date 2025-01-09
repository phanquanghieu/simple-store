import { Brand } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetBrandQuery extends IListQuery {}

export interface ICreateBrandBody extends Pick<Brand, 'name' | 'description'> {}

export interface IUpdateBrandBody extends Partial<ICreateBrandBody> {}

export enum E_BULK_BRAND_TYPE {
  DELETE = 'DELETE',
}
export interface IBulkBrandBody {
  ids: string[]
  type: E_BULK_BRAND_TYPE
}
