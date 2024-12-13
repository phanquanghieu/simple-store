import { IIdParam, IListQuery, IPaginationQuery } from '~/shared/dto/common/req'

import { OkListRes, OkRes } from '../common/response/response'
import { IAdminCtx, IAdminCtxParamQuery, IAdminCtxQuery } from '../core/ctx'

async function get({ query }: IAdminCtxQuery<IListQuery>) {
  // const r: ProductRes[] = [{ id: '1', name: '1', price: 1, salePrice: 1 }]
  return OkListRes([query], 100)
}

async function getOne({
  param,
  query,
}: IAdminCtxParamQuery<IIdParam, IPaginationQuery>) {
  return OkRes({ id: param, query })
}

async function create({
  param,
  query,
  body,
}: IAdminCtx<IIdParam, IPaginationQuery>) {
  return OkRes({ param, query, body })
}

export const productService = {
  GET_SORTABLE_FIELDS: ['name', 'price', 'salePrice'],
  get,
  getOne,
  create,
}
