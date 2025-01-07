import { useMemo } from 'react'

import { ThrottleSettings, defaults, throttle } from 'lodash'
import { useUnmount } from 'usehooks-ts'

import { useCallbackRef } from './use-callback-ref'

export function useThrottledCallback<
  T extends (...args: never[]) => ReturnType<T>,
>(callback: T | undefined, wait?: number, settings?: ThrottleSettings) {
  const callbackRef = useCallbackRef(callback)

  const throttledCallback = useMemo(() => {
    return throttle(callbackRef, wait, defaults(settings, { trailing: false }))
  }, [callbackRef, wait, settings])

  useUnmount(() => {
    throttledCallback.cancel()
  })

  return throttledCallback
}
