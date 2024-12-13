import { authService } from '~/server/services/auth.service'

import { ICtx } from '~/server/interfaces/ctx'

export function adminGuard() {
  return async (ctx: ICtx) => {
    try {
      const admin = await authService.verifyJwt()
      ctx.admin = admin
    } catch (error) {
      throw error
    }
  }
}
