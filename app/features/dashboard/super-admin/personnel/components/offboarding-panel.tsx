import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { OffboardingDetail } from './offboarding-detail'
import { useTranslation } from 'react-i18next'
import {
  useOffboardingCaseList,
  getOffboardingCaseListQueryKey
} from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { useOffboardingCaseChangeLastDay } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-change-last-day'
import { useOffboardingCaseMarkLeft } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-mark-left'
import { useOffboardingCaseCancel } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-cancel'
import { getOffboardingCaseGetQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { getOffboardingCaseRightListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-right-list'
import { getOffboardingCaseChangeListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-change-list'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminField, adminButtonClass } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { AdminSectionTitle } from '../../shared/components/admin-page-header'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('offboardingId')
  const select = (id: string | null) =>
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (id) next.set('offboardingId', id)
      else next.delete('offboardingId')
      return next
    })
  const [state, setState] = useState<'HANDING_OVER' | 'LEFT'>('HANDING_OVER')
  const [action, setAction] = useState<Action | null>(null)
  const query = useOffboardingCaseList({ page, pageSize: 20, state }, { query: { enabled: !selectedId } })
  const feedback = usePersonnelMutationFeedback(
    [
      getOffboardingCaseListQueryKey(),
      ...(selectedId
        ? [
            getOffboardingCaseGetQueryKey(selectedId),
            getOffboardingCaseRightListQueryKey(selectedId),
            getOffboardingCaseChangeListQueryKey(selectedId)
          ]
        : [])
    ],
    () => setAction(null)
  )
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
      {selectedId ? (
        <OffboardingDetail
          key={selectedId}
          id={selectedId}
          onClose={() => select(null)}
          onAction={(kind) => setAction({ kind, id: selectedId })}
        />
      ) : (
        <>
          <div className='soft-panel flex flex-wrap items-end justify-between gap-4 p-4'>
            <AdminSectionTitle
              title={translate('ui.offboardingTitle')}
              hint={data ? translate('ui.recordCount', { count: data.pagination.totalItems }) : undefined}
            />
            <div className='w-full sm:w-72'>
              <AdminField label={translate('offboardingFilter')} description=''>
                <AdminSelect
                  value={state}
                  onChange={(next) => {
                    setState(next === 'LEFT' ? 'LEFT' : 'HANDING_OVER')
                    setPage(1)
                  }}
                  options={(['HANDING_OVER', 'LEFT'] as const).map((code) => ({
                    value: code,
                    label: translate(`codes.${code}`)
                  }))}
                  placeholder={translate('ui.pickOffboardingState')}
                />
              </AdminField>
            </div>
          </div>
          <AdminQueryState query={query}>
            <PersonnelList empty={!data?.items.length}>
              {data?.items.map((item) => (
                <PersonnelCard
                  key={item.id}
                  title={item.employee.fullName}
                  actions={
                    <>
                      <button type='button' className={adminButtonClass} onClick={() => select(item.id)}>
                        {translate('details.view')}
                      </button>
                      {item.state === handingOver && !item.closed ? (
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
                          <button
                            className={adminButtonClass}
                            onClick={() => setAction({ kind: 'cancel', id: item.id })}
                          >
                            {translate('cancelEvent')}
                          </button>
                        </>
                      ) : undefined}
                    </>
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
        </>
      )}
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
