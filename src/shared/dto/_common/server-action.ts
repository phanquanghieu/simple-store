export interface IActionState<IData extends object> {
  data: IData
  error?: string
  detail?: Partial<Record<keyof IData, string[]>> & { _error?: string[] }
}
