import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { BulkProductBodySchema } from '~/server/dto/product/req'
import { adminGuard, bodyValidator } from '~/server/middlewares'

export async function PUT(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(BulkProductBodySchema),
    productService.bulk,
  )
}
