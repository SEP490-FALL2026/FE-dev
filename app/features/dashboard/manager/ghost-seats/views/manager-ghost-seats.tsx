import { useTranslation } from 'react-i18next'
import { ScanLine } from 'lucide-react'
import { useGhostSeatQueueList } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-queue-list'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerPagination, ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function ManagerGhostSeats({ onOpen }: { onOpen: (id: string) => void }) {
  const { t } = useTranslation('manager')
  const { formatDate } = useWorkspaceFormat()
  const paging = useManagerPage()
  const query = useGhostSeatQueueList({ page: paging.page, pageSize: paging.pageSize })
  const data = !query.isError ? query.data?.data : null
  return (
    <div className='space-y-5'>
      <ManagerPageHeader title={t('ghost.title')} icon={ScanLine} />
      <ManagerSection title={t('ghost.queue')}>
        <ManagerQueryState query={query} empty={!data?.items.length} />
        {data && (
          <ul className='divide-y divide-border/50'>
            {data.items.map((item) => (
              <li key={item.id}>
                <button
                  type='button'
                  className='flex min-h-20 w-full flex-wrap items-center justify-between gap-4 py-4 text-left hover:bg-surface-subtle'
                  onClick={() => onOpen(item.id)}
                >
                  <span className='min-w-0 flex-1 space-y-1'>
                    <span className='block truncate font-medium' title={item.holder.fullName}>
                      {item.holder.fullName}{' '}
                      {item.selfSeat && <span className='text-xs text-primary-ink'>· {t('ghost.self')}</span>}
                    </span>
                    <span className='block truncate text-sm text-muted-foreground'>
                      {item.application.applicationName} · {item.plan.planName}
                    </span>
                    {item.returnReason && (
                      <span className='block truncate text-xs text-warning-ink' title={item.returnReason}>
                        {t('ghost.returned')}: {item.returnReason}
                      </span>
                    )}
                  </span>
                  <span className='space-y-1 text-right'>
                    <span className='block text-xs text-muted-foreground'>
                      {item.tier ? t(`ghost.tiers.${item.tier}`) : t('unknownStatus')}
                    </span>
                    <span
                      className={`block font-mono text-xs tabular-nums ${item.overdue ? 'text-danger-ink' : 'text-muted-foreground'}`}
                    >
                      {item.overdue ? t('ghost.overdue') + ' · ' : ''}
                      {item.decisionDueOn ? formatDate(item.decisionDueOn) : t('empty')}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <ManagerPagination pagination={data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      </ManagerSection>
    </div>
  )
}
