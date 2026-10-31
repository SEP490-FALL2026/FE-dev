import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import { groupRequestCheck } from '~/shared/api/generated/operations/group-requests/group-request-check'
import { ManagerButton, ManagerMoney, ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerGroupConfirmation({
  body,
  blocked,
  busy,
  onConfirm,
  onCancel
}: {
  body: GroupBodyDto
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
    check.lines.length === body.lines.length &&
    check.lines.every((line) => line.ok === true && body.lines.some((person) => person.employeeId === line.employeeId))
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
          {check.lines
            .filter((line) => !line.ok)
            .map((line) => (
              <p key={line.employeeId} className='text-sm text-warning'>
                {employeeTranslate(`eligibility.${line.reason}` as 'eligibility.END_DATE_REQUIRED', {
                  defaultValue: translate('validation')
                })}
              </p>
            ))}
        </>
      )}
      <div className='flex justify-end gap-3'>
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
