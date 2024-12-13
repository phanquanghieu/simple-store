import { NextRequest, NextResponse } from 'next/server'

import { INextRouteParams } from '~/shared/interfaces/next'

import { productService } from '~/server/services/product.service'

import { HttpException } from '~/server/common/exceptions/exceptions'
import { ICtx } from '~/server/interfaces/ctx'
import { adminGuard } from '~/server/middlewares/guards/guards'
import {
  validatePaginationQuery,
  validateParam,
} from '~/server/middlewares/validation'

export async function GET(request: NextRequest, params: INextRouteParams) {
  // const id = (await params).id
  console.log(request, params)
  return routeExecutor(
    adminGuard(),
    validateParam(params, ['id']),
    validatePaginationQuery(request),
    productService.getOne,
  )
}

// async function routeExecutor(handler: () => Promise<any>) {
//   try {
//     return await handler()
//   } catch (error: unknown) {
//     if (error instanceof HttpException) {
//       return NextResponse.json(error.getRes(), {
//         status: error.getStatusCode(),
//       })
//     } else {
//       console.error(error)
//       return NextResponse.json(
//         {
//           error: 'InternalServerError',
//           message: 'Internal Server Error',
//         },
//         { status: 500 },
//       )
//     }
//   }
// }

export async function routeExecutor(
  ...middlewareOrHandlers: ((
    ctx: ICtx,
  ) => Promise<NextResponse | void> | NextResponse | void)[]
) {
  const ctx = {} as ICtx

  for (const middlewareOrHandler of middlewareOrHandlers) {
    try {
      const response = await middlewareOrHandler(ctx)
      if (response) {
        return response
      }
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        return NextResponse.json(error.getRes(), {
          status: error.getStatusCode(),
        })
      } else {
        console.error(error)
        return NextResponse.json(HttpException.getRes(), {
          status: HttpException.getStatusCode(),
        })
      }
    }
  }
}

// function routeExecutor(ctx: ICtx) {
//   return async (
//     ...middlewareOrHandlers: ((
//       ctx: ICtx,
//     ) => Promise<NextResponse | void> | NextResponse | void)[]
//   ) => {
//     for (const middleware of middlewareOrHandlers) {
//       try {
//         const response = await middleware(ctx)
//         if (response) {
//           return response
//         }
//       } catch (error: unknown) {
//         if (error instanceof HttpException) {
//           return NextResponse.json(error.getRes(), {
//             status: error.getStatusCode(),
//           })
//         } else {
//           console.error(error)
//           return NextResponse.json(
//             {
//               error: 'InternalServerError',
//               message: 'Internal Server Error',
//             },
//             { status: 500 },
//           )
//         }
//       }
//     }
//   }
// }
