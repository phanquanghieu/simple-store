import { routeExecutor } from '~/server/core'

import { productService } from '~/server/services/product.service'

import { ListQuerySchema } from '~/server/dto/_common/req'
import {
  CreateProductBodySchema,
  GetProductQuerySchema,
} from '~/server/dto/product/req'
import { adminGuard, bodyValidator, queryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    queryValidator(
      ListQuerySchema(
        productService.GET_SORTABLE_FIELDS,
        productService.GET_SORT_DEFAULTS,
      ).merge(GetProductQuerySchema),
    ),
    productService.get,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(CreateProductBodySchema),
    productService.create,
  )
}
