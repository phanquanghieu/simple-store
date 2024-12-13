/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface INextRouteParams<IParam = object> {
  params: Promise<IParam>
}

declare type INextRouteArgs = [any, INextRouteParams] //  [NextRequest, INextRouteParams]
