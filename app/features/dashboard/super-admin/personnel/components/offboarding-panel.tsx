import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useOffboardingCaseList,
  getOffboardingCaseListQueryKey
} from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { useOffboardingCaseChangeLastDay } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-change-last-day'
import { useOffboardingCaseMarkLeft } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-mark-left'
import { useOffboardingCaseCancel } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-cancel'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminField, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { PersonnelForm, value, readSuccessor, successorFields } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { handingOver, offboardingStates } from '../enums/offboarding-state'

type Action = { kind: 'change' | 'left' | 'cancel'; id: string }
export function OffboardingPanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [state, setState] = useState<'HANDING_OVER' | 'LEFT'>('HANDING_OVER')
  const [action, setAction] = useState<Action | null>(null)
  const query = useOffboardingCaseList({ page, pageSize: 20, state })
  const feedback = usePersonnelMutationFeedback([getOffboardingCaseListQueryKey()], () => setAction(null))
  const change = useOffboardingCaseChangeLastDay({ mutation: { ...feedback, retry: false } })
  const left = useOffboardingCaseMarkLeft({ mutation: { ...feedback, retry: false } })
  const cancel = useOffboardingCaseCancel({ mutation: { ...feedback, retry: false } })
  const pending = change.isPending || left.isPending || cancel.isPending
  const data = query.data?.data
  const titles = {
    change: 'changeLastDay',
    left: 'markLeft',
    cancel: 'cancelEvent'
  } as const
  return (
    <section className='space-y-5'>
      <div className='max-w-xs'>
        <AdminField label={translate('offboardingFilter')}>
          <select
            className={adminInputClass}
            value={state}
            onChange={(event) => {
              setState(event.target.value === 'LEFT' ? 'LEFT' : 'HANDING_OVER')
              setPage(1)
            }}
          >
            <option value='HANDING_OVER'>{translate('codes.HANDING_OVER')}</option>
            <option value='LEFT'>{translate('codes.LEFT')}</option>
          </select>
        </AdminField>
      </div>
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
          basis={action.kind !== 'left' ? 'note' : false}
          onClose={() => setAction(null)}
          fields={
            action.kind === 'change'
              ? [{ name: 'lastWorkingDay', type: 'date' }, { name: 'reason', maxLength: 1000 }, ...successorFields]
              : action.kind === 'left'
                ? []
                : [{ name: 'reason', maxLength: 1000 }]
          }
          onSubmit={(values) => {
            if (pending) return
            if (action.kind === 'change')
              change.mutate({
                id: action.id,
                data: {
                  lastWorkingDay: value(values, 'lastWorkingDay'),
                  reason: value(values, 'reason'),
                  groundsNote: value(values, 'groundsNote'),
                  successor: readSuccessor(values)
                }
              })
            else if (action.kind === 'left' && action.id) left.mutate({ id: action.id, data: {} })
            else if (action.id)
              cancel.mutate({
                id: action.id,
                data: { reason: value(values, 'reason'), groundsNote: value(values, 'groundsNote') }
              })
          }}
        />
      )}
    </section>
  )
}
