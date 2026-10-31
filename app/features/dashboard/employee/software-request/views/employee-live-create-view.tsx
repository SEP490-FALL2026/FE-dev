import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import {
  EmployeeFormErrors,
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeeSection,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { readRequestFields, useLiveRequestForm, type RequestMode } from '../hooks/use-live-request-form'
import { uuidPattern } from '../../shared/employee-identifiers'
import { LiveRequestPreview } from '../components/live-request-preview'
import { LiveGroupMembers } from '../components/live-group-members'
import { LiveGroupEligibility } from '../components/live-group-eligibility'
import type { EmployeeTabKey } from '../../enums'

export function EmployeeLiveCreateView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get('mode')
  const mode: RequestMode =
    value === 'group' || value === 'proposal' || value === 'renewal' || value === 'return' ? value : 'individual'
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold tracking-tight'>{translate('create')}</h1>
      <nav aria-label={translate('mode')} className='flex flex-wrap gap-2'>
        {(['individual', 'group', 'proposal', 'renewal', 'return'] as const).map((option) => (
          <button
            key={option}
            type='button'
            aria-pressed={mode === option}
            className={`min-h-11 rounded-md border px-3 text-sm ${mode === option ? 'border-primary bg-primary-soft text-primary' : 'border-border hover:bg-surface-subtle'}`}
            onClick={() => setSearchParams({ tab: 'create-request', mode: option })}
          >
            {translate(option)}
          </button>
        ))}
      </nav>
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
  const formRef = useRef<HTMLFormElement>(null)
  const workflow = useLiveRequestForm(
    mode,
    (id, returned) => onSelectTab(returned ? 'return-detail' : 'request-detail', { id }),
    () => onSelectTab('my-requests')
  )
  const busy = workflow.submit.isPending || workflow.preview.isPending
  const needsPreview = mode === 'individual' || mode === 'group'
  const preview = workflow.previewResult
  const onReview = () => {
    if (formRef.current?.reportValidity()) workflow.preview.mutate(readRequestFields(formRef.current))
  }
  return (
    <EmployeeSection title={translate(mode)}>
      {needsPreview && <p className='max-w-3xl text-sm text-muted-foreground'>{translate('catalogGap')}</p>}
      {mode === 'return' && <p className='text-sm text-muted-foreground'>{translate('returnHint')}</p>}
      <form
        ref={formRef}
        className='space-y-5'
        onChange={workflow.clearPreview}
        onSubmit={(event) => {
          event.preventDefault()
          if (!busy && !workflow.feedback.blocked)
            workflow.submit.mutate({ fields: readRequestFields(event.currentTarget), draft: false })
        }}
      >
        <EmployeeFormErrors fields={workflow.feedback.invalidFields}>
          <fieldset disabled={busy || workflow.feedback.blocked} className='space-y-5'>
            <div className='grid gap-5 sm:grid-cols-2'>
              {needsPreview && (
                <EmployeeField label={translate('planId')}>
                  <EmployeeInput required name='planId' pattern={uuidPattern} />
                </EmployeeField>
              )}
              {(mode === 'renewal' || mode === 'return') && (
                <EmployeeField label={translate('assignmentId')}>
                  <EmployeeInput required name='assignmentId' defaultValue={assignmentId} pattern={uuidPattern} />
                </EmployeeField>
              )}
              {mode === 'renewal' && (
                <EmployeeField label={translate('newEndDate')}>
                  <EmployeeInput required type='date' name='newExpectedEndDate' />
                </EmployeeField>
              )}
              {mode !== 'return' && mode !== 'renewal' && (
                <EmployeeField label={translate('term')}>
                  <EmployeeInput required type='number' name='termMonths' min={1} max={120} defaultValue={1} />
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
              {mode !== 'return' && (
                <>
                  <EmployeeField label={translate('project')}>
                    <EmployeeInput name='projectLabel' maxLength={200} />
                  </EmployeeField>
                  <EmployeeField label={translate('spendOn')}>
                    <EmployeeInput type='date' name='expectedSpendOn' />
                  </EmployeeField>
                </>
              )}
            </div>
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
            {(mode === 'group' || mode === 'renewal') && (
              <EmployeeField label={translate('termReason')}>
                <EmployeeInput name='termReason' maxLength={1000} />
              </EmployeeField>
            )}
            {mode === 'group' && (
              <LiveGroupMembers
                members={workflow.members}
                disabled={busy}
                onChange={(members) => {
                  workflow.setMembers(members)
                  workflow.clearPreview()
                }}
              />
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
                disabled={busy || workflow.feedback.blocked || (mode === 'group' && !workflow.members.length)}
                onClick={() => {
                  if (formRef.current?.reportValidity())
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
                disabled={
                  workflow.submit.isPending ||
                  workflow.feedback.blocked ||
                  (mode === 'group' && !workflow.members.length)
                }
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
                disabled={busy || workflow.feedback.blocked || (needsPreview && !preview?.canSubmit)}
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
