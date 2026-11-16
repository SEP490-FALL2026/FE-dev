import { useState } from 'react'
import { formatMoney, moneyFromMinor } from '~/shared/lib/money'
import { useTranslation } from 'react-i18next'
import { useDepartmentTransferGet } from '~/shared/api/generated/operations/department-transfers/department-transfer-get'
import { useDepartmentTransferChangeList } from '~/shared/api/generated/operations/department-transfers/department-transfer-change-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { PersonnelCard, PersonnelList } from '../../shared/components/personnel-list'

export function TransferDetail({
  id,
  onClose,
  onAction
}: {
  id: string
  onClose: () => void
  onAction: (kind: 'reschedule' | 'cancel') => void
}) {
  const { t: translate, i18n } = useTranslation('adminPersonnel')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useDepartmentTransferGet(id, { query: { retry: false } })
  const changes = useDepartmentTransferChangeList(id, { page, pageSize: 20 })
  const data = query.data?.data
  const code = (value: string) =>
    translate(`eventCodes.${value}`, {
      defaultValue: translate(`codes.${value}`, { defaultValue: translate('unknown') })
    })
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-semibold'>{translate('details.transfer')}</h2>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('details.backTransfers')}
        </button>
      </header>
      <AdminQueryState query={query}>
        {!data ? (
          <p>{translate('directory.notFound')}</p>
        ) : (
          <>
            <PersonnelCard
              title={data.employee.fullName}
              actions={
                data.status === 'PENDING' && !query.isFetching && !query.isError ? (
                  <>
                    <button type='button' className={adminButtonClass} onClick={() => onAction('reschedule')}>
                      {translate('reschedule')}
                    </button>
                    <button type='button' className={adminButtonClass} onClick={() => onAction('cancel')}>
                      {translate('cancelEvent')}
                    </button>
                  </>
                ) : undefined
              }
            >
              <p>{translate('transferRoute', { from: data.from.department.name, to: data.to.department.name })}</p>
              <p>
                {code(data.status)} · {code(data.phase)}
              </p>
              <dl className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <dt>{translate('fields.effectiveOn')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDate(data.effectiveOn)}</dd>
                </div>
                {data.grace && (
                  <>
                    <div>
                      <dt>{translate('impact.graceEndsOn')}</dt>
                      <dd className='font-mono tabular-nums'>{formatDate(data.grace.endsOn)}</dd>
                    </div>
                    <div>
                      <dt>{translate('impact.graceReminderOn')}</dt>
                      <dd className='font-mono tabular-nums'>{formatDate(data.grace.reminderOn)}</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt>{translate('fields.groundsNote')}</dt>
                  <dd className='whitespace-pre-wrap break-words'>{data.groundsNote ?? translate('directory.none')}</dd>
                </div>
                <div>
                  <dt>{translate('details.recordedAt')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDateTime(data.recordedAt)}</dd>
                </div>
              </dl>
              {data.cancellation && <p>{translate('details.cancelledReason', { reason: data.cancellation.reason })}</p>}
              {data.headSuccessor?.employee && (
                <p>
                  {translate('fields.successorEmployeeId')}: {data.headSuccessor.employee.fullName}
                </p>
              )}
              {!!data.commitmentsReleased?.length && (
                <div className='space-y-2 border-t border-border pt-4'>
                  <h3 className='font-semibold'>{translate('details.commitmentsReleased')}</h3>
                  {data.commitmentsReleased.map((money) => (
                    <p key={money.currency} className='text-right font-mono tabular-nums'>
                      {formatMoney(moneyFromMinor(money.amountMinor, money.currency), i18n.language)}
                    </p>
                  ))}
                </div>
              )}
              {data.closure && <p>{translate('details.closedAt', { date: formatDateTime(data.closure.closedAt) })}</p>}
              {data.itHandover && (
                <p>
                  {translate('details.itHandover')}: {code(data.itHandover.state)}
                </p>
              )}
            </PersonnelCard>
            <section className='space-y-3' aria-label={translate('details.oldRights')}>
              <h3 className='font-semibold'>{translate('details.oldRights')}</h3>
              <PersonnelList empty={!data.oldRights.length}>
                {data.oldRights.map((right) => (
                  <PersonnelCard key={right.assignmentId} title={right.application.name}>
                    <p>
                      {right.plan.name} · {code(right.state)}
                    </p>
                    {right.revocation && (
                      <p>
                        {translate('details.revocation')}: {code(right.revocation.status)}
                      </p>
                    )}
                    {right.regranted && <p>{translate('details.regranted')}</p>}
                  </PersonnelCard>
                ))}
              </PersonnelList>
            </section>
            {data.snapshot?.before && (
              <section className='space-y-3'>
                <h3 className='font-semibold'>{translate('details.snapshotBefore')}</h3>
                <p className='font-mono tabular-nums'>{formatDate(data.snapshot.before.takenOn)}</p>
                <PersonnelList empty={!data.snapshot.before.rights.length}>
                  {data.snapshot.before.rights.map((right) => (
                    <PersonnelCard key={right.assignmentId} title={right.applicationName}>
                      <p>{right.planName}</p>
                      <p className='font-mono tabular-nums'>
                        {formatDate(right.effectiveFrom)}
                        {right.validUntil && <> → {formatDate(right.validUntil)}</>}
                      </p>
                    </PersonnelCard>
                  ))}
                </PersonnelList>
              </section>
            )}
            {data.snapshot?.after && (
              <section className='space-y-3'>
                <h3 className='font-semibold'>{translate('details.snapshotAfter')}</h3>
                <p className='font-mono tabular-nums'>{formatDate(data.snapshot.after.takenOn)}</p>
                <PersonnelList empty={!data.snapshot.after.rights.length}>
                  {data.snapshot.after.rights.map((right) => (
                    <PersonnelCard
                      key={right.assignmentId}
                      title={
                        data.oldRights.find((item) => item.assignmentId === right.assignmentId)?.application.name ??
                        data.snapshot?.before?.rights.find((item) => item.assignmentId === right.assignmentId)
                          ?.applicationName ??
                        translate('details.softwareRight')
                      }
                    >
                      <p>{code(right.outcome)}</p>
                    </PersonnelCard>
                  ))}
                </PersonnelList>
              </section>
            )}
          </>
        )}
      </AdminQueryState>
      <section className='space-y-3' aria-label={translate('details.changes')}>
        <h3 className='font-semibold'>{translate('details.changes')}</h3>
        <AdminQueryState query={changes}>
          <PersonnelList empty={!changes.data?.data?.items.length}>
            {changes.data?.data?.items.map((change) => (
              <PersonnelCard key={change.id} title={code(change.kind)}>
                <p className='font-mono tabular-nums'>{formatDateTime(change.changedAt)}</p>
                <p>
                  {formatDate(change.oldEffectiveOn)}
                  {change.newEffectiveOn && <> → {formatDate(change.newEffectiveOn)}</>}
                </p>
                <p className='whitespace-pre-wrap break-words'>{change.reason}</p>
                <p className='whitespace-pre-wrap break-words'>{change.groundsNote}</p>
                <p>{translate(change.changedByProcedure ? 'details.byProcedure' : 'details.byAdmin')}</p>
              </PersonnelCard>
            ))}
          </PersonnelList>
          <AdminPagination
            pagination={changes.data?.data?.pagination}
            onPageChange={setPage}
            disabled={changes.isFetching}
          />
        </AdminQueryState>
      </section>
    </section>
  )
}
