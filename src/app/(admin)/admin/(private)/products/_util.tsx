import { decimal } from '~/shared/libs'

export function calcProfit(cost: string | null, price: string | null) {
  return cost && price ? decimal.sub(price, cost) : ''
}
export function calcMargin(cost: string | null, price: string | null) {
  return cost && price && !decimal.d(price).isZero()
    ? decimal.round(
        decimal.mul(decimal.div(decimal.sub(price, cost), price), 100),
        2,
      )
    : ''
}
