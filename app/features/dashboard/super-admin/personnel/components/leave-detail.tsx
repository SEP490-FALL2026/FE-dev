import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLongLeaveGet } from '~/shared/api/generated/operations/long-leaves/long-leave-get'
import { useLongLeaveChangeList } from '~/shared/api/generated/operations/long-leaves/long-leave-change-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { PersonnelCard, PersonnelList } from '../../shared/components/personnel-list'

export function LeaveDetail({
  id,
  onClose,
  onAction
}: {
  id: string
  onClose: () => void
  onAction: (kind: 'change' | 'return') => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useLongLeaveGet(id, { query: { retry: false } })
  const changes = useLongLeaveChangeList(id, { page, pageSize: 20 })
  const data = query.data?.data
  const code = (value: string) =>
    translate(`eventCodes.${value}`, {
      defaultValue: translate(`codes.${value}`, { defaultValue: translate('unknown') })
    })
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-semibold'>{translate('details.leave')}</h2>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('details.backLeaves')}
        </button>
      </header>
      <AdminQueryState query={query}>
        {!data ? (
          <p>{translate('directory.notFound')}</p>
        ) : (
          <PersonnelCard
            title={data.employee.fullName}
            actions={
              data.status === 'ACTIVE' && !query.isFetching && !query.isError ? (
                <>
                  <button type='button' className={adminButtonClass} onClick={() => onAction('change')}>
                    {translate('changeReturn')}
                  </button>
                  <button type='button' className={adminButtonClass} onClick={() => onAction('return')}>
                    {translate('confirmReturn')}
                  </button>
                </>
              ) : undefined
            }
          >
            <p>{code(data.status)}</p>
            <dl className='grid gap-4 sm:grid-cols-2'>
              <div>
                <dt>{translate('fields.startedOn')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(data.startedOn)}</dd>
              </div>
              <div>
                <dt>{translate('fields.approvedReturnOn')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(data.approvedReturnOn)}</dd>
              </div>
              {data.endedOn && (
                <div>
                  <dt>{translate('fields.returnedOn')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDate(data.endedOn)}</dd>
                </div>
              )}
              <div>
                <dt>{translate('fields.groundsNote')}</dt>
                <dd className='whitespace-pre-wrap break-words'>{data.groundsNote ?? translate('directory.none')}</dd>
              </div>
              <div>
                <dt>{translate('details.recordedAt')}</dt>
                <dd className='font-mono tabular-nums'>{formatDateTime(data.startedAt)}</dd>
              </div>
            </dl>
            {data.overdueReturn && <p className='text-warning'>{translate('overdue')}</p>}
            {data.endKind && <p>{code(data.endKind)}</p>}
          </PersonnelCard>
        )}
      </AdminQueryState>
      <section className='space-y-3' aria-label={translate('details.changes')}>
        <h3 className='font-semibold'>{translate('details.changes')}</h3>
        <AdminQueryState query={changes}>
          <PersonnelList empty={!changes.data?.data?.items.length}>
            {changes.data?.data?.items.map((change) => (
              <PersonnelCard key={change.id} title={code(change.kind)}>
                <p className='font-mono tabular-nums'>{formatDateTime(change.recordedAt)}</p>
                {(change.oldReturnOn || change.newReturnOn) && (
                  <p>
                    {change.oldReturnOn && formatDate(change.oldReturnOn)} →{' '}
                    {change.newReturnOn && formatDate(change.newReturnOn)}
                  </p>
                )}
                {change.returnedOn && (
                  <p>
                    {translate('fields.returnedOn')}: {formatDate(change.returnedOn)}
                  </p>
                )}
                {change.groundsNote && <p className='whitespace-pre-wrap break-words'>{change.groundsNote}</p>}
                <p>{translate(change.recordedByProcedure ? 'details.byProcedure' : 'details.byAdmin')}</p>
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
