import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { EmployeeDataExportView } from './employee-data-export-view'
import { EmployeeRequestNewSoftwareView } from './employee-request-new-software-view'
import { EmployeeRequestSoftwareDetailsView } from './employee-request-software-details-view'
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

  it('confirms the software before showing registration details', () => {
    const onSelectTab = vi.fn()
    render(<EmployeeRequestNewSoftwareView onSelectTab={onSelectTab} requestType='changePlan' />)

    expect(screen.getByRole('list', { name: 'Request progress' }).children).toHaveLength(4)
    expect(screen.queryByRole('textbox', { name: 'Desired Plan' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm Software' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /GitHub Enterprise/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Software' }))

    expect(onSelectTab).toHaveBeenCalledWith(
      'request-software-details',
      expect.objectContaining({ softwareId: 'github', type: 'changePlan' })
    )
  })

  it('requires registration details before review and keeps the chosen request type', () => {
    const onSelectTab = vi.fn()
    render(
      <EmployeeRequestSoftwareDetailsView
        initialParams={{ softwareId: 'github', type: 'changePlan' }}
        onSelectTab={onSelectTab}
      />
    )

    const continueButton = screen.getByRole('button', { name: 'Continue to Review' })
    expect(continueButton).toBeDisabled()

    fireEvent.change(screen.getByRole('textbox', { name: 'Desired Plan' }), { target: { value: 'Team' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Project / Department' }), { target: { value: 'Design' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Need collaborative design seats' }
    })
    expect(screen.getByRole('group', { name: 'Usage type' })).toBeInTheDocument()
    expect(screen.getByText('Select a usage type before continuing.')).toBeInTheDocument()
    expect(continueButton).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: 'Team (shared)' }))
    fireEvent.click(continueButton)

    expect(onSelectTab).toHaveBeenCalledWith(
      'review-request',
      expect.objectContaining({
        softwareId: 'github',
        softwareName: 'GitHub Enterprise',
        plan: 'Team',
        usageMode: 'team',
        project: 'Design',
        type: 'changePlan'
      })
    )
  })

  it('requires a name for other software and carries it to review', () => {
    const onSelectTab = vi.fn()
    const view = render(<EmployeeRequestNewSoftwareView onSelectTab={onSelectTab} />)

    fireEvent.click(screen.getByRole('button', { name: 'Other software' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Software' }))
    expect(onSelectTab).toHaveBeenCalledWith(
      'request-software-details',
      expect.objectContaining({ softwareId: 'other' })
    )

    view.rerender(
      <EmployeeRequestSoftwareDetailsView initialParams={{ softwareId: 'other' }} onSelectTab={onSelectTab} />
    )
    const continueButton = screen.getByRole('button', { name: 'Continue to Review' })
    fireEvent.change(screen.getByRole('textbox', { name: 'Desired Plan' }), { target: { value: 'Team' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Project / Department' }), { target: { value: 'Design' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Needed for the project' }
    })
    fireEvent.click(screen.getByRole('radio', { name: 'Individual' }))
    expect(continueButton).toBeDisabled()
    expect(screen.getByText('Enter the software name before continuing.')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: 'Software name' }), { target: { value: '  Blender  ' } })
    fireEvent.click(continueButton)

    expect(onSelectTab).toHaveBeenCalledWith(
      'review-request',
      expect.objectContaining({
        softwareId: 'other',
        softwareName: 'Blender',
        otherSoftwareName: '  Blender  ',
        usageMode: 'personal'
      })
    )
  })

  it('returns from review to registration details with the draft intact', () => {
    const onSelectTab = vi.fn()
    const draft = {
      softwareId: 'other',
      softwareName: 'Blender',
      otherSoftwareName: 'Blender',
      plan: 'Team',
      usageMode: 'team',
      project: 'Design',
      reason: 'Needed for the project',
      type: 'newSoftware'
    }
    render(<EmployeeReviewRequestView onSelectTab={onSelectTab} requestParams={draft} />)

    expect(screen.getByRole('list', { name: 'Request progress' }).children).toHaveLength(4)
    expect(screen.getByText('Team (shared)')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Back to Edit' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('request-software-details', draft)
  })

  it('keeps registration fields when returning to software selection', () => {
    const onSelectTab = vi.fn()
    render(<EmployeeRequestSoftwareDetailsView initialParams={{ softwareId: 'figma' }} onSelectTab={onSelectTab} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Desired Plan' }), { target: { value: 'Professional' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Individual' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Back to Software Selection' })[0])

    expect(onSelectTab).toHaveBeenCalledWith(
      'request-new-software',
      expect.objectContaining({ softwareId: 'figma', plan: 'Professional', usageMode: 'personal' })
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
