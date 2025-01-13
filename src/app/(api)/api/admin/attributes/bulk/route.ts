import { routeExecutor } from '~/server/core'

import { attributeService } from '~/server/services/attribute.service'

import { BulkAttributeBodySchema } from '~/server/dto/attribute/req'
import { adminGuard, bodyValidator } from '~/server/middlewares'

export async function PUT(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(BulkAttributeBodySchema),
    attributeService.bulk,
  )
}
