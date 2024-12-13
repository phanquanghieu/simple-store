import { type NextRequest } from 'next/server'

import { INextRouteParams } from '~/shared/interfaces/next'

import { productService } from '~/server/services/product.service'

import { adminGuard } from '~/server/middlewares/guards/guards'
import {
  validatePaginationQuery,
  validateParam,
} from '~/server/middlewares/validation'

import { routeExecutor } from '../route'

export async function GET(request: NextRequest, params: INextRouteParams) {
  return routeExecutor(
    adminGuard(),
    validateParam(params, ['id']),
    validatePaginationQuery(request),
    productService.getOne,
  )
}
