import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { BulkCategoryBodySchema } from '~/server/dto/category/req'
import { adminGuard, bodyValidator } from '~/server/middlewares'

export async function PUT(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(BulkCategoryBodySchema),
    categoryService.bulk,
  )
}
