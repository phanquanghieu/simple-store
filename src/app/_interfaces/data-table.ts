// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IFilterDef<IQuery = any> = {
  queryField: Extract<keyof IQuery, string>
  dataType: 'string' | 'string[]' | 'number' | 'number[]'
}

export enum E_COLUMN_ID {
  SELECT = 'SELECT',
  ACTION = 'ACTION',
}

export interface IBulkActionDef {
  name: string
  type: string
}
