/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty, isNil, isNull, isUndefined } from 'lodash'
import { SafeParseError, z } from 'zod'

import { IErrorValidationRes } from '../dto/_common/res'

export function buildErrorValidationResDetail(error: SafeParseError<object>) {
  const errorFlatten = error.error.flatten()
  return {
    _error: isEmpty(errorFlatten.formErrors)
      ? undefined
      : errorFlatten.formErrors,
    ...errorFlatten.fieldErrors,
  } as IErrorValidationRes['detail']
}

export const zodt = {
  defaultWhenUndefined: (d: any) => (val: unknown) =>
    isUndefined(val) ? d : val,
  defaultWhenNull: (d: any) => (val: unknown) => (isNull(val) ? d : val),
  defaultWhenNil: (d: any) => (val: unknown) => (isNil(val) ? d : val),
  defaultWhenEmpty: (d: any) => (val: unknown) => (isEmpty(val) ? d : val),
}

const errorMap: z.ZodErrorMap = (error, ctx) => {
  return {
    message: `${error.code}#${ctx.defaultError}`,
  }
}

z.setErrorMap(errorMap)

export const zod = z
