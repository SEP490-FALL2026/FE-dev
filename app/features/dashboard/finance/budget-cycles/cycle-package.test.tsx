import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PackageResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CyclePackageSummary } from './components/cycle-package-summary'

const vnd = (amount: string) => ({ amount, currency: 'VND' })

const department = (id: string, overrides: Record<string, unknown>) => ({
  departmentId: id,
  departmentCode: id.toUpperCase(),
  departmentName: `Dept ${id}`,
  headStatus: 'HAS_HEAD',
  baselineAllowed: false,
  baselineRefusal: null,
  proposal: null,
  version: null,
  ...overrides
})

const budgetPackage = {
  year: 2027,
  annualCeiling: vnd('1000'),
  sharedPoolReserve: vnd('100'),
  available: vnd('900'),
  proposalsTotal: vnd('500'),
  proposalsOverAvailable: false,
  versionsTotal: vnd('950'),
  versionsAdjustment: vnd('0'),
  unallocated: vnd('0'),
  versionsOutsideListed: vnd('0'),
  versionsInOtherCurrency: 0,
  overBy: vnd('50'),
  departmentsTotal: 3,
  departments: [
    department('a', { baselineAllowed: true }),
    department('b', { baselineRefusal: 'BEFORE_DEADLINE' }),
    department('c', { baselineRefusal: 'HAS_PROPOSAL' })
  ]
} as unknown as NonNullable<PackageResponseDtoData>

const renderWith = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>)

describe('CyclePackageSummary', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('offers "Build from baseline" only where the package allows it and says why not elsewhere', () => {
    const build = vi.fn()
    renderWith(<CyclePackageSummary budgetPackage={budgetPackage} onBuildFromBaseline={build} />)
    const buttons = screen.getAllByRole('button', { name: 'Build from baseline' })
    expect(buttons).toHaveLength(1)
    fireEvent.click(buttons[0])
    expect(build).toHaveBeenCalledWith('a')
    expect(screen.getByText('Before the deadline: the head can still submit a proposal')).toBeTruthy()
    expect(screen.getByText('A proposal exists: build the version from it')).toBeTruthy()
  })

  it('warns by how much the versions exceed what is available', () => {
    renderWith(<CyclePackageSummary budgetPackage={budgetPackage} />)
    expect(screen.getByRole('alert').textContent).toContain('exceed the amount available to departments')
  })
})
