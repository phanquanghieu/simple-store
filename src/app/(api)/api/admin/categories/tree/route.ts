import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { adminGuard } from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(adminGuard, categoryService.getTree)
}
