import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useAccessRequestLineList,
  getAccessRequestLineListQueryKey
} from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { accessRequestLineWithdraw } from '~/shared/api/generated/operations/group-requests/access-request-line-withdraw'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import {
  ManagerButton,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { LINE_STATE } from '../enums/withdrawal'
import { ManagerWithdrawDialog } from './manager-withdraw-dialog'

export function ManagerLineWithdrawals({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage('withdrawLinePage')
  const query = useAccessRequestLineList(id, { page: paging.page, pageSize: paging.pageSize })
  const data = !query.isError ? query.data?.data : null
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null)
  const action = useManagerAction({
    mutationFn: ({ employeeId, reason }: { employeeId: string; reason: string }) =>
      accessRequestLineWithdraw(id, employeeId, { reason }),
    invalidate: [
      getAccessRequestLineListQueryKey(id),
      getAccessRequestGetQueryKey(id),
      getAccessRequestTimingsGetQueryKey(id),
      getNeedDecisionListQueryKey(),
      getSpendQueueListQueryKey()
    ],
    onSuccess: () => setSelected(null)
  })
  return (
    <ManagerSection title={translate('participants')}>
      <ManagerQueryState query={query} empty={!data?.items.length} />
      {data?.items.map((line) => (
        <div
          key={line.employee.employeeId}
          className='flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-3'
        >
          <span className='max-w-64 truncate text-sm' title={line.employee.fullName}>
            {line.employee.fullName}
          </span>
          <ManagerStatus value={line.state} />
          {[
            LINE_STATE.AWAITING_NEED,
            LINE_STATE.NEED_CONFIRMED,
            LINE_STATE.APPROVED,
            LINE_STATE.EXECUTING,
            LINE_STATE.FAILED
          ].some((state) => state === line.state) && (
            <ManagerButton
              disabled={action.blocked}
              onClick={() => setSelected({ id: line.employee.employeeId, name: line.employee.fullName })}
            >
              {translate('integration.withdrawPerson')}
            </ManagerButton>
          )}
        </div>
      ))}
      <ManagerPagination pagination={data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      {selected && (
        <ManagerWithdrawDialog
          key={selected.id}
          title={translate('integration.withdrawNamed', { name: selected.name })}
          action={action}
          onClose={() => setSelected(null)}
          onConfirm={(reason) => action.mutate({ employeeId: selected.id, reason })}
        />
      )}
    </ManagerSection>
  )
}
