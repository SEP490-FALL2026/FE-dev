import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { EmployeeDataExportView } from './employee-data-export-view'
import { EmployeeRequestNewSoftwareView } from './employee-request-new-software-view'
import { EmployeeReviewRequestView } from './employee-review-request-view'
import { EmployeeTemporaryRenewalView } from './employee-temporary-renewal-view'

describe('Employee preview flows', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('does not offer a download or invent export history', () => {
    render(<EmployeeDataExportView onSelectTab={vi.fn()} />)

    expect(screen.getByText('No confirmed data exports are available yet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download CSV' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Download JSON' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeDisabled()
  })

  it('requires a draft and never presents a fake submission action', () => {
    const onSelectTab = vi.fn()
    const view = render(<EmployeeReviewRequestView onSelectTab={onSelectTab} />)

    expect(screen.getByRole('heading', { name: 'No request to review' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back to Request Categories' }))
    expect(onSelectTab).toHaveBeenCalledWith('create-request')

    view.rerender(
      <EmployeeReviewRequestView
        onSelectTab={onSelectTab}
        requestParams={{ softwareName: 'Figma', type: 'newSoftware' }}
      />
    )
    expect(screen.getByRole('button', { name: 'Submit request (unavailable)' })).toBeDisabled()
    expect(onSelectTab).not.toHaveBeenCalledWith('submission-success', expect.anything())
  })

  it('requires details before continuing and preserves the chosen request type', () => {
    const onSelectTab = vi.fn()
    render(<EmployeeRequestNewSoftwareView onSelectTab={onSelectTab} requestType='changePlan' />)

    const continueButton = screen.getByRole('button', { name: 'Continue to Review' })
    expect(continueButton).toBeDisabled()

    fireEvent.change(screen.getByRole('textbox', { name: 'Desired Plan' }), { target: { value: 'Team' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Project / Department' }), { target: { value: 'Design' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Need collaborative design seats' }
    })
    fireEvent.click(continueButton)

    expect(onSelectTab).toHaveBeenCalledWith(
      'review-request',
      expect.objectContaining({ plan: 'Team', project: 'Design', type: 'changePlan' })
    )
  })

  it('requires a renewal reason before review', () => {
    const onSelectTab = vi.fn()
    render(<EmployeeTemporaryRenewalView onSelectTab={onSelectTab} />)

    const continueButton = screen.getByRole('button', { name: 'Continue to Review' })
    expect(continueButton).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'Renewal Justification' }), {
      target: { value: 'Project delivery is extended' }
    })
    fireEvent.click(continueButton)

    expect(onSelectTab).toHaveBeenCalledWith('review-request', expect.objectContaining({ type: 'renewal' }))
  })

  it('shows renewal details at review and keeps the draft when returning to edit', () => {
    const onSelectTab = vi.fn()
    const draft = {
      duration: '3months',
      reason: 'Project delivery is extended',
      softwareId: '6',
      softwareName: 'Figma',
      tab: 'review-request',
      type: 'renewal'
    }
    render(<EmployeeReviewRequestView onSelectTab={onSelectTab} requestParams={draft} />)

    expect(screen.getByText('3 Months')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Back to Edit' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('temporary-renewal', {
      duration: '3months',
      reason: 'Project delivery is extended',
      softwareId: '6',
      softwareName: 'Figma',
      type: 'renewal'
    })
  })
})
