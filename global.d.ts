/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace JSX {
  export import Element = React.JSX.Element
}

declare interface INextRouteParams<IParam = object> {
  params: Promise<IParam>
}

declare type INextRouteArgs = [any, INextRouteParams] //  [NextRequest, INextRouteParams]
