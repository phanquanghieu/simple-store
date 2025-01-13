import { useRef } from 'react'

import { useDeepCompareEffect } from './use-deep-compare-effect'

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value)

  useDeepCompareEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
