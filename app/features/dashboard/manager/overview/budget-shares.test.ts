import { expect, it } from 'vitest'
import { calculateBudgetShares, isNegativeBudgetMoney } from './budget-shares'

const money = (amount: string, currency = 'VND') => ({ amount, currency })

it('uses the total budget as the common denominator for all activity slices', () => {
  const shares = calculateBudgetShares(money('660000000'), [
    money('0'),
    money('6540000'),
    money('3816000'),
    money('649644000')
  ])
  expect(shares?.map((share) => share.percent)).toEqual([0, 0.990909, 0.578181, 98.430909])
  expect(shares?.[0].positive).toBe(false)
})

it('compares cents exactly beyond Number.MAX_SAFE_INTEGER', () => {
  const total = money('9007199254740993.25')
  expect(calculateBudgetShares(total, [money('9007199254740993.24'), money('0.01')])?.[1]).toEqual({
    percent: 0,
    positive: true
  })
  expect(calculateBudgetShares(total, [money('9007199254740993.24'), money('0.02')])).toBeNull()
})

it.each([
  { total: null, parts: [money('10')] },
  { total: money('0'), parts: [money('0')] },
  { total: money('10'), parts: [null] },
  { total: money('10'), parts: [money('10', 'USD')] },
  { total: money('10'), parts: [money('9')] },
  { total: money('10'), parts: [money('11'), money('-1')] },
  { total: money('invalid'), parts: [money('10')] },
  { total: money('10'), parts: [money('1e1')] }
])('does not draw a misleading proportion for invalid or incomparable figures: %j', ({ total, parts }) => {
  expect(calculateBudgetShares(total, parts)).toBeNull()
})

it('recognizes a negative fractional balance without treating negative zero as overspending', () => {
  expect(isNegativeBudgetMoney(money('-0.25'))).toBe(true)
  expect(isNegativeBudgetMoney(money('-0.00'))).toBe(false)
})
