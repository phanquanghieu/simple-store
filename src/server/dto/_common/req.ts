import { isArray } from 'lodash'

import { zod, zodt } from '~/shared/libs'

export const IdsQuerySchema = zod.object({
  ids: zod
    .preprocess(zodt.toArray, zod.array(zod.string().uuid()).nonempty())
    .optional(),
})

export const PaginationQuerySchema = zod.object({
  page: zod.coerce.number().positive().default(1),
  size: zod.coerce.number().positive().max(100).default(10),
})

export const SearchQuerySchema = zod.object({
  search: zod
    .string()
    .trim()
    .optional()
    .transform(zodt.defaultWhenEmpty(undefined)),
})

export const SortQuerySchema = (
  sortableFields: string[],
  sortDefaults: string[][] = [['id', 'desc']],
) => {
  return zod.object({
    sort: zod
      .preprocess(
        (val) =>
          (isArray(val) ? val : [val])
            .map((val) => {
              const vals: string[] = val.split(':')
              if (vals[1]) vals[1] = vals[1]?.toLowerCase()
              return vals
            })
            .filter(
              (val) =>
                sortableFields.includes(val[0]) &&
                ['asc', 'desc'].includes(val[1]),
            ),
        zod.array(
          zod.tuple([zod.string(), zod.enum(['asc', 'desc'])], {
            errorMap: () => ({
              message: 'Sort must have format `field:asc`',
            }),
          }),
        ),
      )
      .optional()
      .transform(zodt.defaultWhenUndefined(sortDefaults)),
  })
}

export type ISortQuerySchemaParams = Parameters<typeof SortQuerySchema>

export const ListQuerySchema = (...args: ISortQuerySchemaParams) => {
  return PaginationQuerySchema.merge(SearchQuerySchema).merge(
    SortQuerySchema(...args),
  )
}

export const LiteQuerySchema = (...args: ISortQuerySchemaParams) => {
  return IdsQuerySchema.merge(PaginationQuerySchema)
    .merge(SearchQuerySchema)
    .merge(SortQuerySchema(...args))
}
