import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { PaginationQuerySchema } from '~/server/dto/_common/req'
import {
  adminGuard,
  bodyValidator,
  idParamValidator,
} from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    productService.getDetail,
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

export async function DELETE(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    productService.delete,
  )
}
