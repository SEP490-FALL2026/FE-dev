import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { BudgetSummaryTotalsItem } from '../shared/finance-api-extensions'
import { CostCenterCharts } from './components/cost-center-charts'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const totals: BudgetSummaryTotalsItem = {
  currency: 'VND',
  total: vnd('833800000'),
  base: vnd('758000000'),
  reserve: vnd('75800000'),
  committed: vnd('12600000'),
  spent: vnd('400000'),
  remaining: vnd('819700000'),
  costCenterCount: 8,
  overBudgetCount: 0
}

describe('CostCenterCharts', () => {
  beforeEach(async () => {
    await setAppLanguage('vi', false)
  })

  it('lists every figure in full next to the charts', () => {
    render(<CostCenterCharts totals={totals} />)
    expect(screen.getByRole('img', { name: 'Tình hình sử dụng ngân sách' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Cơ cấu ngân sách' })).toBeTruthy()
    for (const full of ['819.700.000', '12.600.000', '758.000.000', '75.800.000'])
      expect(screen.getAllByText((text) => text.includes(full)).length).toBeGreaterThan(0)
    expect(screen.queryByText(/vượt tổng ngân sách/)).toBeNull()
  })

  it('warns when spending and commitments exceed the budget', () => {
    render(<CostCenterCharts totals={{ ...totals, remaining: vnd('-5000000'), overBudgetCount: 1 }} />)
    expect(screen.getByText('Thực chi và cam kết đã vượt tổng ngân sách.')).toBeTruthy()
  })
})
