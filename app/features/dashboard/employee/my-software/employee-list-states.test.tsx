import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { EmployeeMyRequestsView } from '../my-requests/views/employee-my-requests-view'
import { EmployeeMySoftwareView } from './views/employee-my-software-view'
import { EmployeeRequestDetailView } from '../my-requests/views/employee-request-detail-view'
import { EmployeeSoftwareDetailView } from './views/employee-software-detail-view'

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

  it('shows the request form in place of the current stage and opens a shared request', () => {
    const onSelectTab = vi.fn()
    render(<EmployeeMyRequestsView onSelectTab={onSelectTab} />)

    expect(screen.getByRole('columnheader', { name: 'Form' })).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Current Stage' })).not.toBeInTheDocument()
    const sharedRow = screen.getByRole('row', { name: /REQ-1025/ })
    expect(within(sharedRow).getByText('Shared')).toBeInTheDocument()
    expect(screen.getAllByRole('row').filter((row) => within(row).queryByText('Shared'))).toHaveLength(3)
    fireEvent.click(within(sharedRow).getByRole('button', { name: 'Action' }))
    expect(onSelectTab).toHaveBeenCalledWith('request-detail', { id: 'REQ-1025' })
  })

  it('shows the representative and same-department colleagues only for shared requests', () => {
    const view = render(<EmployeeRequestDetailView onSelectTab={vi.fn()} requestId='REQ-1025' />)

    expect(screen.getByRole('heading', { name: 'Registered participants' })).toBeInTheDocument()
    expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument()
    expect(screen.getByText('Lê Cường')).toBeInTheDocument()
    expect(screen.getByText('Phạm Minh Hoàng')).toBeInTheDocument()
    expect(screen.getByText('3 people')).toBeInTheDocument()

    view.rerender(<EmployeeRequestDetailView onSelectTab={vi.fn()} requestId='REQ-1024' />)
    expect(screen.queryByRole('heading', { name: 'Registered participants' })).not.toBeInTheDocument()
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
