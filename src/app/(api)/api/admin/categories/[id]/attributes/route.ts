import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { adminGuard, idParamValidator } from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    categoryService.getAttributes,
  )
}
