import { useMemo } from 'react'

import { DebounceSettings, debounce } from 'lodash'
import { useUnmount } from 'usehooks-ts'

import { useCallbackRef } from './use-callback-ref'

export function useDebouncedCallback<
  T extends (...args: never[]) => ReturnType<T>,
>(callback: T, delay: number, settings?: DebounceSettings) {
  const callbackRef = useCallbackRef(callback)

  const debouncedCallback = useMemo(() => {
    return debounce(callbackRef, delay, settings)
  }, [callbackRef, delay, settings])

  useUnmount(() => {
    debouncedCallback.cancel()
  })

  return debouncedCallback
}
