import { routeExecutor } from '~/server/core'

import { brandService } from '~/server/services/brand.service'

import { BulkBrandBodySchema } from '~/server/dto/brand/req'
import { adminGuard, bodyValidator } from '~/server/middlewares'

export async function PUT(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(BulkBrandBodySchema),
    brandService.bulk,
  )
}
