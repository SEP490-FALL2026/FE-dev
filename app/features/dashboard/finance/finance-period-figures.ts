import { allocationLines, budgetVsActual, currentBudgetLines } from './finance-data'

/*
 * Demo figures for the Finance dashboard filter (month / quarter / year of 2026).
 * The organization budgets per quarter (FR-5.1, OI-11b), so a month shows one third of
 * its quarter budget as a reference and a year sums its quarters. Q3 and Q4 reproduce
 * the figures used on the other Finance screens; Q4 has only October elapsed.
 */

export type Granularity = 'month' | 'quarter' | 'year'

const costCenterCodes = ['CC-ENG', 'CC-DES', 'CC-OPS', 'CC-MKT', 'CC-SAL', 'CC-COMPANY'] as const
type CostCenterCode = (typeof costCenterCodes)[number]
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const
type Quarter = (typeof quarters)[number]

const million = 1_000_000
const fromMillions = (values: Record<CostCenterCode, number | null>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === null ? null : value * million])
  ) as Record<CostCenterCode, number | null>

const quarterBudgets: Record<Quarter, Record<CostCenterCode, number | null>> = {
  Q1: fromMillions({ 'CC-COMPANY': 45, 'CC-DES': 100, 'CC-ENG': 220, 'CC-MKT': 28, 'CC-OPS': 65, 'CC-SAL': 18 }),
  Q2: fromMillions({ 'CC-COMPANY': 48, 'CC-DES': 105, 'CC-ENG': 230, 'CC-MKT': 30, 'CC-OPS': 68, 'CC-SAL': 20 }),
  Q3: Object.fromEntries(
    costCenterCodes.map((code) => [code, budgetVsActual.find((line) => line.costCenter === code)?.budget ?? null])
  ) as Record<CostCenterCode, number | null>,
  Q4: Object.fromEntries(
    costCenterCodes.map((code) => [code, currentBudgetLines.find((line) => line.costCenter === code)?.budget ?? null])
  ) as Record<CostCenterCode, number | null>
}

type ActualKey = CostCenterCode | 'UNALLOCATED'

const quarterActuals: Record<Quarter, Record<ActualKey, number>> = {
  Q1: {
    'CC-COMPANY': 36_900_000,
    'CC-DES': 70_500_000,
    'CC-ENG': 168_000_000,
    'CC-MKT': 19_400_000,
    'CC-OPS': 55_200_000,
    'CC-SAL': 12_800_000,
    UNALLOCATED: 4_100_000
  },
  Q2: {
    'CC-COMPANY': 39_200_000,
    'CC-DES': 74_900_000,
    'CC-ENG': 176_300_000,
    'CC-MKT': 20_600_000,
    'CC-OPS': 59_800_000,
    'CC-SAL': 13_500_000,
    UNALLOCATED: 5_300_000
  },
  Q3: Object.fromEntries(budgetVsActual.map((line) => [line.costCenter ?? 'UNALLOCATED', line.periodActual])) as Record<
    ActualKey,
    number
  >,
  Q4: {
    ...(Object.fromEntries(currentBudgetLines.map((line) => [line.costCenter, line.actual])) as Record<
      CostCenterCode,
      number
    >),
    UNALLOCATED: 1_800_000
  }
}

/** Commitments still held at the end of each quarter; closed quarters have none left. */
const quarterHeld: Record<Quarter, Partial<Record<CostCenterCode, number>>> = {
  Q1: {},
  Q2: {},
  Q3: Object.fromEntries(budgetVsActual.filter((line) => line.costCenter).map((line) => [line.costCenter, line.held])),
  Q4: Object.fromEntries(currentBudgetLines.map((line) => [line.costCenter, line.held]))
}

/** Share of each quarter's actual falling in its 1st/2nd/3rd month; Q4 has only October so far. */
const monthWeights: Record<Quarter, readonly [number, number, number]> = {
  Q1: [0.31, 0.33, 0.36],
  Q2: [0.31, 0.33, 0.36],
  Q3: [0.31, 0.33, 0.36],
  Q4: [1, 0, 0]
}

const elapsedMonths = 10
export const periodYear = 2026

export const periodOptions: Record<Granularity, readonly string[]> = {
  month: Array.from({ length: elapsedMonths }, (_, index) => `${periodYear}-${String(index + 1).padStart(2, '0')}`),
  quarter: quarters.map((quarter) => `${quarter}-${periodYear}`),
  year: [String(periodYear)]
}

export const defaultPeriod: Record<Granularity, string> = {
  month: `${periodYear}-10`,
  quarter: `Q4-${periodYear}`,
  year: String(periodYear)
}

export interface PeriodLine {
  actual: number
  budget: number | null
  costCenter: string | null
  held: number
}

export interface PeriodFigures {
  lines: PeriodLine[]
  structure: { internal: number; personalSeats: number; sharedAccounts: number; sharedByRatio: number }
}

/** Month slices (quarter, index in quarter, isLastElapsedMonthOfQuarter) covered by a period key. */
function monthsOf(granularity: Granularity, period: string) {
  const all = periodOptions.month.map((month) => {
    const monthIndex = Number(month.slice(5)) - 1
    const quarter = quarters[Math.floor(monthIndex / 3)]
    const position = monthIndex % 3
    const lastElapsedInQuarter = position === 2 || monthIndex === elapsedMonths - 1
    return { lastElapsedInQuarter, month, position, quarter }
  })
  if (granularity === 'month') return all.filter((slice) => slice.month === period)
  if (granularity === 'quarter') return all.filter((slice) => slice.quarter === period.slice(0, 2))
  return all
}

const allocationShares = allocationLines.map((line) => {
  const total = line.internal + line.personalSeats + line.sharedAccounts + line.sharedByRatio
  return {
    costCenter: line.costCenter,
    internal: line.internal / total,
    personalSeats: line.personalSeats / total,
    sharedAccounts: line.sharedAccounts / total,
    sharedByRatio: line.sharedByRatio / total
  }
})

export function getPeriodFigures(granularity: Granularity, period: string): PeriodFigures {
  const slices = monthsOf(granularity, period)
  const coveredQuarters = [...new Set(slices.map((slice) => slice.quarter))]

  const budgetFor = (code: CostCenterCode) => {
    if (granularity === 'month') {
      const quarterBudget = quarterBudgets[slices[0].quarter][code]
      return quarterBudget === null ? null : quarterBudget / 3
    }
    const budgets = coveredQuarters.map((quarter) => quarterBudgets[quarter][code])
    return budgets.every((value) => value === null)
      ? null
      : budgets.reduce<number>((sum, value) => sum + (value ?? 0), 0)
  }

  const actualFor = (key: ActualKey) =>
    slices.reduce(
      (sum, slice) => sum + quarterActuals[slice.quarter][key] * monthWeights[slice.quarter][slice.position],
      0
    )

  // Held commitments are a balance, read at the latest elapsed month the period covers.
  const lastSlice = slices[slices.length - 1]
  const heldFor = (code: CostCenterCode) =>
    lastSlice.lastElapsedInQuarter ? (quarterHeld[lastSlice.quarter][code] ?? 0) : 0

  const lines: PeriodLine[] = [
    ...costCenterCodes.map((code) => ({
      actual: Math.round(actualFor(code)),
      budget: budgetFor(code),
      costCenter: code,
      held: heldFor(code)
    })),
    { actual: Math.round(actualFor('UNALLOCATED')), budget: null, costCenter: null, held: 0 }
  ]

  const structure = { internal: 0, personalSeats: 0, sharedAccounts: 0, sharedByRatio: 0 }
  for (const line of lines) {
    const share = allocationShares.find((item) => item.costCenter === line.costCenter)
    if (!share) continue
    structure.internal += line.actual * share.internal
    structure.personalSeats += line.actual * share.personalSeats
    structure.sharedAccounts += line.actual * share.sharedAccounts
    structure.sharedByRatio += line.actual * share.sharedByRatio
  }

  return { lines, structure }
}
