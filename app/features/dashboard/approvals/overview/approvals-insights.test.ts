import { describe, expect, it } from 'vitest'
import type { ApprovalListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-approvals/approvalListResponseDtoDataItemsItem'
import {
  OTHER_ROW_KEY,
  addDays,
  amountRows,
  checkCodeCounts,
  dueBuckets,
  soonestDue,
  sumDecimal,
  totalsByCurrency
} from './approvals-insights'

const spend = (overrides: Partial<ApprovalListResponseDtoDataItemsItem>) =>
  ({
    stepId: overrides.stepId ?? 'step',
    dueOn: '2026-11-10',
    primaryCode: 'BUDGET_OK',
    ...overrides
  }) as ApprovalListResponseDtoDataItemsItem

describe('approvals insights', () => {
  it('adds decimal strings exactly, beyond the safe integer range', () => {
    expect(sumDecimal(['9007199254740993.25', '0.75', '1'])).toBe('9007199254740995.00')
    expect(sumDecimal(['1500000', '800000'])).toBe('2300000')
    expect(sumDecimal(['0.1', '0.2'])).toBe('0.3')
    expect(sumDecimal(['not-a-number', '5'])).toBe('5')
  })

  it('keeps one total per currency and never mixes them', () => {
    expect(
      totalsByCurrency([
        { amount: '100', currency: 'VND' },
        { amount: '50', currency: 'USD' },
        { amount: '200', currency: 'VND' },
        null
      ])
    ).toEqual([
      { currency: 'VND', amount: '300', count: 2 },
      { currency: 'USD', amount: '50', count: 1 }
    ])
  })

  it('counts overdue and due-soon requests from calendar dates', () => {
    const items = ['2026-11-05', '2026-11-06', '2026-11-08', '2026-11-09'].map((dueOn, index) =>
      spend({ stepId: `step-${index}`, dueOn })
    )
    expect(dueBuckets(items, '2026-11-06')).toEqual({ overdue: 1, dueSoon: 2 })
    expect(addDays('2026-12-31', 2)).toBe('2027-01-02')
    expect(soonestDue(items, 2).map((item) => item.dueOn)).toEqual(['2026-11-05', '2026-11-06'])
  })

  it('sums one currency per group, largest first, and folds the tail into "other"', () => {
    const entries = ['A', 'B', 'C', 'D'].map((code, index) => ({
      key: code,
      label: code,
      money: { amount: String((index + 1) * 100), currency: 'VND' }
    }))
    const rows = amountRows(
      [...entries, { key: 'X', label: 'X', money: { amount: '999', currency: 'USD' } }],
      'VND',
      'Other',
      3
    )
    expect(rows.map((row) => [row.key, row.exact, row.count])).toEqual([
      ['D', '400', 1],
      ['C', '300', 1],
      [OTHER_ROW_KEY, '300', 2]
    ])
  })

  it('counts check codes in a fixed order and keeps unknown or missing codes apart', () => {
    const items = [
      spend({ stepId: '1', primaryCode: 'INSUFFICIENT_BUDGET' }),
      spend({ stepId: '2', primaryCode: 'BUDGET_OK' }),
      spend({ stepId: '3', primaryCode: 'BUDGET_OK' }),
      spend({ stepId: '4', primaryCode: null }),
      spend({ stepId: '5', primaryCode: 'SOMETHING_NEW' as never })
    ]
    expect(checkCodeCounts(items)).toEqual({
      counts: [
        { code: 'BUDGET_OK', count: 2 },
        { code: 'INSUFFICIENT_BUDGET', count: 1 }
      ],
      unknown: 2
    })
  })
})
