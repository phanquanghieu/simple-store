export interface IOkRes<IRes = object> {
  data: IRes
}

export interface IOkListRes<IRes = object> {
  data: IRes[]
  total: number
}

export interface IOkLiteRes<IRes = object> {
  data: IRes[]
}

export interface IErrorRes<IDetail = object> {
  error: string
  message: string
  detail?: IDetail
}

export interface IErrorValidationRes<IData = object>
  extends IErrorRes<
    Partial<Record<keyof IData, string[]>> & { _error?: string[] }
  > {}
