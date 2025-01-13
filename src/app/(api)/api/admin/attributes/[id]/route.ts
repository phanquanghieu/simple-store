import { routeExecutor } from '~/server/core'

import { attributeService } from '~/server/services/attribute.service'

import { UpdateAttributeBodySchema } from '~/server/dto/attribute/req'
import {
  adminGuard,
  bodyValidator,
  idParamValidator,
} from '~/server/middlewares'

export async function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    attributeService.getDetail,
  )
}

export async function PATCH(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    bodyValidator(UpdateAttributeBodySchema),
    attributeService.update,
  )
}

export async function DELETE(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    idParamValidator,
    attributeService.delete,
  )
}
