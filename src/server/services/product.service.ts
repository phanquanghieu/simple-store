import {
  IIdParam,
  IListQuery,
  IPaginationQuery,
} from '~/shared/dto/_common/req'

import { OkListRes, OkRes } from '../common'
import { IAdminCtx, IAdminCtxParamQuery, IAdminCtxQuery } from '../core/ctx'
import { prisma } from '../infra/db'

async function get({}: IAdminCtxQuery<IListQuery>) {
  const products = await prisma.product.findMany()

  return OkListRes(products, 100)
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
  GET_SORTABLE_FIELDS: ['id', 'name', 'price', 'createdAt'],
  get,
  getOne,
  create,
}
