import { E_ATTRIBUTE_TYPE } from '@prisma/client'

import { E_BULK_ATTRIBUTE_TYPE } from '~/shared/dto/attribute/req'
import { zod, zodRegex, zodt } from '~/shared/libs/zod'

export const GetAttributeQuerySchema = zod.object({
  type: zod
    .preprocess(
      zodt.toArray,
      zod.array(zod.nativeEnum(E_ATTRIBUTE_TYPE)).nonempty(),
    )
    .optional(),
})

const NameSchema = zod.string().trim().min(1).max(256)
const KeySchema = zod.string().trim().regex(zodRegex.KEY).min(1).max(100)
const DescriptionSchema = zod.string().trim().max(5000)
const OptionValueColorSchema = zod.string().trim().min(1).max(7)

export const CreateAttributeBodySchema = zod.discriminatedUnion('type', [
  zod.object({
    type: zod.literal(E_ATTRIBUTE_TYPE.TEXT),
    name: NameSchema,
    key: KeySchema,
    description: DescriptionSchema,
    options: zod
      .array(
        zod.object({
          name: NameSchema,
          key: KeySchema,
        }),
      )
      .nonempty()
      .max(100),
  }),
  zod.object({
    type: zod.literal(E_ATTRIBUTE_TYPE.COLOR),
    name: NameSchema,
    key: KeySchema,
    description: DescriptionSchema,
    options: zod
      .array(
        zod.object({
          name: NameSchema,
          key: KeySchema,
          value: OptionValueColorSchema,
        }),
      )
      .nonempty()
      .max(100),
  }),
  zod.object({
    type: zod.literal(E_ATTRIBUTE_TYPE.BOOLEAN),
    name: NameSchema,
    key: KeySchema,
    description: DescriptionSchema,
    options: zod
      .array(
        zod.object({
          name: NameSchema,
          key: zod.enum(['true', 'false']),
        }),
      )
      .length(2)
      .refine(
        (options) =>
          options.some((option) => option.key === 'true') &&
          options.some((option) => option.key === 'false'),
      ),
  }),
])

export const UpdateAttributeBodySchema = zod.discriminatedUnion('type', [
  zod.object({
    type: zod.literal(E_ATTRIBUTE_TYPE.TEXT),
    name: NameSchema.optional(),
    description: DescriptionSchema.optional(),
    options: zod
      .array(
        zod.union([
          zod.object({
            id: zod.string().uuid(),
            name: NameSchema.optional(),
          }),
          zod.object({
            id: zod.undefined(),
            name: NameSchema,
            key: KeySchema,
          }),
        ]),
      )
      .nonempty()
      .max(100)
      .optional(),
  }),
  zod.object({
    type: zod.literal(E_ATTRIBUTE_TYPE.COLOR),
    name: NameSchema.optional(),
    description: DescriptionSchema.optional(),
    options: zod
      .array(
        zod.union([
          zod.object({
            id: zod.string().uuid(),
            name: NameSchema.optional(),
            value: OptionValueColorSchema.optional(),
          }),
          zod.object({
            id: zod.undefined(),
            name: NameSchema,
            key: KeySchema,
            value: OptionValueColorSchema,
          }),
        ]),
      )
      .nonempty()
      .max(100)
      .optional(),
  }),
  zod.object({
    type: zod.literal(E_ATTRIBUTE_TYPE.BOOLEAN),
    name: NameSchema.optional(),
    description: DescriptionSchema.optional(),
    options: zod
      .array(
        zod.object({
          id: zod.string().uuid(),
          name: NameSchema.optional(),
          key: zod.enum(['true', 'false']),
        }),
      )
      .length(2)
      .refine(
        (options) =>
          options.some((option) => option.key === 'true') &&
          options.some((option) => option.key === 'false'),
      )
      .optional(),
  }),
])

export const BulkAttributeBodySchema = zod.object({
  ids: zod.array(zod.string().uuid()).min(1),
  type: zod.nativeEnum(E_BULK_ATTRIBUTE_TYPE),
})
