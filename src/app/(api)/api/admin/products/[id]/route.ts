import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { UpdateProductBodySchema } from '~/server/dto/product/req'
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

export async function PATCH(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    bodyValidator(UpdateProductBodySchema),
    productService.update,
  )
}

export async function DELETE(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    productService.delete,
  )
}
