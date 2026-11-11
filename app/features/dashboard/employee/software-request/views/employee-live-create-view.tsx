import { useRef, useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useSearchParams } from 'react-router'
import {
  EmployeeFormErrors,
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeeSection,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { readRequestFields, useLiveRequestForm, type RequestMode } from '../hooks/use-live-request-form'
import { LiveRequestPreview } from '../components/live-request-preview'
import { LiveGroupMembers } from '../components/live-group-members'
import { LiveGroupEligibility } from '../components/live-group-eligibility'
import { EmployeeCatalogPicker } from '../components/employee-catalog-picker'
import { EmployeeCatalogPlanDetails } from '../components/employee-catalog-plan-details'
import { EmployeeAssignmentPicker } from '../components/employee-assignment-picker'
import { useRequestAssignments } from '../hooks/use-request-assignments'
import { useEmployeeCatalogSelection } from '../hooks/use-employee-catalog-selection'
import type { EmployeeTabKey } from '../../enums'
import { EmployeeRequestModeNav } from '../components/employee-request-mode-nav'
import { EmployeeRenewalSummary } from '../components/employee-renewal-summary'
import { GroupLineFeedback } from '~/entities/request/components/group-line-feedback'

export function EmployeeLiveCreateView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const value = searchParams.get('mode')
  const mode: RequestMode =
    value === 'group' || value === 'proposal' || value === 'renewal' || value === 'return' ? value : 'individual'
  if (value === 'service') {
    const next = new URLSearchParams(searchParams)
    next.set('mode', 'individual')
    return <Navigate replace to={{ pathname: location.pathname, search: next.toString() }} />
  }
  return (
    <div className='space-y-6'>
      <EmployeePageHeader title={translate('create')} icon={FilePlus2} />
      <EmployeeRequestModeNav mode={mode} onChange={(mode) => setSearchParams({ tab: 'create-request', mode })} />
      <p className='max-w-3xl text-sm leading-6 text-muted-foreground'>{translate(`requestUx.modes.${mode}`)}</p>
      <LiveCreateForm
        key={`${mode}:${searchParams.get('assignmentId') ?? ''}`}
        mode={mode}
        assignmentId={searchParams.get('assignmentId') ?? ''}
        onSelectTab={onSelectTab}
      />
    </div>
  )
}

function LiveCreateForm({
  mode,
  assignmentId,
  onSelectTab
}: {
  mode: RequestMode
  assignmentId: string
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { t: flow } = useTranslation('requestFlow')
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedAssignmentId, setAssignmentId] = useState(assignmentId)
  const assignments = useRequestAssignments(mode)
  const selectedAssignment = assignments.items.find((item) => item.assignmentId === selectedAssignmentId)
  const selection = useEmployeeCatalogSelection()
  const { plan, setPlan } = selection
  const workflow = useLiveRequestForm(
    mode,
    (id, returned) => onSelectTab(returned ? 'return-detail' : 'request-detail', { id }),
    () => onSelectTab('my-requests')
  )
  const busy = workflow.submit.isPending || workflow.preview.isPending
  const needsPreview = mode === 'individual' || mode === 'group'
  const preview = workflow.previewResult
  const groupFailures = workflow.feedback.groupFailures
  const selectionIncomplete =
    (needsPreview &&
      (!selection.ready || (mode === 'group' && (workflow.members.length < 2 || workflow.members.length > 10)))) ||
    ((mode === 'renewal' || mode === 'return') &&
      (!selectedAssignment || assignments.query.isFetching || assignments.query.isError))
  const onReview = () => {
    if (!selectionIncomplete && formRef.current?.reportValidity())
      workflow.preview.mutate(readRequestFields(formRef.current))
  }
  return (
    <EmployeeSection title={translate(mode)}>
      {mode === 'return' && <p className='text-sm text-muted-foreground'>{translate('returnHint')}</p>}
      <form
        ref={formRef}
        className='space-y-5'
        onChange={(event) => {
          workflow.feedback.clearValidation()
          const field = event.nativeEvent.target
          if (
            (field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement ||
              field instanceof HTMLSelectElement) &&
            field.name &&
            field.name !== 'businessReason' &&
            field.name !== 'manyPaidSoftwareReason'
          )
            workflow.clearPreview()
        }}
        onSubmit={(event) => {
          event.preventDefault()
          if (!busy && !workflow.feedback.blocked && !selectionIncomplete && (!needsPreview || selection.canSubmit))
            workflow.submit.mutate({ fields: readRequestFields(event.currentTarget), draft: false })
        }}
      >
        <EmployeeFormErrors fields={workflow.feedback.invalidFields}>
          <fieldset disabled={busy || workflow.feedback.blocked} className='space-y-5'>
            {needsPreview && (
              <>
                <EmployeeCatalogPicker
                  value={plan}
                  onChange={(choice) => {
                    setPlan(choice)
                    workflow.setMembers((members) => members.map((member) => ({ ...member, reasonRequired: false })))
                    workflow.clearPreview()
                  }}
                  disabled={busy || workflow.feedback.blocked}
                  invalid={workflow.feedback.invalidFields.includes('planId')}
                />
                <EmployeeCatalogPlanDetails selection={selection} />
              </>
            )}
            <div className='grid items-start gap-5 sm:grid-cols-2'>
              {(mode === 'renewal' || mode === 'return') && (
                <EmployeeAssignmentPicker
                  assignments={assignments}
                  value={selectedAssignmentId}
                  onChange={(id) => {
                    setAssignmentId(id)
                    workflow.clearPreview(true)
                    workflow.feedback.clearValidation()
                  }}
                  disabled={busy || workflow.feedback.blocked}
                  invalid={workflow.feedback.invalidFields.includes('assignmentId')}
                />
              )}
              {mode === 'renewal' && (
                <EmployeeField label={translate('extensionMonths')}>
                  <EmployeeInput
                    required
                    type='number'
                    name='extensionMonths'
                    min={1}
                    max={12}
                    step={1}
                    defaultValue={1}
                    disabled={!selectedAssignment}
                  />
                </EmployeeField>
              )}
              {mode !== 'return' && mode !== 'renewal' && (
                <EmployeeField label={flow('endDate')}>
                  <EmployeeInput
                    required={preview?.preview?.termRequired}
                    type='date'
                    name='expectedEndDate'
                    max={preview?.preview?.maxEndDate ?? preview?.groupCheck?.maxEndDate}
                  />
                </EmployeeField>
              )}
              {mode === 'proposal' && (
                <>
                  <EmployeeField label={translate('softwareName')}>
                    <EmployeeInput required name='softwareName' maxLength={200} />
                  </EmployeeField>
                  <EmployeeField label={translate('homepage')}>
                    <EmployeeInput required type='url' name='homepageUrl' maxLength={500} />
                  </EmployeeField>
                  <EmployeeField label={translate('expectedUsers')}>
                    <EmployeeInput required type='number' name='expectedUsers' min={1} max={1000000} defaultValue={1} />
                  </EmployeeField>
                </>
              )}
            </div>
            {mode === 'renewal' && selectedAssignment && (
              <EmployeeRenewalSummary assignment={selectedAssignment} failure={workflow.feedback.failure} />
            )}
            {(mode === 'renewal' || mode === 'return') && (
              <EmployeeButton onClick={() => onSelectTab('my-software')}>
                {translate('requestUx.chooseFromSoftware')}
              </EmployeeButton>
            )}
            {mode === 'group' && (
              <LiveGroupMembers
                members={workflow.members}
                disabled={busy || workflow.feedback.blocked}
                invalid={workflow.feedback.invalidFields.some(
                  (field) => field === 'lines' || field.startsWith('lines.')
                )}
                onChange={(members) => {
                  workflow.setMembers(members)
                  workflow.clearPreview()
                }}
              />
            )}
            {mode === 'group' && (
              <GroupLineFeedback
                failures={groupFailures}
                people={workflow.members.map((member) => ({
                  employeeId: member.employeeId,
                  name: member.fullName,
                  email: member.workEmail
                }))}
              />
            )}
            {(mode === 'individual' || mode === 'renewal') && workflow.requiresReason && (
              <EmployeeField label={flow('manyReason')}>
                <textarea
                  required
                  name='manyPaidSoftwareReason'
                  maxLength={1000}
                  rows={3}
                  className={employeeInputClass}
                />
              </EmployeeField>
            )}
            {mode === 'proposal' ? (
              <>
                <EmployeeField label={translate('purpose')}>
                  <textarea className={employeeInputClass} required name='purpose' maxLength={1000} rows={3} />
                </EmployeeField>
                <EmployeeField label={translate('dataDescription')}>
                  <textarea className={employeeInputClass} required name='dataDescription' maxLength={1000} rows={3} />
                </EmployeeField>
              </>
            ) : (
              <EmployeeField label={translate('reason')}>
                <textarea required name='businessReason' maxLength={1000} rows={3} className={employeeInputClass} />
              </EmployeeField>
            )}
          </fieldset>
          {preview && (
            <section className='space-y-3 border-t border-border/60 pt-5' aria-label={translate('preview')}>
              <h3 className='font-semibold'>{translate('preview')}</h3>
              {preview.preview && <LiveRequestPreview preview={preview.preview} />}
              {preview.groupCheck && <LiveGroupEligibility check={preview.groupCheck} members={workflow.members} />}
              {!preview.canSubmit && (
                <p role='status' className='text-sm text-warning'>
                  {translate(mode === 'group' ? 'groupInvalid' : 'cannotSubmit')}
                </p>
              )}
            </section>
          )}
          {workflow.feedback.unknownOutcome && (
            <p role='status' className='text-sm text-warning'>
              {translate('errors.unknownOutcome')}
            </p>
          )}
          <div className='flex flex-wrap justify-end gap-3 border-t border-border/60 pt-5'>
            {needsPreview && (
              <EmployeeButton
                type='button'
                disabled={busy || workflow.feedback.blocked || selectionIncomplete}
                onClick={() => {
                  if (!selectionIncomplete && formRef.current?.reportValidity())
                    workflow.submit.mutate({ fields: readRequestFields(formRef.current), draft: true })
                }}
              >
                {translate('saveDraft')}
              </EmployeeButton>
            )}
            {needsPreview && !preview ? (
              <EmployeeButton
                primary
                type='button'
                busy={workflow.preview.isPending}
                disabled={workflow.submit.isPending || workflow.feedback.blocked || selectionIncomplete}
                onClick={onReview}
              >
                {workflow.feedback.retrySeconds
                  ? translate('retryAfter', { seconds: workflow.feedback.retrySeconds })
                  : translate('review')}
              </EmployeeButton>
            ) : (
              <EmployeeButton
                primary
                type='submit'
                busy={workflow.submit.isPending}
                disabled={
                  busy ||
                  workflow.feedback.blocked ||
                  selectionIncomplete ||
                  (needsPreview && (!preview?.canSubmit || !selection.canSubmit))
                }
              >
                {workflow.feedback.retrySeconds
                  ? translate('retryAfter', { seconds: workflow.feedback.retrySeconds })
                  : translate('submit')}
              </EmployeeButton>
            )}
          </div>
        </EmployeeFormErrors>
      </form>
    </EmployeeSection>
  )
}
