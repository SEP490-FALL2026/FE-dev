import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ManagerRequestApprovalView } from './views/manager-request-approval-view'
import { ManagerTeamRequestsView } from './views/manager-team-requests-view'

describe('Manager team request form', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('shows individual and shared forms instead of estimated cost and opens the selected request', () => {
    const onSelectTab = vi.fn()
    render(<ManagerTeamRequestsView onSelectTab={onSelectTab} />)

    expect(screen.getByRole('columnheader', { name: 'Form' })).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Estimated Cost' })).not.toBeInTheDocument()

    const sharedRow = screen.getByRole('row', { name: /REQ-M01/ })
    const individualRow = screen.getByRole('row', { name: /REQ-M03/ })
    expect(within(sharedRow).getByText('Shared')).toBeInTheDocument()
    expect(within(individualRow).getByText('Individual')).toBeInTheDocument()

    fireEvent.click(within(sharedRow).getByRole('button', { name: 'Review & Decide' }))
    expect(onSelectTab).toHaveBeenCalledWith('request-approval', { id: 'req-01' })
  })

  it('shows the requester and same-department colleagues for shared requests only', () => {
    const view = render(<ManagerRequestApprovalView formatCurrency={String} onSelectTab={vi.fn()} requestId='req-01' />)

    const participants = screen.getByRole('region', { name: 'Registered participants' })
    expect(within(participants).getByText('Mai Thị Lan')).toBeInTheDocument()
    expect(within(participants).getByText('Lê Thị Hoa')).toBeInTheDocument()
    expect(within(participants).getByText('Hoàng Văn Nam')).toBeInTheDocument()
    expect(within(participants).getByText('3 people')).toBeInTheDocument()

    view.rerender(<ManagerRequestApprovalView formatCurrency={String} onSelectTab={vi.fn()} requestId='req-02' />)
    const secondParticipants = screen.getByRole('region', { name: 'Registered participants' })
    expect(within(secondParticipants).getByText('Lê Thị Hoa')).toBeInTheDocument()
    expect(within(secondParticipants).getByText('Mai Thị Lan')).toBeInTheDocument()
    expect(within(secondParticipants).getByText('2 people')).toBeInTheDocument()

    view.rerender(<ManagerRequestApprovalView formatCurrency={String} onSelectTab={vi.fn()} requestId='req-03' />)
    expect(screen.queryByRole('region', { name: 'Registered participants' })).not.toBeInTheDocument()
  })
})
