import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { BudgetShareChart } from './components/overview-budget-charts'
import type { CostCenterRow } from './overview-analytics'

const row = (code: string, name: string, total: number): CostCenterRow => ({
  code,
  name,
  total,
  committed: 0,
  spent: 0,
  remaining: total
})
const rows = [row('CC-BOD', 'Ban Giám đốc', 55000000), row('CC-ENG', 'Phòng Kỹ thuật', 660000000)]
const money = {
  full: (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} ₫`,
  compact: (value: number) => `${value / 1000000} Tr ₫`
}

describe('BudgetShareChart', () => {
  beforeEach(async () => {
    await setAppLanguage('vi', false)
  })

  it('shows the full total, and the full amount of a slice while it is pointed at', () => {
    render(<BudgetShareChart rows={rows} money={money} />)
    expect(screen.getByText('715.000.000 ₫')).toBeTruthy()
    expect(screen.queryByText(/Tr ₫/)).toBeNull()

    const legendRow = screen.getByText('Phòng Kỹ thuật').closest('li') as HTMLElement
    fireEvent.mouseEnter(legendRow)
    expect(screen.getByText('660.000.000 ₫')).toBeTruthy()
    expect(screen.queryByText('715.000.000 ₫')).toBeNull()

    fireEvent.mouseLeave(legendRow)
    expect(screen.getByText('715.000.000 ₫')).toBeTruthy()
  })
})
