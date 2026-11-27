import { PROVISIONING_TYPE } from '~/entities/request/enums/provisioning-type'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmployeeFormStep } from '../../shared/components/employee-layout'
import {
  EmployeeFormErrors,
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeeSection,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { readRequestFields, useLiveRequestForm, type RequestMode } from '../hooks/use-live-request-form'
import { LiveRequestPreview } from './live-request-preview'
import { LiveGroupMembers } from './live-group-members'
import { LiveGroupEligibility } from './live-group-eligibility'
import { EmployeeCatalogPicker } from './employee-catalog-picker'
import { EmployeeCatalogPlanDetails } from './employee-catalog-plan-details'
import { EmployeeAssignmentPicker } from './employee-assignment-picker'
import { useRequestAssignments } from '../hooks/use-request-assignments'
import { useEmployeeCatalogSelection } from '../hooks/use-employee-catalog-selection'
import type { EmployeeTabKey } from '../../enums'
import { TermMonthsField } from '~/entities/request/components/term-months-field'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { termRule } from '~/entities/request/term-months'

export function LiveCreateForm({
  mode,
  assignmentId,
  initialPlanId,
  onSelectTab,
  onDirty,
  onBusyChange
}: {
  mode: Exclude<RequestMode, 'proposal'>
  assignmentId: string
  initialPlanId: string
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  onDirty: () => void
  onBusyChange: (busy: boolean) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { t: flow } = useTranslation('requestFlow')
  const { formatDate } = useWorkspaceFormat()
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedAssignmentId, setAssignmentId] = useState(assignmentId)
  const [renewalLongTerm, setRenewalLongTerm] = useState(false)
  const assignments = useRequestAssignments(mode)
  const selectedAssignment = assignments.items.find((item) => item.assignmentId === selectedAssignmentId)
  const selection = useEmployeeCatalogSelection(initialPlanId)
  const { plan, setPlan } = selection
  const workflow = useLiveRequestForm(
    mode,
    (id, returned) => onSelectTab(returned ? 'return-detail' : 'request-detail', { id }),
    () => onSelectTab('my-requests')
  )
  const busy = workflow.submit.isPending || workflow.preview.isPending
  useEffect(() => {
    onBusyChange(busy)
  }, [busy, onBusyChange])
  const needsPreview = mode === 'individual' || mode === 'group'
  const preview = workflow.previewResult
  const selectionIncomplete =
    (needsPreview &&
      (!selection.ready || (mode === 'group' && (workflow.members.length < 2 || workflow.members.length > 10)))) ||
    ((mode === 'renewal' || mode === 'return') &&
      (!selectedAssignment ||
        assignments.query.isFetching ||
        assignments.query.isError ||
        (mode === 'renewal' && workflow.renewalWindow?.assignmentId === selectedAssignmentId)))
  const onReview = () => {
    if (!selectionIncomplete && formRef.current?.reportValidity())
      workflow.preview.mutate(readRequestFields(formRef.current))
  }
  return (
    <EmployeeSection>
      {mode === 'renewal' && workflow.renewalWindow?.assignmentId === selectedAssignmentId && (
        <p role='status' className='text-sm text-muted-foreground'>
          {workflow.renewalWindow.opensOn && Number.isFinite(Date.parse(workflow.renewalWindow.opensOn))
            ? flow('renewalWindow', { date: formatDate(workflow.renewalWindow.opensOn) })
            : flow('renewalWindowUnknown')}
        </p>
      )}
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
            field.name &&
            field.name !== 'businessReason'
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
              <EmployeeFormStep
                step={1}
                title={translate('ui.create.softwareStep')}
                hint={translate('ui.create.softwareStepHint')}
              >
                <EmployeeCatalogPicker
                  value={plan}
                  initialPlanId={initialPlanId}
                  onSelectPlanId={(id) => {
                    onDirty()
                    selection.setPlanId(id)
                  }}
                  onChange={(choice) => {
                    onDirty()
                    setPlan(choice)
                    workflow.clearPreview()
                  }}
                  disabled={busy || workflow.feedback.blocked}
                  invalid={workflow.feedback.invalidFields.includes('planId')}
                />
                <EmployeeCatalogPlanDetails selection={selection} />
              </EmployeeFormStep>
            )}
            {mode === 'group' && (
              <EmployeeFormStep step={2} title={translate('members')}>
                <LiveGroupMembers
                  members={workflow.members}
                  disabled={busy || workflow.feedback.blocked}
                  invalid={workflow.feedback.invalidFields.some(
                    (field) => field === 'lines' || field.startsWith('lines.')
                  )}
                  onChange={(members) => {
                    onDirty()
                    workflow.setMembers(members)
                    workflow.clearPreview()
                  }}
                />
              </EmployeeFormStep>
            )}
            <EmployeeFormStep
              step={mode === 'group' ? 3 : needsPreview ? 2 : 1}
              title={translate('ui.create.detailsStep')}
              hint={translate('ui.create.detailsStepHint')}
            >
              <div className='grid items-start gap-5 sm:grid-cols-2'>
                {(mode === 'renewal' || mode === 'return') && (
                  <EmployeeAssignmentPicker
                    assignments={assignments}
                    value={selectedAssignmentId}
                    onChange={(id) => {
                      onDirty()
                      setAssignmentId(id)
                      setRenewalLongTerm(false)
                    }}
                    disabled={busy || workflow.feedback.blocked}
                    invalid={workflow.feedback.invalidFields.includes('assignmentId')}
                  />
                )}
                {mode === 'renewal' && (
                  <div className='space-y-2'>
                    <EmployeeField label={translate('extensionMonths')}>
                      <EmployeeInput
                        required={!renewalLongTerm}
                        type='number'
                        name='extensionMonths'
                        min={1}
                        max={selectedAssignment?.provisioningType === PROVISIONING_TYPE.K1 ? 9 : 12}
                        step={1}
                        defaultValue={1}
                        placeholder={translate('ui.placeholders.extensionMonths')}
                        disabled={!selectedAssignment || renewalLongTerm}
                      />
                    </EmployeeField>
                    {(selectedAssignment?.provisioningType === PROVISIONING_TYPE.K2 ||
                      selectedAssignment?.provisioningType === PROVISIONING_TYPE.K5) && (
                      <label className='flex min-h-11 items-center gap-2 text-sm'>
                        <input
                          type='checkbox'
                          name='longTerm'
                          checked={renewalLongTerm}
                          disabled={!selectedAssignment}
                          onChange={(event) => setRenewalLongTerm(event.target.checked)}
                        />
                        {flow('longTerm')}
                      </label>
                    )}
                  </div>
                )}
                {needsPreview && (
                  <TermMonthsField
                    key={plan?.id ?? 'none'}
                    subject={plan?.provisioningType}
                    refusal={preview?.preview?.termRefusal ?? preview?.groupCheck?.termRefusal}
                    invalid={workflow.feedback.invalidFields.includes('termMonths')}
                    inputClassName={employeeInputClass}
                    placeholder={translate('ui.placeholders.termMonths')}
                    onChange={workflow.clearPreview}
                  />
                )}
              </div>
              <EmployeeField label={translate('reason')}>
                <textarea
                  required
                  name='businessReason'
                  maxLength={1000}
                  rows={3}
                  placeholder={translate('ui.placeholders.businessReason')}
                  className={employeeInputClass}
                />
              </EmployeeField>
            </EmployeeFormStep>
          </fieldset>
          {preview && (
            <section className='soft-panel space-y-3 p-4 sm:p-5' aria-label={translate('preview')}>
              <h3 className='section-accent font-semibold'>{translate('preview')}</h3>
              {preview.preview && (
                <LiveRequestPreview preview={preview.preview} termAsked={termRule(plan?.provisioningType).asked} />
              )}
              {preview.groupCheck && <LiveGroupEligibility check={preview.groupCheck} members={workflow.members} />}
              {!preview.canSubmit && (
                <p role='status' className='text-sm text-warning-ink'>
                  {translate(mode === 'group' ? 'groupInvalid' : 'cannotSubmit')}
                </p>
              )}
            </section>
          )}
          {workflow.feedback.unknownOutcome && (
            <p role='status' className='text-sm text-warning-ink'>
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
