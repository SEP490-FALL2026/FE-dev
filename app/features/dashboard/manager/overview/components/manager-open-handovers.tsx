import { ArrowRight, Handshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHandoverDutyList } from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import { HandoverDutyListStatus } from '~/shared/api/generated/model/handover-duties/handoverDutyListStatus'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerOpenHandovers({ onOpen }: { onOpen: () => void }) {
  const { t: translate } = useTranslation('manager')
  const { formatNumber } = useDashboardFormat()
  const query = useHandoverDutyList({ scope: 'mine', status: HandoverDutyListStatus.OPEN, page: 1, pageSize: 1 })
  return (
    <article
      aria-label={translate('handoverCount')}
      className='min-w-0 rounded-lg border border-border/60 bg-surface p-4 shadow-sm sm:p-5'
    >
      <div className='flex items-start justify-between gap-3'>
        <p className='max-w-48 text-sm leading-snug text-muted-foreground'>{translate('handoverCount')}</p>
        <Handshake aria-hidden strokeWidth={1.5} className='size-5 shrink-0 text-primary-ink' />
      </div>
      <div className='mt-5 flex min-h-9 justify-end'>
        {query.isPending ? (
          <span
            role='status'
            aria-label={translate('loading')}
            className='h-9 w-20 animate-pulse rounded-md bg-surface-subtle'
          />
        ) : query.isError || !query.data?.data ? (
          <p className='self-center text-sm text-muted-foreground'>{translate('notReported')}</p>
        ) : (
          <p className='font-mono text-3xl font-semibold tracking-tight tabular-nums'>
            {formatNumber(query.data.data.pagination.totalItems)}
          </p>
        )}
      </div>
      {!query.isPending && <ManagerQueryState query={query} />}
      <button
        type='button'
        className='mt-3 flex min-h-11 w-full items-center justify-between border-t border-border/50 pt-3 text-sm text-primary-ink hover:underline'
        onClick={onOpen}
      >
        {translate('open')}
        <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
      </button>
    </article>
  )
}
