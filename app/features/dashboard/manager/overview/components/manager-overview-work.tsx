import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpendQueueList } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import type { ManagerTabKey } from '../../enums'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerButton,
  ManagerMoney,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { ManagerOpenHandovers } from './manager-open-handovers'

export function ManagerOverviewWork({
  onSelectTab
}: {
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('manager')
  const queue = useSpendQueueList({ page: 1, pageSize: 4 })
  return (
    <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]'>
      <ManagerSection
        title={translate('batchQueue')}
        description={translate('pendingWorkHint')}
        action={
          <div className='flex flex-wrap items-center gap-3'>
            {!queue.isError && queue.data?.data && (
              <span className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                {translate('tableTotal', { count: queue.data.data.pagination.totalItems })}
              </span>
            )}
            <ManagerButton onClick={() => onSelectTab('weekly-batch')}>
              {translate('viewAll')}
              <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
            </ManagerButton>
          </div>
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
      <ManagerOpenHandovers onOpen={() => onSelectTab('handovers')} />
    </div>
  )
}
