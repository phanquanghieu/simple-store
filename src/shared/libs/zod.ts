/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isEmpty, isNil, isNull, isUndefined } from 'lodash'
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
  toArray: <T>(val: T | T[]): T[] => (isArray(val) ? val : [val]),
  defaultWhenUndefined: (d: any) => (val: unknown) =>
    isUndefined(val) ? d : val,
  defaultWhenNull: (d: any) => (val: unknown) => (isNull(val) ? d : val),
  defaultWhenNil: (d: any) => (val: unknown) => (isNil(val) ? d : val),
  defaultWhenEmpty: (d: any) => (val: unknown) => (isEmpty(val) ? d : val),
}

export const zodRegex = {
  KEY: /^[a-z0-9_]+$/,
  MONEY: /^\d+(\.\d{1,3})?$/,
}

export enum E_ZOD_ERROR_CODE {
  REQUIRED = 'REQUIRED',
  KEY_INVALID = 'KEY_INVALID',
  UNIQUE = 'UNIQUE',
  TOO_BIG = 'TOO_BIG',
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
  TOO_SMALL = 'TOO_SMALL',
}

const errorMap: z.ZodErrorMap = (error, ctx) => {
  let message = error.message ?? ctx.defaultError

  if (error.code === 'too_small') {
    if (error.type === 'number' || error.type === 'bigint') {
      message = `${E_ZOD_ERROR_CODE.TOO_SMALL}#${error.minimum}`
    } else {
      message = `${E_ZOD_ERROR_CODE.TOO_SHORT}#${error.minimum}`
    }
  }
  if (error.code === 'too_big') {
    if (error.type === 'number' || error.type === 'bigint') {
      message = `${E_ZOD_ERROR_CODE.TOO_BIG}#${error.maximum}`
    } else {
      message = `${E_ZOD_ERROR_CODE.TOO_LONG}#${error.maximum}`
    }
  }

  return { message }
}

z.setErrorMap(errorMap)

export const zod = z
