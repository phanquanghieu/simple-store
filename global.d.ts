import { MessageKeys, NestedKeyOf, useTranslations } from 'next-intl'
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

  type TTranslationFn = ReturnType<typeof useTranslations>

  type TTranslationFnKey = Parameters<TTranslationFn>[0]
}
