import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import { groupRequestCheck } from '~/shared/api/generated/operations/group-requests/group-request-check'
import { ManagerButton, ManagerMoney, ManagerQueryState } from '../../shared/components/manager-api-ui'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'

export function ManagerGroupConfirmation({
  body,
  people,
  blocked,
  busy,
  onConfirm,
  onCancel
}: {
  body: GroupBodyDto
  people: readonly ManagerChoice[]
  blocked: boolean
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
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
    !check.tooFewLines &&
    !check.termBeyondLimit &&
    check.lines.length === body.lines.length &&
    check.lines.every((line) => line.ok === true && body.lines.some((person) => person.employeeId === line.employeeId))
  const failures = new Map<string | null, ManagerChoice[]>()
  for (const line of check?.lines ?? []) {
    if (line.ok) continue
    const person = people.find((choice) => choice.value === line.employeeId) ?? {
      value: line.employeeId,
      label: translate('unknownPerson')
    }
    failures.set(line.reason, [...(failures.get(line.reason) ?? []), person])
  }
  return (
    <div className='space-y-4'>
      <ManagerQueryState query={query} />
      {check && (
        <>
          <ManagerMoney money={check.pricing.amount} />
          <p className='text-sm text-muted-foreground'>
            {translate('termLimit', { months: check.termLimit.maxMonths })}
          </p>
          {check.tooFewLines && (
            <p role='status' className='text-sm text-warning'>
              {translate('groupMinimum')}
            </p>
          )}
          {check.termBeyondLimit && (
            <p role='status' className='text-sm text-warning'>
              {translate('termLimit', { months: check.termLimit.maxMonths })}
            </p>
          )}
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
                {employeeTranslate(`eligibility.${reason}` as 'eligibility.ALREADY_ASSIGNED', {
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
