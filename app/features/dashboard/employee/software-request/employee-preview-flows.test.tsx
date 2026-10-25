import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { eligibleTeamMembers } from './employee-team-request-draft'

import { EmployeeDataExportView } from '../profile-privacy/views/employee-data-export-view'
import { EmployeeRequestNewSoftwareView } from './views/employee-request-new-software-view'
import { EmployeeRequestSoftwareDetailsView } from './views/employee-request-software-details-view'
import { EmployeeReviewRequestView } from './views/employee-review-request-view'
import { EmployeeTemporaryRenewalView } from '../my-software/views/employee-temporary-renewal-view'

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
    expect(screen.queryByRole('combobox', { name: 'Desired Plan' })).not.toBeInTheDocument()
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

    const planSelect = screen.getByRole('combobox', { name: 'Desired Plan' })
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Select a plan',
      'Standard',
      'Professional'
    ])
    expect(screen.queryByRole('textbox', { name: 'Project / Department' })).not.toBeInTheDocument()
    fireEvent.change(planSelect, { target: { value: 'standard' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Need collaborative design seats' }
    })
    expect(screen.getByRole('group', { name: 'Usage type' })).toBeInTheDocument()
    expect(screen.getByText('Select a usage type before continuing.')).toBeInTheDocument()
    expect(continueButton).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: 'Team (shared)' }))
    expect(screen.queryByRole('textbox', { name: 'Shared work' })).not.toBeInTheDocument()
    expect(screen.getByText('People on this request: 1')).toBeInTheDocument()
    fireEvent.click(continueButton)

    expect(onSelectTab).toHaveBeenCalledWith(
      'review-request',
      expect.objectContaining({
        softwareId: 'github',
        softwareName: 'GitHub Enterprise',
        plan: 'standard',
        usageMode: 'team',
        teamMemberIds: '',
        type: 'changePlan'
      })
    )
    expect(onSelectTab.mock.calls.at(-1)?.[1]).not.toHaveProperty('project')
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
    fireEvent.change(screen.getByRole('combobox', { name: 'Desired Plan' }), {
      target: { value: 'professional' }
    })
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
        plan: 'professional',
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
      plan: 'standard',
      usageMode: 'team',
      teamMemberIds: eligibleTeamMembers[0].id,
      project: 'Design',
      reason: 'Needed for the project',
      type: 'newSoftware'
    }
    render(<EmployeeReviewRequestView onSelectTab={onSelectTab} requestParams={draft} />)

    expect(screen.getByRole('list', { name: 'Request progress' }).children).toHaveLength(4)
    expect(screen.getByText('Team (shared)')).toBeInTheDocument()
    expect(screen.getByText('Standard')).toBeInTheDocument()
    expect(screen.getByText(eligibleTeamMembers[0].name)).toBeInTheDocument()
    expect(screen.getByText('People included: 2')).toBeInTheDocument()
    expect(screen.queryByText('Project Allocation')).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Back to Edit' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('request-software-details', {
      ...Object.fromEntries(Object.entries(draft).filter(([key]) => key !== 'project'))
    })
  })

  it('selects only active colleagues in the same department and caps the request at the roster size', () => {
    const onSelectTab = vi.fn()
    const detailsView = render(
      <EmployeeRequestSoftwareDetailsView initialParams={{ softwareId: 'notion' }} onSelectTab={onSelectTab} />
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Desired Plan' }), {
      target: { value: 'professional' }
    })
    fireEvent.click(screen.getByRole('radio', { name: 'Team (shared)' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Our department needs the same research workspace' }
    })

    const memberSelect = screen.getByRole('combobox', { name: 'People who need access' })
    expect(within(memberSelect).getAllByRole('option')).toHaveLength(eligibleTeamMembers.length + 1)
    expect(
      screen.getByText(`Up to ${eligibleTeamMembers.length + 1} people in this department, including you`)
    ).toBeInTheDocument()
    for (const member of eligibleTeamMembers) {
      fireEvent.change(memberSelect, { target: { value: member.id } })
    }

    expect(screen.getByText(`People on this request: ${eligibleTeamMembers.length + 1}`)).toBeInTheDocument()
    expect(memberSelect).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Review' }))
    const params = onSelectTab.mock.calls.at(-1)?.[1]
    expect(params).toEqual(
      expect.objectContaining({
        softwareId: 'notion',
        usageMode: 'team',
        teamMemberIds: eligibleTeamMembers.map((member) => member.id).join(',')
      })
    )
    expect(params).not.toHaveProperty('members')
    expect(JSON.stringify(params)).not.toContain(eligibleTeamMembers[0].email)

    detailsView.unmount()
    render(<EmployeeReviewRequestView onSelectTab={onSelectTab} requestParams={params} />)
    expect(screen.getByText(`People included: ${eligibleTeamMembers.length + 1}`)).toBeInTheDocument()
    expect(screen.getByText(eligibleTeamMembers.at(-1)!.name)).toBeInTheDocument()
    expect(screen.getByText('One shared request, individual access')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit request (unavailable)' })).toBeDisabled()
  })

  it('ignores duplicate and other-department member IDs in a reopened draft', () => {
    const onSelectTab = vi.fn()
    render(
      <EmployeeRequestSoftwareDetailsView
        initialParams={{
          softwareId: 'notion',
          plan: 'standard',
          usageMode: 'team',
          reason: 'Shared access needed',
          teamMemberIds: `4,${eligibleTeamMembers[0].id},${eligibleTeamMembers[0].id}`
        }}
        onSelectTab={onSelectTab}
      />
    )

    expect(screen.getByText('People on this request: 2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Review' }))
    expect(onSelectTab.mock.calls.at(-1)?.[1]).toEqual(
      expect.objectContaining({ teamMemberIds: eligibleTeamMembers[0].id })
    )
  })

  it('keeps registration fields when returning to software selection', () => {
    const onSelectTab = vi.fn()
    render(<EmployeeRequestSoftwareDetailsView initialParams={{ softwareId: 'figma' }} onSelectTab={onSelectTab} />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Desired Plan' }), {
      target: { value: 'professional' }
    })
    fireEvent.click(screen.getByRole('radio', { name: 'Individual' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Back to Software Selection' })[0])

    expect(onSelectTab).toHaveBeenCalledWith(
      'request-new-software',
      expect.objectContaining({ softwareId: 'figma', plan: 'professional', usageMode: 'personal' })
    )
  })

  it('restores a selected plan and removes stale project data from the draft', () => {
    const onSelectTab = vi.fn()
    render(
      <EmployeeRequestSoftwareDetailsView
        initialParams={{ softwareId: 'figma', plan: 'standard', project: 'Old department' }}
        onSelectTab={onSelectTab}
      />
    )

    expect(screen.getByRole('combobox', { name: 'Desired Plan' })).toHaveValue('standard')
    expect(screen.queryByText('Old department')).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Back to Software Selection' })[0])
    expect(onSelectTab.mock.calls.at(-1)?.[1]).not.toHaveProperty('project')
  })

  it('requires a new selection when reopening a draft with a retired plan', () => {
    render(
      <EmployeeRequestSoftwareDetailsView
        initialParams={{ softwareId: 'figma', plan: 'team', usageMode: 'personal', reason: 'Needed for work' }}
        onSelectTab={vi.fn()}
      />
    )

    expect(screen.getByRole('combobox', { name: 'Desired Plan' })).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Continue to Review' })).toBeDisabled()
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
