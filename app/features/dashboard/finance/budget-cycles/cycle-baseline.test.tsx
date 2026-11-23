import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CycleBaseline } from './components/cycle-baseline'

const usd = (amount: string) => ({ amount, currency: 'USD' })

const baseline = {
  basis: 'HOLDER_DEPARTMENT',
  year: 2027,
  currency: 'USD',
  computedAt: '2026-11-10T00:00:00.000Z',
  departmentsTotal: 1,
  departments: [
    {
      departmentId: '0b0c3c3e-0000-4000-8000-000000000001',
      departmentCode: 'MKT',
      departmentName: 'Marketing',
      costCenterId: null,
      spentThisYear: usd('100'),
      estimatedAnnualCost: usd('3600'),
      hasUnknownCost: false,
      seatsAssigned: 15,
      softwareTotal: 1,
      software: [
        {
          subscriptionId: '0b0c3c3e-0000-4000-8000-000000000002',
          application: 'Figma',
          plan: 'Team',
          seatsPurchased: 20,
          seatsAssigned: 15,
          monthlyUnitPrice: usd('20'),
          monthsRunning: 12,
          estimatedAnnualCost: usd('3600'),
          suggestRenewal: true,
          kpi3: 62
        }
      ]
    }
  ],
  sharedPoolUnallocated: {
    line: 'SHARED_POOL_UNALLOCATED',
    estimatedAnnualCost: usd('1200'),
    hasUnknownCost: true,
    seatsIdle: 5,
    softwareTotal: 1,
    software: []
  }
} as unknown as Parameters<typeof CycleBaseline>[0]['baseline']

describe('CycleBaseline', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('shows the shared-pool line and opens the software of a department', () => {
    render(<CycleBaseline baseline={baseline} />)
    expect(screen.getByText('Shared pool — unallocated (idle seats)')).toBeTruthy()
    expect(
      screen.getByText('Some subscriptions have no usable price; their cost is left out of the total.')
    ).toBeTruthy()
    expect(screen.queryByText(/Figma/)).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /Marketing/ }))
    expect(screen.getByText(/Figma · Team/)).toBeTruthy()
    expect(screen.getByText('62%')).toBeTruthy()
    expect(screen.getByText('Suggest Renew')).toBeTruthy()
  })
})
