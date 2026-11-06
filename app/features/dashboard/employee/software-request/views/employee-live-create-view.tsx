import { useRef, useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeRequestGuide } from '../components/employee-request-guide'
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
      <nav aria-label={translate('mode')} className='flex gap-1 overflow-x-auto border-b border-border/60 pb-3'>
        {(['individual', 'group', 'proposal', 'renewal', 'return'] as const).map((option) => (
          <button
            key={option}
            type='button'
            aria-pressed={mode === option}
            className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors ${mode === option ? 'bg-primary-soft text-primary-ink' : 'text-muted-foreground hover:bg-surface-subtle'}`}
            onClick={() => setSearchParams({ tab: 'create-request', mode: option })}
          >
            {translate(option)}
          </button>
        ))}
      </nav>
      <div className='grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]'>
        <LiveCreateForm
          key={`${mode}:${searchParams.get('assignmentId') ?? ''}`}
          mode={mode}
          assignmentId={searchParams.get('assignmentId') ?? ''}
          onSelectTab={onSelectTab}
        />
        <aside className='hidden min-w-0 2xl:block'>
          <EmployeeRequestGuide needsPreview={mode === 'individual' || mode === 'group'} group={mode === 'group'} />
        </aside>
      </div>
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
          const field = event.nativeEvent.target
          if (
            (field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement ||
              field instanceof HTMLSelectElement) &&
            field.name
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
                  onChange={setAssignmentId}
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
                <EmployeeField label={translate('term')}>
                  <EmployeeInput
                    required
                    type='number'
                    name='termMonths'
                    min={1}
                    max={preview?.preview?.termLimit?.maxMonths ?? preview?.groupCheck?.termLimit?.maxMonths ?? 12}
                    step={1}
                    defaultValue={1}
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
          <div className='sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-border/60 bg-surface pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
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
