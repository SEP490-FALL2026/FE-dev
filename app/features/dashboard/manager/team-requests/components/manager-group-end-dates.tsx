import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupCheckResponseDtoDataLinesItemReason } from '~/shared/api/generated/model/group-requests/groupCheckResponseDtoDataLinesItemReason'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'
import { ManagerButton, ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { GROUP_ELIGIBILITY_REASON } from '../enums/group-eligibility'

export function ManagerGroupEndDates({
  people,
  dates,
  issues,
  onChange
}: {
  people: readonly ManagerChoice[]
  dates: Record<string, string>
  issues: Record<string, GroupCheckResponseDtoDataLinesItemReason>
  onChange: (dates: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('manager')
  const { t: translateEmployee } = useTranslation('employee')
  const [commonDate, setCommonDate] = useState('')
  const id = useId()
  return (
    <fieldset className='space-y-3'>
      <legend className='text-sm font-medium'>{translate('requestForm.endDates')}</legend>
      <p className='text-xs leading-relaxed text-muted-foreground'>{translate('requestForm.endDateHint')}</p>
      {people.length > 1 && (
        <div className='flex flex-wrap items-start gap-3'>
          <div className='w-full sm:max-w-xs'>
            <ManagerField label={translate('requestForm.commonEndDate')}>
              <input
                type='date'
                className={managerInputClass}
                value={commonDate}
                onChange={(event) => setCommonDate(event.target.value)}
              />
            </ManagerField>
          </div>
          <div className='pt-7'>
            <ManagerButton
              onClick={() => onChange(Object.fromEntries(people.map((person) => [person.value, commonDate])))}
            >
              {translate('requestForm.applyEndDate')}
            </ManagerButton>
          </div>
        </div>
      )}
      <div className='divide-y divide-border/40'>
        {people.map((person, index) => {
          const issue = issues[person.value]
          const errorId = `${id}-${person.value}`
          return (
            <div
              key={person.value}
              className='grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)] sm:items-start'
            >
              <div className='min-w-0 pt-2 text-sm'>
                <p className='truncate font-medium' title={person.label}>
                  {person.label}
                </p>
                {person.description && (
                  <p className='truncate text-xs text-muted-foreground' title={person.description}>
                    {person.description}
                  </p>
                )}
              </div>
              <label className='grid gap-2 text-sm'>
                <span className='sr-only'>{translate('requestForm.endDateFor', { name: person.label })}</span>
                <input
                  type='date'
                  name={`lines.${index}.expectedEndDate`}
                  className={managerInputClass}
                  aria-label={translate('requestForm.endDateFor', { name: person.label })}
                  value={dates[person.value] ?? ''}
                  aria-invalid={!!issue || undefined}
                  aria-describedby={issue ? errorId : undefined}
                  required={issue === GROUP_ELIGIBILITY_REASON.END_DATE_REQUIRED}
                  onChange={(event) => onChange({ ...dates, [person.value]: event.target.value })}
                />
                <span id={errorId} className='min-h-5 text-xs text-danger'>
                  {issue === GROUP_ELIGIBILITY_REASON.END_DATE_REQUIRED &&
                    translateEmployee('eligibility.END_DATE_REQUIRED')}
                  {issue === GROUP_ELIGIBILITY_REASON.END_DATE_TOO_EARLY &&
                    translateEmployee('eligibility.END_DATE_TOO_EARLY')}
                </span>
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
