import { IIdParam, IPaginationQuery } from '~/shared/interfaces/api/request'

import { OkPaginationRes, OkRes } from '../common/response'
import { IAdminCtxParamQuery } from '../interfaces/ctx'

async function get() {
  return OkPaginationRes([333], 100)
}

async function getOne({
  param: { id },
  // query: { page, size },
}: IAdminCtxParamQuery<IIdParam, IPaginationQuery>) {
  return OkRes({ id: id, query: {} })
}

export const productService = {
  get,
  getOne,
}
