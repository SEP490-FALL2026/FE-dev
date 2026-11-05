import { describe, expect, it } from 'vitest'
import type { BudgetTablePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetTablePageResponseDtoDataItemsItem'
import type { CommitmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-commitments/commitmentListResponseDtoDataItemsItem'
import {
  budgetShare,
  budgetTotals,
  commitmentsByMonth,
  costCenterRows,
  periodMonths,
  plannedQuarters,
  sumPeriod,
  type OverviewPeriod
} from './overview-analytics'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const budgetRow = (code: string, total: string, committed = '0', overCommitted = false) =>
  ({
    costCenter: { id: code, code, name: `Center ${code}` },
    year: 2026,
    versionId: `version-${code}`,
    number: 1,
    total: vnd(total),
    committed: vnd(committed),
    spent: vnd('0'),
    remaining: vnd(String(Number(total) - Number(committed))),
    overCommitted
  }) as BudgetTablePageResponseDtoDataItemsItem
const commitment = (createdAt: string, amount: string) =>
  ({ id: createdAt, createdAt, amount: vnd(amount), year: 2026 }) as CommitmentListResponseDtoDataItemsItem
const period = (patch: Partial<OverviewPeriod>): OverviewPeriod => ({
  year: 2026,
  mode: 'year',
  quarter: 1,
  month: 1,
  ...patch
})

describe('finance overview analytics', () => {
  it('maps each period mode to the months it covers', () => {
    expect(periodMonths(period({}))).toHaveLength(12)
    expect(periodMonths(period({ mode: 'quarter', quarter: 3 }))).toEqual([7, 8, 9])
    expect(periodMonths(period({ mode: 'month', month: 5 }))).toEqual([5])
  })

  it('sums budget rows and counts over-committed cost centers', () => {
    const totals = budgetTotals([
      budgetRow('ENG', '120000000', '30000000'),
      budgetRow('MKT', '60000000', '70000000', true)
    ])
    expect(totals).toMatchObject({ currency: 'VND', total: 180000000, committed: 100000000, overCommittedCount: 1 })
  })

  it('keeps cost centers in code order so colors follow the entity', () => {
    expect(costCenterRows([budgetRow('SAL', '1'), budgetRow('ENG', '1')]).map((row) => row.code)).toEqual([
      'ENG',
      'SAL'
    ])
  })

  it('folds cost centers past the palette into one other slice', () => {
    const rows = costCenterRows(['A', 'B', 'C', 'D'].map((code, index) => budgetRow(code, String((index + 1) * 10))))
    const slices = budgetShare(rows, 3, 'Other')
    expect(slices.map((slice) => slice.key)).toEqual(['C', 'D', 'other'])
    expect(slices.map((slice) => slice.slot)).toEqual([0, 1, null])
    expect(slices.at(-1)).toMatchObject({ value: 30, slot: null })
  })

  it('groups commitments by creation month and totals the selected quarter', () => {
    const points = commitmentsByMonth(
      [
        commitment('2026-04-10T03:00:00Z', '100'),
        commitment('2026-05-02T03:00:00Z', '50'),
        commitment('2025-05-02T03:00:00Z', '999')
      ],
      period({ mode: 'quarter', quarter: 2 })
    )
    expect(points[3]).toMatchObject({ month: 4, amount: 100, count: 1, inPeriod: true })
    expect(points[0].inPeriod).toBe(false)
    expect(sumPeriod(points)).toEqual({ amount: 150, count: 2 })
  })

  it('sums planned quarters and reports versions without a split', () => {
    const split = { q1: vnd('10'), q2: vnd('20'), q3: vnd('30'), q4: vnd('40') }
    const result = plannedQuarters([split, split, null], period({ mode: 'month', month: 8 }))
    expect(result.points.map((point) => point.amount)).toEqual([20, 40, 60, 80])
    expect(result.points.map((point) => point.inPeriod)).toEqual([false, false, true, false])
    expect(result.withoutSplit).toBe(1)
  })
})
