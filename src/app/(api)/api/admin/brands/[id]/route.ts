import { routeExecutor } from '~/server/core'

import { brandService } from '~/server/services/brand.service'

import { UpdateBrandSchema } from '~/server/dto/brand/req'
import {
  adminGuard,
  bodyValidator,
  idParamValidator,
} from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    brandService.getOne,
  )
}

export async function PATCH(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    bodyValidator(UpdateBrandSchema),
    brandService.update,
  )
}

export async function DELETE(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    brandService.delete,
  )
}
