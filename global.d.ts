import { MessageKeys, NestedKeyOf } from 'next-intl'
import { NextRequest } from 'next/server'

import en from './messages/en.json'

declare global {
  interface INextRouteParams<IParam = object> {
    params: Promise<IParam>
  }

  type INextRouteArgs = [NextRequest, INextRouteParams]

  type TMessages = typeof en

  interface IntlMessages extends TMessages {}

  type TMessageKey = MessageKeys<IntlMessages, NestedKeyOf<TMessages>>
}
