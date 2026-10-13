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
    expect(screen.getByText('0 matching software licenses')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByText('6 matching software licenses')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No software found' })).not.toBeInTheDocument()
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
