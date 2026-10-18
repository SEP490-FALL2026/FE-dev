import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { EmployeeMyRequestsView } from './employee-my-requests-view'
import { EmployeeMySoftwareView } from './employee-my-software-view'
import { EmployeeRequestDetailView } from './employee-request-detail-view'
import { EmployeeSoftwareDetailView } from './employee-software-detail-view'

describe('Employee software and request states', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('explains an empty software search and restores the list', () => {
    render(<EmployeeMySoftwareView onSelectTab={vi.fn()} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing software' } })

    expect(screen.getByRole('heading', { name: 'No software found' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.queryByText('6 matching software licenses')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No software found' })).not.toBeInTheDocument()
  })

  it('shows software as cards without prices and opens the selected license', () => {
    const onSelectTab = vi.fn()
    const view = render(<EmployeeMySoftwareView onSelectTab={onSelectTab} />)

    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(/Monthly Allocation|₫/)).not.toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Details' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('software-detail', { id: '1' })

    view.unmount()
    render(
      <EmployeeSoftwareDetailView formatCurrency={(value) => `${value} VND`} onSelectTab={vi.fn()} softwareId='1' />
    )
    expect(screen.getByText('Monthly Allocation')).toBeInTheDocument()
    expect(screen.getByText('350000 VND')).toBeInTheDocument()
    expect(screen.queryByText('84%')).not.toBeInTheDocument()
  })

  it('hides the license key until requested and hides it again on toggle or software change', () => {
    const onSelectTab = vi.fn()
    const { rerender } = render(
      <EmployeeSoftwareDetailView formatCurrency={String} onSelectTab={onSelectTab} softwareId='1' />
    )

    expect(screen.queryByText('FIG-PRO-2026-8819')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'License key hidden' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show key' }))
    expect(screen.getByText('FIG-PRO-2026-8819')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hide key' }))
    expect(screen.queryByText('FIG-PRO-2026-8819')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show key' }))
    rerender(<EmployeeSoftwareDetailView formatCurrency={String} onSelectTab={onSelectTab} softwareId='2' />)
    expect(screen.getByRole('button', { name: 'Show key' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('explains an empty request search and restores the list', () => {
    render(<EmployeeMyRequestsView onSelectTab={vi.fn()} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing request' } })

    expect(screen.getByRole('heading', { name: 'No requests found' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.queryByRole('heading', { name: 'No requests found' })).not.toBeInTheDocument()
  })

  it('does not show another employee record for an unknown detail ID', () => {
    const onSelectTab = vi.fn()
    const softwareView = render(
      <EmployeeSoftwareDetailView formatCurrency={String} onSelectTab={onSelectTab} softwareId='unknown' />
    )

    expect(screen.getByRole('heading', { name: 'Software not found' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back to My Software' }))
    expect(onSelectTab).toHaveBeenCalledWith('my-software')

    softwareView.unmount()
    render(<EmployeeRequestDetailView onSelectTab={vi.fn()} requestId='unknown' />)
    expect(screen.getByRole('heading', { name: 'Request not found' })).toBeInTheDocument()
  })
})
