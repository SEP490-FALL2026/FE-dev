import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalSeatRanking } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-seat-ranking'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'

export function RenewalSeatRanking({ id }: { id: string }) {
  const { t: translate } = useTranslation('itRenewals')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [proposedOnly, setProposedOnly] = useState(false)
  const query = useSubscriptionRenewalSeatRanking(id, {
    page,
    pageSize: 20,
    ...(proposedOnly ? { proposedOnly: 'true' as const } : {})
  })
  const data = query.data?.data
  return (
    <section className='space-y-3'>
      <h2 className='text-lg font-semibold'>{translate('ranking')}</h2>
      <p className='text-sm text-muted-foreground'>{translate('rankingHint')}</p>
      <label className='flex min-h-11 items-center gap-2 text-sm'>
        <input
          type='checkbox'
          checked={proposedOnly}
          onChange={(event) => {
            setProposedOnly(event.target.checked)
            setPage(1)
          }}
        />
        {translate('proposedOnly')}
      </label>
      <ItQueryState query={query}>
        {data?.usage.status === 'NOT_AVAILABLE' && (
          <p className='text-sm text-muted-foreground'>{translate('usageUnavailable')}</p>
        )}
        {data?.items.length ? (
          <div className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article key={item.assignmentId} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate text-sm font-medium' title={item.employee.fullName}>
                    {item.employee.fullName}
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    {translate(`values.${item.group}`, { defaultValue: translate('unknown') })}
                  </p>
                  {item.inProposal && <p className='text-xs text-warning-ink'>{translate('inProposal')}</p>}
                </div>
                <dl className='grid grid-cols-2 gap-x-4 text-xs'>
                  <dt>{translate('rank')}</dt>
                  <dd className='text-right font-mono tabular-nums'>{formatNumber(item.position)}</dd>
                  <dt>{translate('validFrom')}</dt>
                  <dd className='text-right font-mono tabular-nums'>{formatDate(item.validFrom)}</dd>
                  <dt>{translate('lastActivity')}</dt>
                  <dd className='text-right font-mono tabular-nums'>
                    {item.lastActivityOn ? formatDate(item.lastActivityOn) : translate('unknown')}
                  </dd>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && <ItPagination page={page} total={data.pagination.totalItems} pageSize={20} onChange={setPage} />}
    </section>
  )
}
