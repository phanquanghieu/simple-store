'use server'

import { redirect } from 'next/navigation'

import { IActionState } from '~/shared/interfaces/server-action'
import { ZodSchema, z } from '~/shared/libs/zod'

import { ILoginRequest, authService } from '~/server/services/auth.service'

const loginRequestSchema: ZodSchema<ILoginRequest> = z.object({
  username: z.string().trim().max(50).min(1),
  password: z.string().trim().max(50).min(1),
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
    console.log(
      validationResult.success,
      validationResult.error,
      validationResult.error?.flatten(),
      validationResult.error?.format(),
    )
    return {
      data: responseData,
      detail: validationResult.error?.flatten().fieldErrors,
    }
  }

  try {
    await authService.login(validationResult.data)
  } catch (error) {
    return {
      data: responseData,
      error: (error as Error).message,
    }
  }

  redirect('/admin')
}
