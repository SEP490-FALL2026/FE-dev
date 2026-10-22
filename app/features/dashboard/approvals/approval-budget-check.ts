import {
  annualBudgets2026,
  annualTotal,
  budgetChecks,
  saasItems,
  unpaidCommitments,
  usedThisYear,
  type BudgetCheckResult
} from '../finance/annual-budget-data'
import { costCenters } from '../finance/finance-data'
import type { QueueItem } from './approvals-data'

/*
 * Budget check the Spending Approver sees on SaaS spend items (APV-01, APV-02). Amounts are FY2026 borne cost.
 * Remaining = approved annual budget − used this year − committed (approved but not yet paid).
 */

export const budgetCheckResults: readonly BudgetCheckResult[] = [
  'PASSED',
  'INSUFFICIENT',
  'OUT_OF_CATALOG',
  'CC_EXPIRED'
]

export interface BudgetPosition {
  /** Approved FY2026 annual total; null when the Cost Center has no budget or is retired. */
  approved: number | null
  /** Remaining after the item is approved. */
  after: number | null
  /** Remaining before the item. */
  before: number | null
  committed: number
  used: number
}

export function isRetiredCostCenter(code: string) {
  return costCenters.some((center) => center.code === code && center.status === 'RETIRED')
}

export function budgetPosition(costCenter: string, amount: number): BudgetPosition {
  const budget = isRetiredCostCenter(costCenter)
    ? undefined
    : annualBudgets2026.find((item) => item.costCenter === costCenter)
  const approved = budget ? annualTotal(budget) : null
  const used = usedThisYear(costCenter)
  const committed = unpaidCommitments
    .filter((item) => item.costCenter === costCenter)
    .reduce((sum, item) => sum + item.amount, 0)
  const before = approved === null ? null : approved - used - committed

  return { after: before === null ? null : before - amount, approved, before, committed, used }
}

/** Catalog entry of the software behind a queue item, matched by product name or vendor. */
function catalogEntry(item: Pick<QueueItem, 'software'>) {
  return saasItems.find((entry) => item.software.startsWith(entry.name) || item.software.includes(entry.vendor))
}

export function queueBudgetCheck(item: QueueItem): BudgetCheckResult {
  // A request already checked by the system (FIN-08) keeps that result.
  const recorded = budgetChecks.find((check) => check.requestCode === item.reference)
  if (recorded) return recorded.result

  // Spend still booked on a retired Cost Center cannot use any budget.
  if (item.amount > 0 && isRetiredCostCenter(item.costCenter)) return 'CC_EXPIRED'

  // Charges and findings for software not allowed in the catalog are out of catalog.
  if ((item.kind === 'CHARGE' || item.kind === 'FINDING') && catalogEntry(item)?.catalogStatus !== 'IN_CATALOG') {
    return 'OUT_OF_CATALOG'
  }

  // Otherwise compare the amount with what remains of the annual budget; no budget means not enough.
  const { before } = budgetPosition(item.costCenter, item.amount)
  return before !== null && item.amount <= before ? 'PASSED' : 'INSUFFICIENT'
}

export const budgetCheckTones: Record<BudgetCheckResult, 'danger' | 'neutral' | 'success' | 'warning'> = {
  CC_EXPIRED: 'neutral',
  INSUFFICIENT: 'danger',
  OUT_OF_CATALOG: 'warning',
  PASSED: 'success'
}
