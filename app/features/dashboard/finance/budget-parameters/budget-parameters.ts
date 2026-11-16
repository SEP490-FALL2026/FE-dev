import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model/operating-parameters'

/** The three parameters Finance owns; the list endpoint can return more (the Super Admin's), so filter by key. */
export const BUDGET_PARAMETER_KEYS = [
  'BUDGET_RESERVE_DEFAULT_PERCENT',
  'BUDGET_ZBB_KPI3_BELOW_PERCENT',
  'BUDGET_ZBB_PRICE_INCREASE_PERCENT'
] as const

export type BudgetParameter = ParameterListResponseDtoDataItemsItem

export function pickBudgetParameters(items: readonly BudgetParameter[] | undefined): BudgetParameter[] {
  if (!items) return []
  return BUDGET_PARAMETER_KEYS.flatMap((key) => items.filter((item) => item.key === key))
}

/** Integer range of a parameter, or null when its domain is not a plain integer. */
export function intRange(parameter: BudgetParameter): { min: number; max: number } | null {
  return parameter.constraints.kind === 'int'
    ? { min: parameter.constraints.min, max: parameter.constraints.max }
    : null
}

export function isValidParameterValue(raw: string, range: { min: number; max: number }): boolean {
  if (!/^\d+$/.test(raw)) return false
  const value = Number(raw)
  return value >= range.min && value <= range.max
}
