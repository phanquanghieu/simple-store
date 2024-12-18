import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { CreateBrandSchema } from '~/server/dto/brand/req'
import {
  adminGuard,
  bodyValidator,
  listQueryValidator,
} from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard(),
    listQueryValidator(categoryService.GET_SORTABLE_FIELDS),
    categoryService.get,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard(),
    bodyValidator(CreateBrandSchema),
    categoryService.create,
  )
}
