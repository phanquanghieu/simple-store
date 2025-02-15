import { E_ATTRIBUTE_TYPE } from '@prisma/client'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod, zodRegex } from '~/shared/libs'

export const OptionNameSchema = zod
  .string()
  .trim()
  .min(1, E_ZOD_ERROR_CODE.REQUIRED)
  .max(256)
export const OptionKeySchema = zod
  .string()
  .trim()
  .min(1, E_ZOD_ERROR_CODE.REQUIRED)
  .regex(zodRegex.KEY, E_ZOD_ERROR_CODE.KEY_INVALID)
  .max(100)
export const OptionSuperRefine = (
  options: { name: string; key: string }[],
  ctx: z.RefinementCtx,
) => {
  options.forEach((option, index) => {
    const hasSameKey = options.some(
      (o, i) => i !== index && o.key === option.key,
    )
    if (hasSameKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, 'key'],
        message: E_ZOD_ERROR_CODE.UNIQUE,
      })
    }
  })
}

const UpdateAttributeFormSchemaBase = zod.object({
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  key: zod.string(),
  description: zod.string().trim().max(5000),
  updatedAt: zod.string().optional(),
  createdAt: zod.string().optional(),
})

export const UpdateAttributeFormSchema = zod.discriminatedUnion('type', [
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.TEXT),
      options: zod
        .array(
          zod.object({
            id: zod.string().optional(),
            name: OptionNameSchema,
            key: OptionKeySchema,
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(UpdateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.COLOR),
      options: zod
        .array(
          zod.object({
            id: zod.string().optional(),
            name: OptionNameSchema,
            key: OptionKeySchema,
            value: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(7),
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(UpdateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.BOOLEAN),
      options: zod.array(
        zod.object({
          id: zod.string().optional(),
          name: OptionNameSchema,
          key: zod.string(),
        }),
      ),
    })
    .merge(UpdateAttributeFormSchemaBase),
])

export type TUpdateAttributeFormValue = z.infer<
  typeof UpdateAttributeFormSchema
>
export const defaultUpdateAttributeFormValue = {
  name: '',
  key: '',
  description: '',
} as TUpdateAttributeFormValue

const CreateAttributeFormSchemaBase = zod.object({
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  key: zod
    .string()
    .trim()
    .regex(zodRegex.KEY, E_ZOD_ERROR_CODE.KEY_INVALID)
    .min(1, E_ZOD_ERROR_CODE.REQUIRED)
    .max(100),
  description: zod.string().trim().max(5000),
})

export const CreateAttributeFormSchema = zod.discriminatedUnion('type', [
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.TEXT),
      options: zod
        .array(
          zod.object({
            name: OptionNameSchema,
            key: OptionKeySchema,
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(CreateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.COLOR),
      options: zod
        .array(
          zod.object({
            name: OptionNameSchema,
            key: OptionKeySchema,
            value: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(7),
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(CreateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.BOOLEAN),
      options: zod.array(
        zod.object({
          name: OptionNameSchema,
          key: zod.enum(['true', 'false']),
        }),
      ),
    })
    .merge(CreateAttributeFormSchemaBase),
])

export type TCreateAttributeFormValue = z.infer<
  typeof CreateAttributeFormSchema
>
export const defaultCreateAttributeFormValue = {
  name: '',
  key: '',
  description: '',
  type: E_ATTRIBUTE_TYPE.TEXT,
} as TCreateAttributeFormValue
