import { ArrowRight, ArrowRightLeft, Files, Handshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpendQueueList } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { useTransferReviewList } from '~/shared/api/generated/operations/transfer-reviews/transfer-review-list'
import { useHandoverDutyList } from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import { TransferReviewListStatus } from '~/shared/api/generated/model/transfer-reviews/transferReviewListStatus'
import { HandoverDutyListStatus } from '~/shared/api/generated/model/handover-duties/handoverDutyListStatus'
import type { ManagerTabKey } from '../../enums'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerButton,
  ManagerMoney,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { useDashboardFormat } from '../../../dashboard-ui'

export function ManagerOverviewWork({
  onSelectTab
}: {
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('manager')
  const { formatNumber } = useDashboardFormat()
  const queue = useSpendQueueList({ page: 1, pageSize: 4 })
  const reviews = useTransferReviewList({ status: TransferReviewListStatus.OPEN, page: 1, pageSize: 1 })
  const handovers = useHandoverDutyList({ scope: 'mine', status: HandoverDutyListStatus.OPEN, page: 1, pageSize: 1 })
  const cards = [
    { key: 'queue', title: 'queueCount', icon: Files, query: queue, tab: 'weekly-batch' },
    { key: 'reviews', title: 'transferCount', icon: ArrowRightLeft, query: reviews, tab: 'transfer-reviews' },
    { key: 'handovers', title: 'handoverCount', icon: Handshake, query: handovers, tab: 'handovers' }
  ] as const
  return (
    <div className='space-y-5'>
      <section aria-label={translate('pendingWork')} className='grid gap-3 sm:grid-cols-3'>
        {cards.map(({ key, title, icon: Icon, query, tab }) => (
          <article
            aria-label={translate(title)}
            key={key}
            className='min-w-0 rounded-lg border border-border/60 bg-surface p-4 shadow-sm sm:p-5'
          >
            <div className='flex items-start justify-between gap-3'>
              <p className='max-w-48 text-sm leading-snug text-muted-foreground'>{translate(title)}</p>
              <Icon aria-hidden strokeWidth={1.5} className='size-5 shrink-0 text-primary-ink' />
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
              onClick={() => onSelectTab(tab)}
            >
              {translate('open')}
              <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
            </button>
          </article>
        ))}
      </section>
      <ManagerSection
        title={translate('batchQueue')}
        description={translate('pendingWorkHint')}
        action={
          <ManagerButton onClick={() => onSelectTab('weekly-batch')}>
            {translate('viewAll')}
            <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
          </ManagerButton>
        }
      >
        <ManagerQueryState
          query={queue}
          empty={!queue.data?.data?.items.length}
          emptyTitle={translate('noQueue')}
          emptyDescription={translate('noQueueHint')}
        />
        {!queue.isError && (
          <ManagerDataTable
            label={translate('batchQueue')}
            items={queue.data?.data?.items ?? []}
            rowKey={(item) => item.requestId}
            columns={[
              {
                key: 'application',
                label: translate('application'),
                render: (item) => (
                  <p
                    className='max-w-56 truncate font-medium'
                    title={item.plan?.applicationName ?? item.softwareName ?? ''}
                  >
                    {item.plan?.applicationName ?? item.softwareName}
                  </p>
                )
              },
              {
                key: 'employee',
                label: translate('employee'),
                render: (item) => (
                  <p className='max-w-48 truncate' title={item.requester.fullName}>
                    {item.requester.fullName}
                  </p>
                )
              },
              {
                key: 'amount',
                label: translate('amount'),
                align: 'right',
                render: (item) => <ManagerMoney money={item.amount} />
              },
              { key: 'status', label: translate('status'), render: (item) => <ManagerStatus value={item.stage} /> }
            ]}
            onOpen={(item) => onSelectTab('request-approval', { id: item.requestId })}
          />
        )}
      </ManagerSection>
    </div>
  )
}
