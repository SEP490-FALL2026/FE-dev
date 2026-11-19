import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOffboardingCaseGet } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { useOffboardingCaseRightList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-right-list'
import { useOffboardingCaseChangeList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-change-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { PersonnelCard, PersonnelList } from '../../shared/components/personnel-list'

export function OffboardingDetail({
  id,
  onClose,
  onAction
}: {
  id: string
  onClose: () => void
  onAction: (kind: 'change' | 'left' | 'cancel') => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [rightsPage, setRightsPage] = useState(1)
  const [changesPage, setChangesPage] = useState(1)
  const query = useOffboardingCaseGet(id, { query: { retry: false } })
  const rights = useOffboardingCaseRightList(id, { page: rightsPage, pageSize: 20 })
  const changes = useOffboardingCaseChangeList(id, { page: changesPage, pageSize: 20 })
  const data = query.data?.data
  const code = (value: string) =>
    translate(`eventCodes.${value}`, {
      defaultValue: translate(`codes.${value}`, { defaultValue: translate('unknown') })
    })
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-semibold'>{translate('details.offboarding')}</h2>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('details.backOffboarding')}
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
                data.state === 'HANDING_OVER' && !data.closed && !query.isFetching && !query.isError ? (
                  <>
                    <button
                      type='button'
                      className={adminButtonClass}
                      disabled={data.pastLastDay}
                      onClick={() => onAction('change')}
                    >
                      {translate('changeLastDay')}
                    </button>
                    <button type='button' className={adminButtonClass} onClick={() => onAction('left')}>
                      {translate('markLeft')}
                    </button>
                    <button type='button' className={adminButtonClass} onClick={() => onAction('cancel')}>
                      {translate('cancelEvent')}
                    </button>
                  </>
                ) : undefined
              }
            >
              <p>
                {code(data.state)} · {translate(data.closed ? 'details.closed' : 'details.open')}
              </p>
              <p>{data.department?.name ?? translate('directory.unplaced')}</p>
              <dl className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <dt>{translate('fields.lastWorkingDay')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDate(data.lastWorkingDay)}</dd>
                </div>
                <div>
                  <dt>{translate('details.departureEffective')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDate(data.departureEffectiveOn)}</dd>
                </div>
                {data.handoverDueOn && (
                  <div>
                    <dt>{translate('details.handoverDue')}</dt>
                    <dd className='font-mono tabular-nums'>{formatDate(data.handoverDueOn)}</dd>
                  </div>
                )}
                <div>
                  <dt>{translate('details.access')}</dt>
                  <dd>
                    {translate(data.accessBlocked ? 'details.blocked' : 'details.unblocked')}
                    {data.accessBlockedFrom && <> · {formatDate(data.accessBlockedFrom)}</>}
                  </dd>
                </div>
                <div>
                  <dt>{translate('fields.groundsNote')}</dt>
                  <dd className='whitespace-pre-wrap break-words'>{data.groundsNote ?? translate('directory.none')}</dd>
                </div>
                <div>
                  <dt>{translate('details.recordedAt')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDateTime(data.recordedAt)}</dd>
                </div>
              </dl>
              {data.accountLockMissing && <p className='text-warning'>{translate('details.accountLockMissing')}</p>}
              {data.headSuccessor?.employee && (
                <p>
                  {translate('fields.successorEmployeeId')}: {data.headSuccessor.employee.fullName}
                </p>
              )}
              {Object.entries(data.blockers)
                .filter(([, count]) => count > 0)
                .map(([kind, count]) => (
                  <p key={kind} className='text-warning'>
                    {translate(`departureIssues.${kind}`, {
                      count,
                      defaultValue: translate('details.otherBlocker', { count })
                    })}
                  </p>
                ))}
              {Object.entries(data.warnings.registered ?? {})
                .filter(([, count]) => count > 0)
                .map(([kind, count]) => (
                  <p key={kind} className='text-warning'>
                    {translate(`departureIssues.${kind}`, {
                      count,
                      defaultValue: translate('details.otherWarning', { count })
                    })}
                  </p>
                ))}
              {Object.entries(data.warnings.workspaces ?? {}).map(([id, workspace]) => (
                <p key={id} className='text-warning'>
                  {translate('details.workspaceWarning', { workspace })}
                </p>
              ))}
              {data.warnings.departmentWithoutHeadFrom && (
                <p className='text-warning'>
                  {translate('details.noHeadFrom', { date: formatDate(data.warnings.departmentWithoutHeadFrom) })}
                </p>
              )}
              {data.cancellation && <p>{translate('details.cancelledReason', { reason: data.cancellation.reason })}</p>}
              {data.checklist && (
                <dl className='grid gap-3 border-t border-border pt-4 sm:grid-cols-2'>
                  {Object.entries(data.checklist).map(([key, item]) => (
                    <div key={key}>
                      <dt>{translate(`details.checklist.${key}`, { defaultValue: translate('unknown') })}</dt>
                      <dd>{code(item.state)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </PersonnelCard>
          </>
        )}
      </AdminQueryState>
      <section className='space-y-3' aria-label={translate('details.rights')}>
        <h3 className='font-semibold'>{translate('details.rights')}</h3>
        <AdminQueryState query={rights}>
          <PersonnelList empty={!rights.data?.data?.items.length}>
            {rights.data?.data?.items.map((right) => (
              <PersonnelCard key={right.assignmentId} title={right.application.name}>
                <p>{right.plan.name}</p>
                <p>{translate(right.revocable ? 'details.revocable' : 'impact.notRevocable')}</p>
                <p>
                  {formatDate(right.effectiveFrom)}
                  {right.validUntil && <> → {formatDate(right.validUntil)}</>}
                </p>
                {right.revocation && (
                  <p>
                    {translate('details.revocation')}: {code(right.revocation.status)}
                  </p>
                )}
                {right.handover && (
                  <p>
                    {translate('details.handover')}: {code(right.handover.status)} · {formatDate(right.handover.dueOn)}
                  </p>
                )}
                {right.accessRunsOnUntil && (
                  <p>{translate('details.accessUntil', { date: formatDate(right.accessRunsOnUntil) })}</p>
                )}
                {right.dataLossOnRemoval && <p className='text-warning'>{translate('details.dataLoss')}</p>}
                {right.revocationNote && <p className='whitespace-pre-wrap break-words'>{right.revocationNote}</p>}
              </PersonnelCard>
            ))}
          </PersonnelList>
          <AdminPagination
            pagination={rights.data?.data?.pagination}
            onPageChange={setRightsPage}
            disabled={rights.isFetching}
          />
        </AdminQueryState>
      </section>
      <section className='space-y-3' aria-label={translate('details.changes')}>
        <h3 className='font-semibold'>{translate('details.changes')}</h3>
        <AdminQueryState query={changes}>
          <PersonnelList empty={!changes.data?.data?.items.length}>
            {changes.data?.data?.items.map((change) => (
              <PersonnelCard key={change.id} title={code(change.kind)}>
                <p className='font-mono tabular-nums'>{formatDateTime(change.changedAt)}</p>
                {(change.oldLastWorkingDay || change.newLastWorkingDay) && (
                  <p>
                    {change.oldLastWorkingDay && formatDate(change.oldLastWorkingDay)} →{' '}
                    {change.newLastWorkingDay && formatDate(change.newLastWorkingDay)}
                  </p>
                )}
                {change.reason && <p className='whitespace-pre-wrap break-words'>{change.reason}</p>}
                <p>
                  {translate(
                    change.changedBySystem
                      ? 'details.bySystem'
                      : change.changedByProcedure
                        ? 'details.byProcedure'
                        : 'details.byAdmin'
                  )}
                </p>
              </PersonnelCard>
            ))}
          </PersonnelList>
          <AdminPagination
            pagination={changes.data?.data?.pagination}
            onPageChange={setChangesPage}
            disabled={changes.isFetching}
          />
        </AdminQueryState>
      </section>
    </section>
  )
}
