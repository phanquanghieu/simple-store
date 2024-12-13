import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { PaginationQuerySchema } from '~/server/dto/common/req'
import {
  adminGuard,
  bodyValidator,
  idParamValidator,
  listQueryValidator,
  paginationQueryValidator,
} from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    // adminGuard(),
    idParamValidator(),
    listQueryValidator(productService.GET_SORTABLE_FIELDS),
    paginationQueryValidator(),
    productService.getOne,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard(),
    idParamValidator(),
    paginationQueryValidator(),
    bodyValidator(PaginationQuerySchema),
    productService.create,
  )
}
