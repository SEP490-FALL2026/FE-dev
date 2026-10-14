import { budgetYear, currentMonth, type MonthlyBudgetLine } from './finance-data'

export type PeriodGranularity = 'MONTH' | 'QUARTER' | 'YEAR'
export type PeriodTiming = 'CURRENT' | 'FUTURE' | 'PAST'

export interface BudgetPeriod {
  granularity: PeriodGranularity
  /** `2026-10`, `Q4-2026` or `2026`. */
  key: string
  months: string[]
  /** Month or quarter number; the year for a YEAR period. */
  number: number
  year: number
}

export const granularities: readonly PeriodGranularity[] = ['MONTH', 'QUARTER', 'YEAR']

export const yearMonths = Array.from(
  { length: 12 },
  (_, index) => `${budgetYear}-${String(index + 1).padStart(2, '0')}`
)

export function listPeriods(granularity: PeriodGranularity): BudgetPeriod[] {
  if (granularity === 'MONTH') {
    return yearMonths.map((month, index) => ({
      granularity,
      key: month,
      months: [month],
      number: index + 1,
      year: budgetYear
    }))
  }
  if (granularity === 'QUARTER') {
    return [1, 2, 3, 4].map((quarter) => ({
      granularity,
      key: `Q${quarter}-${budgetYear}`,
      months: yearMonths.slice((quarter - 1) * 3, quarter * 3),
      number: quarter,
      year: budgetYear
    }))
  }
  return [{ granularity, key: String(budgetYear), months: yearMonths, number: budgetYear, year: budgetYear }]
}

export function currentPeriodOf(granularity: PeriodGranularity) {
  const periods = listPeriods(granularity)
  return periods.find((period) => period.months.includes(currentMonth)) ?? periods[0]
}

export function getTiming(period: BudgetPeriod): PeriodTiming {
  if (period.months.includes(currentMonth)) return 'CURRENT'
  return period.months[0] > currentMonth ? 'FUTURE' : 'PAST'
}

/** Adds the months of one Cost Center up. The period has no budget only when none of its months has one. */
export function sumPeriod(lines: MonthlyBudgetLine[], costCenter: string, months: string[]) {
  const inPeriod = lines.filter((line) => line.costCenter === costCenter && months.includes(line.month))
  const budgeted = inPeriod.filter((line) => line.budget !== null)

  return {
    actual: inPeriod.reduce((sum, line) => sum + line.actual, 0),
    budget: budgeted.length === 0 ? null : budgeted.reduce((sum, line) => sum + (line.budget ?? 0), 0),
    held: inPeriod.reduce((sum, line) => sum + line.held, 0)
  }
}
