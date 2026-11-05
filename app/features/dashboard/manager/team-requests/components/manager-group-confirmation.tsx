import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import type { GroupCheckResponseDtoDataLinesItem } from '~/shared/api/generated/model/group-requests/groupCheckResponseDtoDataLinesItem'
import { groupRequestCheck } from '~/shared/api/generated/operations/group-requests/group-request-check'
import { ManagerButton, ManagerMoney, ManagerQueryState } from '../../shared/components/manager-api-ui'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'
import { GROUP_ELIGIBILITY_REASON } from '../enums/group-eligibility'

export function ManagerGroupConfirmation({
  body,
  people,
  blocked,
  busy,
  onConfirm,
  onCancel,
  onEditDates
}: {
  body: GroupBodyDto
  people: readonly ManagerChoice[]
  blocked: boolean
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
  onEditDates?: (issues: GroupCheckResponseDtoDataLinesItem[]) => void
}) {
  const { t: translate } = useTranslation('manager')
  const { t: employeeTranslate } = useTranslation('employee')
  const query = useQuery({
    queryKey: ['manager-group-check', body],
    queryFn: ({ signal }) => groupRequestCheck(body, undefined, signal),
    retry: false
  })
  const check = !query.isError ? query.data?.data : null
  const eligible =
    check?.plan.eligible === true &&
    !check.tooManyLines &&
    check.lines.length === body.lines.length &&
    check.lines.every((line) => line.ok === true && body.lines.some((person) => person.employeeId === line.employeeId))
  const failures = new Map<string | null, ManagerChoice[]>()
  const dateIssues =
    check?.lines.filter(
      (line) =>
        !line.ok &&
        (line.reason === GROUP_ELIGIBILITY_REASON.END_DATE_REQUIRED ||
          line.reason === GROUP_ELIGIBILITY_REASON.END_DATE_TOO_EARLY)
    ) ?? []
  for (const line of check?.lines ?? []) {
    if (line.ok) continue
    const person = people.find((choice) => choice.value === line.employeeId) ?? {
      value: line.employeeId,
      label: line.employeeId
    }
    failures.set(line.reason, [...(failures.get(line.reason) ?? []), person])
  }
  return (
    <div className='space-y-4'>
      <ManagerQueryState query={query} />
      {check && (
        <>
          <ManagerMoney money={check.pricing.amount} />
          {!check.plan.eligible && (
            <p className='text-sm text-warning'>
              {employeeTranslate(`eligibility.${check.plan.reason}` as 'eligibility.KIND_NOT_MULTI_SEAT', {
                defaultValue: translate('validation')
              })}
            </p>
          )}
          {Array.from(failures, ([reason, affected]) => (
            <div key={reason ?? 'unknown'} className='space-y-2 border-l border-warning/40 pl-3 text-sm'>
              <p className='text-warning-ink'>
                {employeeTranslate(`eligibility.${reason}` as 'eligibility.END_DATE_REQUIRED', {
                  defaultValue: translate('validation')
                })}
              </p>
              <ul className='space-y-1'>
                {affected.map((person) => (
                  <li key={person.value} className='break-words'>
                    {person.label}
                    {person.description && <span className='ml-2 text-muted-foreground'>{person.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
      <div className='flex flex-wrap justify-end gap-3'>
        {!!dateIssues.length && onEditDates && (
          <ManagerButton disabled={busy} onClick={() => onEditDates(dateIssues)}>
            {translate('requestForm.editEndDates')}
          </ManagerButton>
        )}
        <ManagerButton disabled={busy} onClick={onCancel}>
          {translate('cancel')}
        </ManagerButton>
        <ManagerButton primary busy={busy} disabled={blocked || !eligible || query.isFetching} onClick={onConfirm}>
          {translate('confirm')}
        </ManagerButton>
      </div>
    </div>
  )
}
