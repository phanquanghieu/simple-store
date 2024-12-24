import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { PaginationQuerySchema } from '~/server/dto/_common/req'
import {
  adminGuard,
  bodyValidator,
  idParamValidator,
  listQueryValidator,
} from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    listQueryValidator(productService.GET_SORTABLE_FIELDS),
    productService.getOne,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    bodyValidator(PaginationQuerySchema),
    productService.create,
  )
}
