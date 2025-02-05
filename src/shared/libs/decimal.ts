import Decimal from 'decimal.js'
import { isEmpty, isNumber, isString, map } from 'lodash'

export const decimal = {
  d: Decimal,
  sumBy<T>(collection: T[], property: keyof T) {
    const numbers = map(collection, property).filter(
      (x) => isNumber(x) || isString(x),
    ) as Decimal.Value[]
    if (isEmpty(numbers)) return 0
    return Decimal.sum(...numbers).toString()
  },
  sum(...args: Parameters<typeof Decimal.sum>) {
    return Decimal.sum(...args).toString()
  },
  add(...args: Parameters<typeof Decimal.add>) {
    return Decimal.add(...args).toString()
  },
  sub(...args: Parameters<typeof Decimal.sub>) {
    return Decimal.sub(...args).toString()
  },
  mul(...args: Parameters<typeof Decimal.mul>) {
    return Decimal.mul(...args).toString()
  },
  div(...args: Parameters<typeof Decimal.div>) {
    return Decimal.div(...args).toString()
  },
  round(number: Decimal.Value, scale: number) {
    return new Decimal(number).toDecimalPlaces(scale).toString()
  },
}
