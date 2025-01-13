import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

import { isEqual } from 'lodash'

export function useDeepCompareEffect(
  callback: EffectCallback,
  dependencies: DependencyList,
): void {
  const previousDependenciesRef = useRef<DependencyList | undefined>(undefined)

  useEffect(() => {
    if (!isEqual(previousDependenciesRef.current, dependencies)) {
      callback()
    }

    previousDependenciesRef.current = dependencies
  }, [callback, dependencies])
}
