import {
  allocationLines,
  budgetVsActual,
  costCenters,
  heldRemainders,
  type AllocationLine,
  type InternalCost
} from './finance-data'

/*
 * Period close per Cost Center (FIN-30/31). Each active Cost Center is closed on its own: held remainders
 * that expect no more invoices are released, internal costs are recorded, then Finance closes the line.
 * A remainder that still expects invoices carries over; there is no period lock (QĐ-62m).
 */

export interface CostCenterClosure {
  closedAt: string
  closedBy: string
}

/** The signed-in Finance user of the demo; recorded on each closure. */
export const financeUser = 'Ngọc Lan'

/** CC-SAL had no remainder and no internal cost, so it was closed earlier in the demo period. */
export const initialClosures: Record<string, CostCenterClosure> = {
  'CC-SAL': { closedAt: '2026-10-08T16:20:00+07:00', closedBy: 'Ngọc Lan' }
}

export const closeableCostCenters = costCenters.filter((cc) => cc.status === 'ACTIVE')

export const allocationTotal = (line: AllocationLine) =>
  line.sharedByRatio + line.personalSeats + line.sharedAccounts + line.internal

export type CloseStatus = 'BLOCKED' | 'CLOSED' | 'READY'

/** Released remainders map a remainder id to its release reason. */
export function summarizeCostCenterClose(
  code: string,
  released: Record<string, string>,
  costs: InternalCost[],
  closures: Record<string, CostCenterClosure>
) {
  const remainders = heldRemainders.filter((item) => item.costCenter === code)
  const open = remainders.filter((item) => !released[item.id])
  const toRelease = open.filter((item) => !item.moreInvoicesExpected)
  const carriedOver = open.filter((item) => item.moreInvoicesExpected)
  const internal = costs.filter((cost) => cost.costCenter === code)
  const internalTotal = internal.reduce((sum, cost) => sum + cost.amount, 0)
  const allocation = allocationLines.find((line) => line.costCenter === code)
  // Internal costs recorded on this screen replace the allocation's internal figure.
  const periodCost = allocation ? allocationTotal(allocation) - allocation.internal + internalTotal : internalTotal
  const budget = budgetVsActual.find((line) => line.costCenter === code)?.budget ?? null
  const heldAmount = open.reduce((sum, item) => sum + item.committed - item.invoiced, 0)
  const status: CloseStatus = closures[code] ? 'CLOSED' : toRelease.length > 0 ? 'BLOCKED' : 'READY'

  return { budget, carriedOver, heldAmount, internal, internalTotal, periodCost, remainders, status, toRelease }
}
