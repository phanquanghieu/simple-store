import { routeExecutor } from '~/server/core'

import { brandService } from '~/server/services/brand.service'

import { CreateBrandSchema } from '~/server/dto/brand/req'
import {
  adminGuard,
  bodyValidator,
  listQueryValidator,
} from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    listQueryValidator(brandService.GET_SORTABLE_FIELDS),
    brandService.get,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(CreateBrandSchema),
    brandService.create,
  )
}
