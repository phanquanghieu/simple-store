import { routeExecutor } from '~/server/core'

import { attributeService } from '~/server/services/attribute.service'

import { adminGuard, liteQueryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    liteQueryValidator(attributeService.GET_LITE_SORTABLE_FIELDS),
    attributeService.getLite,
  )
}
