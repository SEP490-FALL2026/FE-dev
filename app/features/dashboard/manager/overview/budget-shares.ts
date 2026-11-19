import type { MineResponseDtoDataBudget } from '~/shared/api/generated/model/budgets/mineResponseDtoDataBudget'

export type BudgetMoney = NonNullable<MineResponseDtoDataBudget['total']>
export type BudgetShare = { percent: number; positive: boolean }

function parseAmount(money: BudgetMoney | null) {
  const match = typeof money?.amount === 'string' ? /^(-?)(\d+)(?:\.(\d+))?$/.exec(money.amount) : null
  return match ? { value: BigInt(`${match[1]}${match[2]}${match[3] ?? ''}`), scale: match[3]?.length ?? 0 } : null
}

/** Compare exact decimal integers; only the final, bounded chart proportions become numbers. */
export function calculateBudgetShares(
  total: BudgetMoney | null,
  parts: readonly (BudgetMoney | null)[]
): BudgetShare[] | null {
  const parsed = [total, ...parts].map(parseAmount)
  if (
    !total ||
    !/^[A-Z]{3}$/.test(total.currency) ||
    parts.some((part) => part?.currency !== total.currency) ||
    parsed.some((part) => !part || part.value < 0n)
  )
    return null
  const amounts = parsed.filter((part) => part !== null)
  const scale = Math.max(...amounts.map((part) => part.scale))
  const [totalValue, ...values] = amounts.map((part) => part.value * 10n ** BigInt(scale - part.scale))
  if (totalValue <= 0n || values.reduce((sum, value) => sum + value, 0n) !== totalValue) return null
  return values.map((value) => ({ percent: Number((value * 100000000n) / totalValue) / 1000000, positive: value > 0n }))
}

export function isNegativeBudgetMoney(money: BudgetMoney | null) {
  const parsed = parseAmount(money)
  return !!parsed && parsed.value < 0n
}
