'use server'

import { redirect } from 'next/navigation'

import { ZodSchema } from 'zod'

import { IActionState } from '~/shared/dto/common/server-action'
import { buildErrorValidationResDetail, zod } from '~/shared/libs/zod'

import { ILoginRequest, authService } from '~/server/services/auth.service'

const loginRequestSchema: ZodSchema<ILoginRequest> = zod.object({
  username: zod.string().trim().max(50).min(1),
  password: zod.string().trim().max(50).min(1),
})

export async function loginAction(
  prevState: IActionState<ILoginRequest>,
  formData: FormData,
): Promise<IActionState<ILoginRequest>> {
  console.log(prevState, formData)

  const formDataValues = {
    username: formData.get('username'),
    password: formData.get('password'),
  }
  console.log(formData, formDataValues, Object.fromEntries(formData))

  const validationResult = loginRequestSchema.safeParse(
    Object.fromEntries(formData),
  )

  const responseData = {
    ...prevState.data,
    ...validationResult.data,
  }

  if (!validationResult.success) {
    return {
      data: responseData,
      error: 'BadRequest',
      detail: buildErrorValidationResDetail(validationResult),
    }
  }

  try {
    await authService.login(validationResult.data)
  } catch (error) {
    return {
      data: responseData,
      error: 'BadRequest',
      detail: { _error: [(error as Error).message] },
    }
  }

  redirect('/admin')
}
