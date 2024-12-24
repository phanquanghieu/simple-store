import { ICtx } from '~/server/core/ctx'

import { authService } from '~/server/services/auth.service'

export async function adminGuard(ctx: ICtx) {
  try {
    const admin = await authService.verifyJwt()
    ctx.admin = admin
  } catch (error) {
    throw error
  }
}
