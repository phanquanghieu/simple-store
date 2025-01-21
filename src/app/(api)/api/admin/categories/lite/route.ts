import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { adminGuard, liteQueryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    liteQueryValidator(
      categoryService.GET_LITE_SORTABLE_FIELDS,
      categoryService.GET_LITE_SORT_DEFAULTS,
    ),
    categoryService.getLite,
  )
}
