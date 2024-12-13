import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { listQueryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    // adminGuard(),
    listQueryValidator(productService.GET_SORTABLE_FIELDS),
    productService.get,
  )
}
