import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { EmployeeSelect } from '../../shared/components/employee-select'
import type { useRequestAssignments } from '../hooks/use-request-assignments'

export function EmployeeAssignmentPicker({
  assignments,
  value,
  onChange,
  disabled,
  invalid
}: {
  assignments: ReturnType<typeof useRequestAssignments>
  value: string
  onChange: (id: string) => void
  disabled: boolean
  invalid: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const choices = assignments.items.map((item) => ({
    value: item.assignmentId,
    label: `${item.application.name} · ${item.plan.name}`,
    description: `${translate(`softwareRights.statuses.${item.status}`)} · ${translate('requestAssignment.period', { from: formatDate(item.effectiveFrom), to: item.expectedEndDate ? formatDate(item.expectedEndDate) : translate('requestAssignment.noEnd') })}`
  }))
  const selected = choices.find((choice) => choice.value === value)
  const renewal = assignments.mode === 'renewal'
  const missing = assignments.query.isSuccess && !assignments.query.isFetching && !!value && !selected
  return (
    <div className='grid min-w-0 content-start gap-2'>
      <input type='hidden' name='assignmentId' value={selected?.value ?? ''} />
      <label htmlFor={fieldId} className='text-sm font-medium'>
        {translate('requestAssignment.label')}
        <span aria-hidden='true' className='ml-1 text-danger'>
          *
        </span>
      </label>
      <EmployeeSelect
        id={fieldId}
        required
        value={selected?.value ?? ''}
        placeholder={translate('ui.placeholders.assignment')}
        options={choices}
        loading={assignments.query.isPending || assignments.query.isFetching}
        disabled={disabled || assignments.query.isPending || assignments.query.isError || assignments.query.isFetching}
        invalid={invalid || missing}
        aria-describedby={invalid || missing ? `${hintId} ${errorId}` : hintId}
        emptyText={translate(
          choices.length
            ? 'requestAssignment.noMatches'
            : renewal
              ? 'requestAssignment.emptyRenewal'
              : 'requestAssignment.emptyReturn'
        )}
        onChange={onChange}
      />
      <p id={hintId} className='text-xs leading-relaxed text-muted-foreground'>
        {translate(renewal ? 'requestAssignment.renewalHint' : 'requestAssignment.returnHint')}
      </p>
      {assignments.query.isError && <EmployeeQueryState query={assignments.query} />}
      <p id={errorId} className='min-h-5 text-xs text-danger' aria-live='polite'>
        {missing ? translate('requestAssignment.unavailable') : invalid ? translate('errors.validation') : null}
      </p>
    </div>
  )
}
