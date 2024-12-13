export interface IApiOkRes<IRes = object> {
  data: IRes
}

export interface IApiOkPaginationRes<IRes = object> {
  data: IRes[]
  total: number
}

export interface IApiErrorRes<IDetail = object> {
  error: string
  message: string
  detail?: IDetail
}

export interface IApiErrorValidationRes<IReq = object>
  extends IApiErrorRes<Partial<Record<keyof IReq, string | string[]>>> {}
