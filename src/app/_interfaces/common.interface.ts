/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOption<ILabel = string, IValue = any> {
  label: ILabel
  value: IValue
}

export interface IOptionTree<ILabel = string, IValue = any> {
  label: ILabel
  value: IValue
  children?: IOptionTree<ILabel, IValue>[]
}
