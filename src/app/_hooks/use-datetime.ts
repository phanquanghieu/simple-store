import { useFormatter } from 'next-intl'
import { useCallback } from 'react'

export function useDatetime() {
  const { dateTime } = useFormatter()

  const formatDatetime = useCallback(
    (value: string, format: 'datetime' | 'date' = 'datetime') => {
      if (format === 'date') {
        return dateTime(new Date(value), {
          dateStyle: 'short',
        })
      } else {
        return dateTime(new Date(value), {
          dateStyle: 'short',
          timeStyle: 'short',
        })
      }
    },
    [dateTime],
  )
  return { formatDatetime }
}
