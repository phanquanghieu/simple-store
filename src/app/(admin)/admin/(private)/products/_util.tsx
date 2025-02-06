import { decimal } from '~/shared/libs'

export function calcMargin(cost: string | null, price: string) {
  return cost
    ? decimal.round(
        decimal.mul(decimal.div(decimal.sub(price, cost), price), 100),
        2,
      )
    : ''
}
