import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { ListQuerySchema } from '~/server/dto/_common/req'
import {
  CreateCategoryBodySchema,
  GetCategoryQuerySchema,
} from '~/server/dto/category/req'
import { adminGuard, bodyValidator, queryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    queryValidator(
      ListQuerySchema(categoryService.GET_SORTABLE_FIELDS).merge(
        GetCategoryQuerySchema,
      ),
    ),
    categoryService.get,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(CreateCategoryBodySchema),
    categoryService.create,
  )
}
