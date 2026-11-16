import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRevocationSlaGet } from '~/shared/api/generated/operations/reports/revocation-sla-get'
import { useAccessRequestAuditFlagList } from '~/shared/api/generated/operations/access-requests/access-request-audit-flag-list'
import { useSubscriptionDeadlineEventList } from '~/shared/api/generated/operations/subscription-renewals/subscription-deadline-event-list'
import type { RevocationSlaGetParams, SubscriptionDeadlineEventListKind } from '~/shared/api/generated/model'
import { AdminField, adminInputClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useDashboardFormat } from '../../../dashboard-ui'

export type OperationsReport = 'sla' | 'auditFlags' | 'deadlines'
export function OperationsReports({ report }: { report: OperationsReport }) {
  if (report === 'sla') return <RevocationReport />
  if (report === 'auditFlags') return <RequestAuditReport />
  return <DeadlineReport />
}

function useReportDates() {
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  return {
    page,
    setPage,
    from,
    to,
    setFrom: (value: string) => {
      setFrom(value)
      setPage(1)
    },
    setTo: (value: string) => {
      setTo(value)
      setPage(1)
    },
    params: { page, pageSize: 20, ...(from ? { from } : {}), ...(to ? { to } : {}) }
  }
}
function DateFilters({ dates }: { dates: ReturnType<typeof useReportDates> }) {
  const { t: translate } = useTranslation('admin')
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <AdminField label={translate('oversight.from')} description={translate('oversight.dateHelp')}>
        <input
          type='date'
          className={adminInputClass}
          value={dates.from}
          max={dates.to || undefined}
          onChange={(event) => dates.setFrom(event.target.value)}
        />
      </AdminField>
      <AdminField label={translate('oversight.to')} description={translate('oversight.dateHelp')}>
        <input
          type='date'
          className={adminInputClass}
          value={dates.to}
          min={dates.from || undefined}
          onChange={(event) => dates.setTo(event.target.value)}
        />
      </AdminField>
    </div>
  )
}

function RevocationReport() {
  const { t: translate } = useTranslation('admin')
  const dates = useReportDates()
  const [groupBy, setGroupBy] = useState<NonNullable<RevocationSlaGetParams['groupBy']>>('itAdmin')
  const [source, setSource] = useState<RevocationSlaGetParams['source']>()
  const query = useRevocationSlaGet({ ...dates.params, groupBy, ...(source ? { source } : {}) })
  const data = query.data?.data
  const { formatNumber } = useDashboardFormat()
  return (
    <section className='space-y-4'>
      <h2 className='text-xl font-semibold'>{translate('oversight.sla')}</h2>
      <p className='text-sm text-muted-foreground'>{translate('oversight.reportHelp')}</p>
      <DateFilters dates={dates} />
      <div className='grid gap-4 sm:grid-cols-2'>
        <AdminField label={translate('oversight.groupBy')}>
          <select
            className={adminInputClass}
            value={groupBy}
            onChange={(event) => {
              setGroupBy(event.target.value === 'department' ? 'department' : 'itAdmin')
              dates.setPage(1)
            }}
          >
            <option value='itAdmin'>{translate('oversight.itAdmin')}</option>
            <option value='department'>{translate('oversight.department')}</option>
          </select>
        </AdminField>
        <AdminField label={translate('oversight.source')}>
          <select
            className={adminInputClass}
            value={source ?? ''}
            onChange={(event) => {
              const next = event.target.value
              setSource(next === 'OFFBOARDING' || next === 'TRANSFER' ? next : undefined)
              dates.setPage(1)
            }}
          >
            <option value=''>{translate('oversight.all')}</option>
            <option value='OFFBOARDING'>{translate('oversight.OFFBOARDING')}</option>
            <option value='TRANSFER'>{translate('oversight.TRANSFER')}</option>
          </select>
        </AdminField>
      </div>
      <AdminQueryState query={query}>
        {data && (
          <>
            <dl className='grid gap-3 sm:grid-cols-3'>
              {(['completed', 'onTime', 'overdueOpen'] as const).map((key) => (
                <div key={key} className='rounded-lg border border-border bg-surface p-4'>
                  <dt className='text-sm text-muted-foreground'>{translate(`oversight.${key}`)}</dt>
                  <dd className='mt-2 text-right font-mono text-2xl tabular-nums'>{formatNumber(data[key])}</dd>
                </div>
              ))}
            </dl>
            {!data.rows.length && <AdminEmpty />}
            {data.rows.map((row, index) => (
              <article
                key={row.key.id ?? index}
                className='grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4'
              >
                <h3 className='font-medium'>{row.key.name ?? translate('none')}</h3>
                {(['completed', 'onTime', 'overdueOpen'] as const).map((key) => (
                  <p key={key} className='text-sm text-muted-foreground'>
                    {translate(`oversight.${key}`)}
                    <span className='ml-2 font-mono text-foreground tabular-nums'>{formatNumber(row[key])}</span>
                  </p>
                ))}
              </article>
            ))}
            <AdminPagination pagination={data.pagination} onPageChange={dates.setPage} disabled={query.isFetching} />
          </>
        )}
      </AdminQueryState>
    </section>
  )
}

function RequestAuditReport() {
  const { t: translate } = useTranslation('admin')
  const dates = useReportDates()
  const query = useAccessRequestAuditFlagList({ ...dates.params, flag: 'NO_NEED_APPROVER' })
  const { formatDateTime } = useDashboardFormat()
  return (
    <section className='space-y-4'>
      <h2 className='text-xl font-semibold'>{translate('oversight.auditFlags')}</h2>
      <p className='text-sm text-muted-foreground'>{translate('oversight.auditHelp')}</p>
      <DateFilters dates={dates} />
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        {query.data?.data?.items.map((item) => (
          <article key={item.requestId} className='space-y-2 rounded-lg border border-border bg-surface p-4'>
            <h3 className='font-semibold'>
              {item.application.name} · {item.plan.name}
            </h3>
            <p className='text-sm'>
              {item.requester.fullName} · {item.department.name}
            </p>
            <p className='text-right text-xs text-muted-foreground'>
              {translate('oversight.submitted')}{' '}
              <time className='font-mono tabular-nums'>{formatDateTime(item.submittedAt)}</time>
            </p>
            <p className='text-sm text-muted-foreground'>
              {item.grant
                ? `${translate('oversight.granted')} · ${item.grant.itAdmin?.fullName ?? translate('none')}`
                : translate('oversight.pendingGrant')}
            </p>
          </article>
        ))}
        <AdminPagination
          pagination={query.data?.data?.pagination}
          onPageChange={dates.setPage}
          disabled={query.isFetching}
        />
      </AdminQueryState>
    </section>
  )
}

function DeadlineReport() {
  const { t: translate } = useTranslation('admin')
  const dates = useReportDates()
  const [kind, setKind] = useState<SubscriptionDeadlineEventListKind>()
  const query = useSubscriptionDeadlineEventList({ ...dates.params, ...(kind ? { kind } : {}) })
  const { formatDate, formatDateTime } = useDashboardFormat()
  return (
    <section className='space-y-4'>
      <h2 className='text-xl font-semibold'>{translate('oversight.deadlines')}</h2>
      <DateFilters dates={dates} />
      <AdminField label={translate('oversight.kind')}>
        <select
          className={adminInputClass}
          value={kind ?? ''}
          onChange={(event) => {
            const next = event.target.value
            setKind(next === 'AUTO_RENEWAL_INCIDENT' || next === 'EXPIRY_MARKED' ? next : undefined)
            dates.setPage(1)
          }}
        >
          <option value=''>{translate('all')}</option>
          {(['AUTO_RENEWAL_INCIDENT', 'EXPIRY_MARKED'] as const).map((value) => (
            <option key={value} value={value}>
              {translate(`oversight.${value}`)}
            </option>
          ))}
        </select>
      </AdminField>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        {query.data?.data?.items.map((item) => (
          <article key={item.id} className='space-y-2 rounded-lg border border-border bg-surface p-4'>
            <h3 className='font-semibold'>
              {item.subscription.applicationName} · {item.subscription.planName}
            </h3>
            <p className='text-sm'>{translate(`oversight.${item.kind}`, { defaultValue: translate('unknown') })}</p>
            <p className='text-right text-xs text-muted-foreground'>
              {translate('oversight.milestone')}:{' '}
              <span className='font-mono tabular-nums'>{formatDate(item.milestoneDate)}</span>
            </p>
            <p className='text-right text-xs text-muted-foreground'>
              {translate('oversight.recorded')}:{' '}
              <span className='font-mono tabular-nums'>{formatDateTime(item.recordedAt)}</span>
            </p>
          </article>
        ))}
        <AdminPagination
          pagination={query.data?.data?.pagination}
          onPageChange={dates.setPage}
          disabled={query.isFetching}
        />
      </AdminQueryState>
    </section>
  )
}
