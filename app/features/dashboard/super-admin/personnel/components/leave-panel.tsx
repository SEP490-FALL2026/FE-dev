import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useLongLeaveList,
  getLongLeaveListQueryKey
} from '~/shared/api/generated/operations/long-leaves/long-leave-list'
import { useLongLeaveStart } from '~/shared/api/generated/operations/long-leaves/long-leave-start'
import { useLongLeaveChangeReturnDate } from '~/shared/api/generated/operations/long-leaves/long-leave-change-return-date'
import { useLongLeaveConfirmReturn } from '~/shared/api/generated/operations/long-leaves/long-leave-confirm-return'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { PersonnelForm, readBasis, value } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { activeLeave, leaveStatuses } from '../enums/leave-status'

type Action = { kind: 'start' | 'change' | 'return'; id?: string }
export function LeavePanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<Action | null>(null)
  const query = useLongLeaveList({ page, pageSize: 20 })
  const feedback = usePersonnelMutationFeedback([getLongLeaveListQueryKey()], () => setAction(null))
  const start = useLongLeaveStart({ mutation: { ...feedback, retry: false } })
  const change = useLongLeaveChangeReturnDate({ mutation: { ...feedback, retry: false } })
  const confirm = useLongLeaveConfirmReturn({ mutation: { ...feedback, retry: false } })
  const pending = start.isPending || change.isPending || confirm.isPending
  const data = query.data?.data
  return (
    <section className='space-y-5'>
      <button className={adminPrimaryClass} onClick={() => setAction({ kind: 'start' })}>
        {translate('startLeave')}
      </button>
      <AdminQueryState query={query}>
        <PersonnelList empty={!data?.items.length}>
          {data?.items.map((item) => (
            <PersonnelCard
              key={item.id}
              title={item.employee.fullName}
              actions={
                item.status === activeLeave ? (
                  <>
                    <button className={adminButtonClass} onClick={() => setAction({ kind: 'change', id: item.id })}>
                      {translate('changeReturn')}
                    </button>
                    <button className={adminButtonClass} onClick={() => setAction({ kind: 'return', id: item.id })}>
                      {translate('confirmReturn')}
                    </button>
                  </>
                ) : undefined
              }
            >
              <p className='font-mono tabular-nums'>
                {translate('leaveDates', { start: formatDate(item.startedOn), end: formatDate(item.approvedReturnOn) })}
              </p>
              <PersonnelCode code={item.status} values={leaveStatuses} />
              {item.overdueReturn && <p className='text-warning'>{translate('overdue')}</p>}
            </PersonnelCard>
          ))}
        </PersonnelList>
        <AdminPagination pagination={data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {action && (
        <PersonnelForm
          title={translate(
            action.kind === 'start' ? 'startLeave' : action.kind === 'change' ? 'changeReturn' : 'confirmReturn'
          )}
          pending={pending}
          basis
          onClose={() => setAction(null)}
          fields={
            action.kind === 'start'
              ? [
                  { name: 'employeeId', type: 'uuid' },
                  { name: 'startedOn', type: 'date' },
                  { name: 'approvedReturnOn', type: 'date' }
                ]
              : [{ name: action.kind === 'change' ? 'newApprovedReturnOn' : 'returnedOn', type: 'date' }]
          }
          onSubmit={(values) => {
            if (pending) return
            const grounds = readBasis(values)
            if (action.kind === 'start')
              start.mutate({
                data: {
                  employeeId: value(values, 'employeeId'),
                  startedOn: value(values, 'startedOn'),
                  approvedReturnOn: value(values, 'approvedReturnOn'),
                  grounds
                }
              })
            else if (action.kind === 'change' && action.id)
              change.mutate({
                id: action.id,
                data: { newApprovedReturnOn: value(values, 'newApprovedReturnOn'), grounds }
              })
            else if (action.id)
              confirm.mutate({ id: action.id, data: { returnedOn: value(values, 'returnedOn'), grounds } })
          }}
        />
      )}
    </section>
  )
}
