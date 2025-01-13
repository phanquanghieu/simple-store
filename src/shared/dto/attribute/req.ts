import { Attribute, E_ATTRIBUTE_TYPE } from '@prisma/client'

import { IListQuery } from '../_common/req'

export interface IGetAttributeQuery extends IListQuery {
  type?: E_ATTRIBUTE_TYPE[]
}

export interface ICreateAttributeBody
  extends Pick<Attribute, 'name' | 'key' | 'description' | 'type'> {
  options: {
    name: string
    key: string
    value?: string
  }[]
}

export interface IUpdateAttributeBody {
  type: E_ATTRIBUTE_TYPE
  name?: string
  description?: string
  options: {
    id?: string
    name?: string
    key?: string
    value?: string
  }[]
}

export enum E_BULK_ATTRIBUTE_TYPE {
  DELETE = 'DELETE',
}
export interface IBulkAttributeBody {
  ids: string[]
  type: E_BULK_ATTRIBUTE_TYPE
}
