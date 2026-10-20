import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ManagerOverviewView } from './manager-overview-view'

describe('Manager overview charts', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('shows labeled charts from the available sample records and preserves navigation', () => {
    const onSelectTab = vi.fn()
    render(<ManagerOverviewView formatCurrency={(value) => `${value} VND`} onSelectTab={onSelectTab} />)

    const charts = screen.getByRole('region', { name: 'Team software charts' })
    expect(within(charts).getByText(/6 illustrative software records out of 8 team applications/)).toBeInTheDocument()
    expect(within(charts).getByRole('img', { name: 'Figma: 8 of 10 seats assigned' })).toBeInTheDocument()
    expect(within(charts).getByRole('img', { name: 'Sample monthly software costs: 16460000 VND' })).toBeInTheDocument()
    expect(within(charts).getByText('43 of 52 sample seats assigned')).toBeInTheDocument()

    fireEvent.click(within(charts).getByRole('button', { name: 'View all' }))
    expect(onSelectTab).toHaveBeenCalledWith('team-software')

    fireEvent.click(screen.getAllByRole('button', { name: 'Review' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('request-approval', { id: 'req-01' })

    expect(screen.queryByText('720000 VND')).not.toBeInTheDocument()
    expect(screen.queryByText('650000 VND')).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Handle' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('ghost-seat-detail', { id: 'ghost-01' })
  })
})
