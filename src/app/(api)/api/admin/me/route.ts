import { routeExecutor } from '~/server/core'

import { adminService } from '~/server/services/admin.service'

import { adminGuard } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(adminGuard, adminService.me)
}
