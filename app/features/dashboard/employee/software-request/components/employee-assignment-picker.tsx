import { useDeferredValue, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeChoiceSelect } from '../../shared/components/employee-choice-select'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'
import type { useRequestAssignments } from '../hooks/use-request-assignments'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()
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
  const [search, setSearch] = useState('')
  const term = normalize(useDeferredValue(search).trim())
  const errorId = useId()
  const choices = assignments.items.map((item) => ({
    value: item.assignmentId,
    label: `${item.application.name} · ${item.plan.name}`,
    description: `${translate(`softwareRights.statuses.${item.status}`)} · ${translate('requestAssignment.period', { from: formatDate(item.effectiveFrom), to: item.expectedEndDate ? formatDate(item.expectedEndDate) : translate('requestAssignment.noEnd') })}`
  }))
  const selected = choices.find((choice) => choice.value === value)
  const matches = choices.filter((choice) => normalize(`${choice.label} ${choice.description}`).includes(term))
  const renewal = assignments.mode === 'renewal'
  const missing = assignments.query.isSuccess && !assignments.query.isFetching && !!value && !selected
  return (
    <div
      className='min-w-0 space-y-2'
      role='group'
      aria-label={translate('requestAssignment.label')}
      aria-invalid={invalid || missing || undefined}
      aria-describedby={invalid || missing ? errorId : undefined}
    >
      <input type='hidden' name='assignmentId' value={selected?.value ?? ''} />
      <EmployeeChoiceSelect
        label={translate('requestAssignment.label')}
        placeholder={translate('requestAssignment.placeholder')}
        options={matches}
        selected={selected ? [selected] : []}
        onChange={(choices) => onChange(choices[0]?.value ?? '')}
        disabled={disabled || assignments.query.isPending || assignments.query.isError || assignments.query.isFetching}
        invalid={invalid || missing}
        hint={translate(renewal ? 'requestAssignment.renewalHint' : 'requestAssignment.returnHint')}
        search={{
          label: translate('requestAssignment.search'),
          placeholder: translate('requestAssignment.search'),
          value: search,
          onChange: setSearch
        }}
        state={
          assignments.query.isSuccess && !matches.length ? (
            <p role='status' className='px-2 py-3 text-sm text-muted-foreground'>
              {translate(
                choices.length
                  ? 'requestAssignment.noMatches'
                  : renewal
                    ? 'requestAssignment.emptyRenewal'
                    : 'requestAssignment.emptyReturn'
              )}
            </p>
          ) : null
        }
      />
      {assignments.query.isPending && (
        <p role='status' className='text-xs text-muted-foreground'>
          {translate('loading')}
        </p>
      )}
      {assignments.query.isError && <EmployeeQueryState query={assignments.query} />}
      <p id={errorId} className='min-h-5 text-xs text-danger' aria-live='polite'>
        {missing ? translate('requestAssignment.unavailable') : invalid ? translate('errors.validation') : null}
      </p>
    </div>
  )
}
