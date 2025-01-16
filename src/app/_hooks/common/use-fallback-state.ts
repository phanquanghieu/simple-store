import { Dispatch, SetStateAction, useCallback, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFallbackState<T = any>(
  stateProp: T | undefined,
  setStateProp: Dispatch<SetStateAction<T>> | undefined,
  defaultValue: T,
) {
  const [stateFallback, setStateFallback] = useState<T>(defaultValue)

  const needFallback = stateProp === undefined
  const state = needFallback ? stateFallback : stateProp

  const setState = useCallback(
    (newValue: SetStateAction<T>) => {
      if (needFallback) {
        setStateFallback(newValue)
      } else {
        setStateProp?.(newValue)
      }
    },
    [needFallback, setStateProp],
  )

  return [state, setState] as const
}
