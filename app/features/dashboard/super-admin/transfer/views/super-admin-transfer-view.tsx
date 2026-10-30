import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useDepartmentTransferList,
  getDepartmentTransferListQueryKey
} from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { useDepartmentTransferRecord } from '~/shared/api/generated/operations/department-transfers/department-transfer-record'
import { useDepartmentTransferReschedule } from '~/shared/api/generated/operations/department-transfers/department-transfer-reschedule'
import { useDepartmentTransferCancel } from '~/shared/api/generated/operations/department-transfers/department-transfer-cancel'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm, readBasis, readSuccessor, successorFields, value } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { transferStatuses, pendingTransfer } from '../enums/transfer-status'

type Action = { kind: 'record' | 'reschedule' | 'cancel'; id?: string }
export function SuperAdminTransferView() {
  const { t: translate } = useTranslation('adminPersonnel')
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<Action | null>(null)
  const query = useDepartmentTransferList({ page, pageSize: 20 })
  const feedback = usePersonnelMutationFeedback([getDepartmentTransferListQueryKey()], () => setAction(null))
  const record = useDepartmentTransferRecord({ mutation: { ...feedback, retry: false } })
  const reschedule = useDepartmentTransferReschedule({ mutation: { ...feedback, retry: false } })
  const cancel = useDepartmentTransferCancel({ mutation: { ...feedback, retry: false } })
  const pending = record.isPending || reschedule.isPending || cancel.isPending
  const data = query.data?.data
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold'>{translate('transfers')}</h1>
        <button className={adminPrimaryClass} onClick={() => setAction({ kind: 'record' })}>
          {translate('recordTransfer')}
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
          title={translate(
            action.kind === 'record' ? 'recordTransfer' : action.kind === 'reschedule' ? 'reschedule' : 'cancelEvent'
          )}
          pending={pending}
          basis
          onClose={() => setAction(null)}
          fields={
            action.kind === 'record'
              ? [
                  { name: 'employeeId', type: 'uuid' },
                  { name: 'toDepartmentId', type: 'uuid' },
                  { name: 'effectiveOn', type: 'date' },
                  ...successorFields
                ]
              : action.kind === 'reschedule'
                ? [{ name: 'newEffectiveOn', type: 'date' }, { name: 'reason', maxLength: 2000 }, ...successorFields]
                : [{ name: 'reason', maxLength: 2000 }]
          }
          onSubmit={(values) => {
            if (pending) return
            const grounds = readBasis(values)
            if (action.kind === 'record')
              record.mutate({
                data: {
                  employeeId: value(values, 'employeeId'),
                  toDepartmentId: value(values, 'toDepartmentId'),
                  effectiveOn: value(values, 'effectiveOn'),
                  grounds,
                  successor: readSuccessor(values)
                }
              })
            else if (action.kind === 'reschedule' && action.id)
              reschedule.mutate({
                id: action.id,
                data: {
                  newEffectiveOn: value(values, 'newEffectiveOn'),
                  reason: value(values, 'reason'),
                  grounds,
                  successor: readSuccessor(values)
                }
              })
            else if (action.id) cancel.mutate({ id: action.id, data: { reason: value(values, 'reason'), grounds } })
          }}
        />
      )}
    </section>
  )
}
