import type { BudgetTablePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetTablePageResponseDtoDataItemsItem'
import type { CommitmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-commitments/commitmentListResponseDtoDataItemsItem'
import type { VersionResponseDtoDataVersionQuarters } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersionQuarters'

export type OverviewPeriodMode = 'year' | 'quarter' | 'month'
export const overviewPeriodModes: readonly OverviewPeriodMode[] = ['year', 'quarter', 'month']
export const quarterKeys = ['q1', 'q2', 'q3', 'q4'] as const
export type QuarterKey = (typeof quarterKeys)[number]

export interface OverviewPeriod {
  year: number
  mode: OverviewPeriodMode
  /** 1–4, used when mode is `quarter`. */
  quarter: number
  /** 1–12, used when mode is `month`. */
  month: number
}

/** Months (1–12) covered by the selected period. */
export function periodMonths(period: OverviewPeriod): number[] {
  if (period.mode === 'month') return [period.month]
  if (period.mode === 'quarter') return [1, 2, 3].map((offset) => (period.quarter - 1) * 3 + offset)
  return Array.from({ length: 12 }, (_, index) => index + 1)
}

export const quarterOfMonth = (month: number) => Math.ceil(month / 3)

/** Amounts arrive as decimal strings in the reporting currency; charts only need display precision. */
export const toAmount = (value: { amount: string } | null | undefined) => {
  const parsed = Number(value?.amount ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export interface BudgetTotals {
  currency: string | null
  total: number
  committed: number
  spent: number
  remaining: number
  overCommittedCount: number
}

export function budgetTotals(rows: readonly BudgetTablePageResponseDtoDataItemsItem[]): BudgetTotals {
  return rows.reduce<BudgetTotals>(
    (sum, row) => ({
      currency: sum.currency ?? row.total.currency,
      total: sum.total + toAmount(row.total),
      committed: sum.committed + toAmount(row.committed),
      spent: sum.spent + toAmount(row.spent),
      remaining: sum.remaining + toAmount(row.remaining),
      overCommittedCount: sum.overCommittedCount + (row.overCommitted ? 1 : 0)
    }),
    { currency: null, total: 0, committed: 0, spent: 0, remaining: 0, overCommittedCount: 0 }
  )
}

export interface CostCenterRow {
  code: string
  name: string
  total: number
  committed: number
  spent: number
  remaining: number
}

/** Stable order by code, so a cost center keeps its color whatever the totals are. */
export function costCenterRows(rows: readonly BudgetTablePageResponseDtoDataItemsItem[]): CostCenterRow[] {
  return rows
    .map((row) => ({
      code: row.costCenter.code,
      name: row.costCenter.name,
      total: toAmount(row.total),
      committed: toAmount(row.committed),
      spent: toAmount(row.spent),
      remaining: toAmount(row.remaining)
    }))
    .sort((left, right) => left.code.localeCompare(right.code))
}

export interface ShareSlice {
  key: string
  label: string
  value: number
  /** Index into the categorical chart slots; `null` marks the folded "other" slice. */
  slot: number | null
}

/** Budget share per cost center; past the palette size the smallest entries fold into one "other" slice. */
export function budgetShare(rows: readonly CostCenterRow[], slots: number, otherLabel: string): ShareSlice[] {
  const slices = rows
    .filter((row) => row.total > 0)
    .map((row, index) => ({ key: row.code, label: row.name, value: row.total, slot: index }))
  if (slices.length <= slots) return slices
  const kept = [...slices].sort((left, right) => right.value - left.value).slice(0, slots - 1)
  const keptKeys = new Set(kept.map((slice) => slice.key))
  const other = slices.filter((slice) => !keptKeys.has(slice.key)).reduce((sum, slice) => sum + slice.value, 0)
  return [
    ...slices.filter((slice) => keptKeys.has(slice.key)).map((slice, index) => ({ ...slice, slot: index })),
    { key: 'other', label: otherLabel, value: other, slot: null }
  ]
}

export interface MonthPoint {
  month: number
  amount: number
  count: number
  inPeriod: boolean
}

/** Commitments created in each month of the year, flagged against the selected period. */
export function commitmentsByMonth(
  commitments: readonly CommitmentListResponseDtoDataItemsItem[],
  period: OverviewPeriod
): MonthPoint[] {
  const selected = new Set(periodMonths(period))
  const points = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    amount: 0,
    count: 0,
    inPeriod: selected.has(index + 1)
  }))
  for (const commitment of commitments) {
    const created = new Date(commitment.createdAt)
    if (Number.isNaN(created.getTime()) || created.getFullYear() !== period.year) continue
    const point = points[created.getMonth()]
    point.amount += toAmount(commitment.amount)
    point.count += 1
  }
  return points
}

export function sumPeriod(points: readonly MonthPoint[]) {
  return points
    .filter((point) => point.inPeriod)
    .reduce((sum, point) => ({ amount: sum.amount + point.amount, count: sum.count + point.count }), {
      amount: 0,
      count: 0
    })
}

export interface QuarterPoint {
  quarter: QuarterKey
  amount: number
  inPeriod: boolean
}

/** Planned quarterly split summed across versions; versions without a split are counted separately. */
export function plannedQuarters(
  splits: readonly VersionResponseDtoDataVersionQuarters[],
  period: OverviewPeriod
): { points: QuarterPoint[]; withoutSplit: number } {
  const selected = new Set(periodMonths(period).map(quarterOfMonth))
  const points = quarterKeys.map((quarter, index) => ({
    quarter,
    amount: 0,
    inPeriod: selected.has(index + 1)
  }))
  let withoutSplit = 0
  for (const split of splits) {
    if (!split) {
      withoutSplit += 1
      continue
    }
    quarterKeys.forEach((quarter, index) => {
      points[index].amount += toAmount(split[quarter])
    })
  }
  return { points, withoutSplit }
}
