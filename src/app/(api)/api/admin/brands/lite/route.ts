import { routeExecutor } from '~/server/core'

import { brandService } from '~/server/services/brand.service'

import { adminGuard, liteQueryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    liteQueryValidator(
      brandService.GET_LITE_SORTABLE_FIELDS,
      brandService.GET_LITE_SORT_DEFAULTS,
    ),
    brandService.getLite,
  )
}
