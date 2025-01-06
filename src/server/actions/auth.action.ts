'use server'

import { redirect } from 'next/navigation'

import { ZodSchema } from 'zod'

import { IActionState } from '~/shared/dto/_common/server-action'
import { ILoginReq } from '~/shared/dto/auth/req'
import { buildErrorValidationResDetail, zod } from '~/shared/libs/zod'

import { authService } from '~/server/services/auth.service'

const loginRequestSchema: ZodSchema<ILoginReq> = zod.object({
  username: zod.string().trim().max(50, 'TOO_LONG').min(1, 'REQUIRED'),
  password: zod.string().trim().max(50, 'TOO_LONG').min(1, 'REQUIRED'),
})

export async function loginAction(
  prevState: IActionState<ILoginReq>,
  formData: FormData,
): Promise<IActionState<ILoginReq>> {
  const validationResult = loginRequestSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!validationResult.success) {
    return {
      data: prevState.data,
      error: 'BadRequest',
      detail: buildErrorValidationResDetail(validationResult),
    }
  }

  try {
    await authService.login(validationResult.data)
  } catch (error) {
    return {
      data: prevState.data,
      error: 'BadRequest',
      detail: { _error: [(error as Error).message] },
    }
  }

  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await authService.logout()
  redirect('/admin/login')
}
