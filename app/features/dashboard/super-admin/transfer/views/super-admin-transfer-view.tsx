import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useDepartmentTransferList,
  getDepartmentTransferListQueryKey
} from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { useDepartmentTransferReschedule } from '~/shared/api/generated/operations/department-transfers/department-transfer-reschedule'
import { useDepartmentTransferCancel } from '~/shared/api/generated/operations/department-transfers/department-transfer-cancel'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm, readSuccessor, successorFields, value } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { transferStatuses, pendingTransfer } from '../enums/transfer-status'

type Action = { kind: 'reschedule' | 'cancel'; id: string }
export function SuperAdminTransferView({ employeeId, onClose }: { employeeId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<Action | null>(null)
  const query = useDepartmentTransferList({ employeeId, page, pageSize: 20 })
  const feedback = usePersonnelMutationFeedback([getDepartmentTransferListQueryKey()], () => setAction(null))
  const reschedule = useDepartmentTransferReschedule({ mutation: { ...feedback, retry: false } })
  const cancel = useDepartmentTransferCancel({ mutation: { ...feedback, retry: false } })
  const pending = reschedule.isPending || cancel.isPending
  const data = query.data?.data
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold'>{translate('transferHistory')}</h1>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('backToProfile')}
        </button>
      </header>
      <p className='text-sm text-muted-foreground'>{translate('eventHelp')}</p>
      <AdminQueryState query={query}>
        <PersonnelList empty={!data?.items.length}>
          {data?.items.map((item) => (
            <PersonnelCard
              key={item.id}
              title={item.employee.fullName}
              actions={
                item.status === pendingTransfer ? (
                  <>
                    <button className={adminButtonClass} onClick={() => setAction({ kind: 'reschedule', id: item.id })}>
                      {translate('reschedule')}
                    </button>
                    <button className={adminButtonClass} onClick={() => setAction({ kind: 'cancel', id: item.id })}>
                      {translate('cancelEvent')}
                    </button>
                  </>
                ) : undefined
              }
            >
              <p>{translate('transferRoute', { from: item.from.department.name, to: item.to.department.name })}</p>
              <p className='font-mono tabular-nums'>{item.effectiveOn}</p>
              <PersonnelCode code={item.status} values={transferStatuses} />
            </PersonnelCard>
          ))}
        </PersonnelList>
        <AdminPagination pagination={data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {action && (
        <PersonnelForm
          title={translate(action.kind === 'reschedule' ? 'reschedule' : 'cancelEvent')}
          pending={pending}
          basis='note'
          onClose={() => setAction(null)}
          fields={
            action.kind === 'reschedule'
              ? [{ name: 'newEffectiveOn', type: 'date' }, { name: 'reason', maxLength: 1000 }, ...successorFields]
              : [{ name: 'reason', maxLength: 1000 }]
          }
          onSubmit={(values) => {
            if (pending) return
            const groundsNote = value(values, 'groundsNote')
            if (action.kind === 'reschedule')
              reschedule.mutate({
                id: action.id,
                data: {
                  newEffectiveOn: value(values, 'newEffectiveOn'),
                  reason: value(values, 'reason'),
                  groundsNote,
                  successor: readSuccessor(values)
                }
              })
            else if (action.id) cancel.mutate({ id: action.id, data: { reason: value(values, 'reason'), groundsNote } })
          }}
        />
      )}
    </section>
  )
}
