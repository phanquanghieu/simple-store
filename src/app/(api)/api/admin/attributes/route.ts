import { routeExecutor } from '~/server/core'

import { attributeService } from '~/server/services/attribute.service'

import { ListQuerySchema } from '~/server/dto/_common/req'
import {
  CreateAttributeBodySchema,
  GetAttributeQuerySchema,
} from '~/server/dto/attribute/req'
import { adminGuard, bodyValidator, queryValidator } from '~/server/middlewares'

export function GET(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    queryValidator(
      ListQuerySchema(attributeService.GET_SORTABLE_FIELDS).merge(
        GetAttributeQuerySchema,
      ),
    ),
    attributeService.get,
  )
}

export async function POST(...args: INextRouteArgs) {
  return routeExecutor(...args)(
    adminGuard,
    bodyValidator(CreateAttributeBodySchema),
    attributeService.create,
  )
}
