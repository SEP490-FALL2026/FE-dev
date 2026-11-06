import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useOffboardingCaseList,
  getOffboardingCaseListQueryKey
} from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { useOffboardingCaseRecord } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-record'
import { useOffboardingCaseChangeLastDay } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-change-last-day'
import { useOffboardingCaseMarkLeft } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-mark-left'
import { useOffboardingCaseCancel } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-cancel'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { PersonnelForm, readBasis, value, readSuccessor, successorFields } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { handingOver, offboardingStates } from '../enums/offboarding-state'

type Action = { kind: 'record' | 'change' | 'left' | 'cancel'; id?: string }
export function OffboardingPanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<Action | null>(null)
  const query = useOffboardingCaseList({ page, pageSize: 20 })
  const feedback = usePersonnelMutationFeedback([getOffboardingCaseListQueryKey()], () => setAction(null))
  const record = useOffboardingCaseRecord({ mutation: { ...feedback, retry: false } })
  const change = useOffboardingCaseChangeLastDay({ mutation: { ...feedback, retry: false } })
  const left = useOffboardingCaseMarkLeft({ mutation: { ...feedback, retry: false } })
  const cancel = useOffboardingCaseCancel({ mutation: { ...feedback, retry: false } })
  const pending = record.isPending || change.isPending || left.isPending || cancel.isPending
  const data = query.data?.data
  const titles = {
    record: 'recordOffboarding',
    change: 'changeLastDay',
    left: 'markLeft',
    cancel: 'cancelEvent'
  } as const
  return (
    <section className='space-y-5'>
      <button className={adminPrimaryClass} onClick={() => setAction({ kind: 'record' })}>
        {translate('recordOffboarding')}
      </button>
      <AdminQueryState query={query}>
        <PersonnelList empty={!data?.items.length}>
          {data?.items.map((item) => (
            <PersonnelCard
              key={item.id}
              title={item.employee.fullName}
              actions={
                item.state === handingOver && !item.closed ? (
                  <>
                    <button
                      disabled={item.pastLastDay}
                      className={adminButtonClass}
                      onClick={() => setAction({ kind: 'change', id: item.id })}
                    >
                      {translate('changeLastDay')}
                    </button>
                    <button className={adminButtonClass} onClick={() => setAction({ kind: 'left', id: item.id })}>
                      {translate('markLeft')}
                    </button>
                    <button className={adminButtonClass} onClick={() => setAction({ kind: 'cancel', id: item.id })}>
                      {translate('cancelEvent')}
                    </button>
                  </>
                ) : undefined
              }
            >
              <p className='font-mono tabular-nums'>
                {translate('lastDay', { date: formatDate(item.lastWorkingDay) })}
              </p>
              <PersonnelCode code={item.state} values={offboardingStates} />
              {item.pastLastDay && <p className='text-warning'>{translate('overdue')}</p>}
            </PersonnelCard>
          ))}
        </PersonnelList>
        <AdminPagination pagination={data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {action && (
        <PersonnelForm
          title={translate(titles[action.kind])}
          pending={pending}
          basis={action.kind !== 'left'}
          onClose={() => setAction(null)}
          fields={
            action.kind === 'record'
              ? [
                  { name: 'employeeId', type: 'uuid' },
                  { name: 'lastWorkingDay', type: 'date' },
                  { name: 'accessBlockMode', options: ['WITH_LAST_DAY', 'BLOCK_NOW'] },
                  ...successorFields,
                  { name: 'cancelPendingTransfer', type: 'checkbox', optional: true }
                ]
              : action.kind === 'change'
                ? [{ name: 'lastWorkingDay', type: 'date' }, { name: 'reason', maxLength: 1000 }, ...successorFields]
                : action.kind === 'left'
                  ? []
                  : [{ name: 'reason', maxLength: 2000 }]
          }
          onSubmit={(values) => {
            if (pending) return
            if (action.kind === 'record')
              record.mutate({
                data: {
                  employeeId: value(values, 'employeeId'),
                  lastWorkingDay: value(values, 'lastWorkingDay'),
                  accessBlockMode: value(values, 'accessBlockMode') === 'BLOCK_NOW' ? 'BLOCK_NOW' : 'WITH_LAST_DAY',
                  grounds: readBasis(values),
                  successor: readSuccessor(values),
                  ...(values.get('cancelPendingTransfer') ? { cancelPendingTransfer: true as const } : {})
                }
              })
            else if (action.kind === 'change' && action.id)
              change.mutate({
                id: action.id,
                data: {
                  lastWorkingDay: value(values, 'lastWorkingDay'),
                  reason: value(values, 'reason'),
                  grounds: readBasis(values),
                  successor: readSuccessor(values)
                }
              })
            else if (action.kind === 'left' && action.id) left.mutate({ id: action.id, data: {} })
            else if (action.id)
              cancel.mutate({ id: action.id, data: { reason: value(values, 'reason'), grounds: readBasis(values) } })
          }}
        />
      )}
    </section>
  )
}
