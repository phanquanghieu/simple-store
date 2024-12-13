import { isArray } from 'lodash'

import { zod, zodt } from '~/shared/libs/zod'

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
  sortDefaults?: string[],
) => {
  return zod.object({
    sort: zod
      .preprocess(
        (val) =>
          (isArray(val) ? val : [val]).map((val) => {
            const vals = val.split(':')
            if (vals[1]) vals[1] = vals[1]?.toLowerCase()
            return vals
          }),
        zod.array(
          zod.tuple(
            [
              zod.string().refine((val) => sortableFields.includes(val), {
                message: `Invalid sort field. Allow ${sortableFields.join(', ')}`,
              }),
              zod.enum(['asc', 'desc']),
            ],
            {
              errorMap: () => ({
                message: 'Sort must have format `field:asc`',
              }),
            },
          ),
        ),
      )
      .optional()
      .default(sortDefaults)
      .transform(zodt.defaultWhenUndefined([['id', 'asc']])),
  })
}

export type ISortQuerySchemaParams = Parameters<typeof SortQuerySchema>

export const ListQuerySchema = (...args: ISortQuerySchemaParams) => {
  return PaginationQuerySchema.merge(SearchQuerySchema).merge(
    SortQuerySchema(...args),
  )
}
