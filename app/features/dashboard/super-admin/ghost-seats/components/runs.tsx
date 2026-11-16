import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getGhostSeatRuleRunListQueryKey,
  useGhostSeatRuleRunList
} from '~/shared/api/generated/operations/ghost-seats/ghost-seat-rule-run-list'
import { useGhostSeatRuleRunCreate } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-rule-run-create'
import { getGhostSeatKpi5GetQueryKey } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-kpi5-get'
import { AdminField, adminButtonClass, adminInputClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useAdminRetryDelay } from '../../shared/hooks/use-admin-retry-delay'
import { useDashboardFormat } from '../../../dashboard-ui'

export function Runs({ onOpenRun }: { onOpenRun: (id: string) => void }) {
  const { t: translate } = useTranslation('admin')
  const { formatDateTime, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [rules, setRules] = useState('both')
  const submitting = useRef(false)
  const query = useGhostSeatRuleRunList({ page, pageSize: 20 })
  const feedback = useAdminMutationFeedback([getGhostSeatRuleRunListQueryKey(), getGhostSeatKpi5GetQueryKey()])
  const run = useGhostSeatRuleRunCreate({
    mutation: {
      ...feedback,
      retry: false,
      onSettled: () => {
        submitting.current = false
      }
    }
  })
  const retrySeconds = useAdminRetryDelay()
  const items = query.data?.data?.items ?? []
  return (
    <section className='space-y-4'>
      <form
        className='flex flex-wrap items-end gap-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (submitting.current || run.isPending || retrySeconds > 0) return
          submitting.current = true
          run.mutate({ data: { rules: rules === 'G1G2' ? ['G1G2'] : rules === 'G3G4' ? ['G3G4'] : ['G1G2', 'G3G4'] } })
        }}
      >
        <div className='max-w-xl flex-1'>
          <AdminField label={translate('ghostSeats.runs.rules')} description={translate('ghostSeats.runs.rulesHelp')}>
            <select
              required
              value={rules}
              disabled={run.isPending}
              className={adminInputClass}
              onChange={(event) => setRules(event.target.value)}
            >
              <option value='both'>{translate('ghostSeats.runs.both')}</option>
              <option value='G1G2'>{translate('ghostSeats.runs.internal')}</option>
              <option value='G3G4'>{translate('ghostSeats.runs.usage')}</option>
            </select>
          </AdminField>
        </div>
        <button
          type='submit'
          className={adminPrimaryClass}
          disabled={run.isPending || retrySeconds > 0}
          aria-busy={run.isPending}
        >
          {run.isPending
            ? translate('saving')
            : retrySeconds > 0
              ? translate('retryIn', { count: retrySeconds })
              : translate('ghostSeats.runs.run')}
        </button>
      </form>
      <p className='text-sm text-muted-foreground'>
        {translate('ghostSeats.runs.routing')} {translate('ghostSeats.runs.noAutomaticReclaim')}
      </p>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <div className='divide-y divide-border/40'>
          {items.map((item) => (
            <article key={item.id} className='space-y-3 py-4'>
              <div className='flex flex-wrap justify-between gap-3'>
                <h2 className='font-medium'>
                  {translate(item.ruleSet === 'G1_G2' ? 'ghostSeats.runs.internal' : 'ghostSeats.runs.usage')}
                </h2>
                <span className='text-sm'>
                  {translate(`ghostSeats.runs.status.${item.status}`, { defaultValue: translate('unknown') })}
                </span>
              </div>
              <div className='flex flex-wrap justify-between gap-3 text-xs text-muted-foreground'>
                <time dateTime={item.startedAt} className='font-mono tabular-nums'>
                  {formatDateTime(item.startedAt)}
                </time>
                <span>{translate('ghostSeats.runs.attempt', { count: item.attempt })}</span>
              </div>
              <p className='text-sm tabular-nums'>
                {translate('ghostSeats.runs.count', {
                  created: formatNumber(item.createdCount),
                  updated: formatNumber(item.updatedCount),
                  closed: formatNumber(item.closedCount),
                  skipped: formatNumber(item.skippedCount),
                  failed: formatNumber(item.failedCount)
                })}
              </p>
              <button type='button' className={adminButtonClass} onClick={() => onOpenRun(item.id)}>
                {translate('ghostSeats.runs.skips')}
              </button>
            </article>
          ))}
        </div>
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
    </section>
  )
}
