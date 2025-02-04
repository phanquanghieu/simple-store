import { routeExecutor } from '~/server/core'

import { categoryService } from '~/server/services/category.service'

import { UpdateCategoryBodySchema } from '~/server/dto/category/req'
import {
  adminGuard,
  bodyValidator,
  idParamValidator,
} from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    categoryService.getOne,
  )
}

export async function PATCH(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    bodyValidator(UpdateCategoryBodySchema),
    categoryService.update,
  )
}

export async function DELETE(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    categoryService.delete,
  )
}
