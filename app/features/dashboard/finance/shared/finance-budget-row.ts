import type { BudgetTablePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetTablePageResponseDtoDataItemsItem'

type BudgetRow = BudgetTablePageResponseDtoDataItemsItem
type NonNullField<Row, Key extends keyof Row> = Row & { [Field in Key]-?: NonNullable<Row[Field]> }

/** A cost center row that already has a current budget (status ACTIVE): total, base, reserve and remaining are set. */
export type BudgetedRow = NonNullField<BudgetRow, 'total' | 'base' | 'reserve' | 'remaining'>

export function hasBudget(row: BudgetRow): row is BudgetedRow {
  return row.total !== null && row.base !== null && row.reserve !== null && row.remaining !== null
}
