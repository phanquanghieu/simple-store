// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare interface IFilterDef<IQuery = any> {
  queryField: Extract<keyof IQuery, string>
  dataType: 'string' | 'string[]' | 'number' | 'number[]'
}

declare interface IOption<IValue = string | number> {
  label: string
  value: IValue
}
