import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalLineList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-line-list'
import { PROPOSAL_LINE_TYPE } from '../enums/proposal-line-type'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerMoney, ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'

export function ManagerProposalLines({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const { t: flow } = useTranslation('requestFlow')
  const { formatNumber } = useDashboardFormat()
  const paging = useManagerPage('linePage')
  const query = useBudgetProposalLineList(id, { page: paging.page, pageSize: paging.pageSize })
  const page = !query.isError ? query.data?.data : null
  return (
    <section aria-label={translate('budgetHistory.lines')} className='space-y-4 border-t border-border/60 pt-6'>
      <header className='flex flex-wrap items-center justify-between gap-2'>
        <h3 className='text-sm font-semibold'>{translate('budgetHistory.lines')}</h3>
        {page && (
          <span className='text-xs text-muted-foreground'>
            {translate('budgetHistory.lineCount', { count: page.pagination.totalItems })}
          </span>
        )}
      </header>
      <ManagerQueryState query={query} empty={!page?.items.length} emptyTitle={translate('budgetHistory.noLines')} />
      <ol className='space-y-5'>
        {page?.items.map((line) => (
          <li key={line.position} className='space-y-4 border-b border-border/60 pb-5 last:border-0 last:pb-0'>
            <div className='grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto]'>
              <div className='flex min-w-0 items-start gap-2.5'>
                <span className='pt-0.5 font-mono text-xs text-muted-foreground tabular-nums'>
                  #{formatNumber(line.position)}
                </span>
                <h4 className='min-w-0 text-sm leading-relaxed font-medium whitespace-pre-wrap [overflow-wrap:anywhere]'>
                  {line.description}
                </h4>
              </div>
              <p className='pl-6 text-right text-sm font-semibold sm:pl-0'>
                <ManagerMoney money={line.amount} />
              </p>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:col-span-2'>
                <span className='rounded-md bg-surface-subtle px-2 py-1 text-foreground'>
                  {flow(line.lineType, { defaultValue: flow('unknown') })}
                </span>
                <span>
                  {flow('priorityRank')}: {formatNumber(line.priorityRank)}
                </span>
                {line.seats !== null && (
                  <span>
                    {translate('seats')}: {formatNumber(line.seats)}
                  </span>
                )}
              </div>
            </div>
            {line.lineType === PROPOSAL_LINE_TYPE.CANCEL && (
              <p className='text-xs leading-relaxed text-muted-foreground'>
                {translate('budgetHistory.cancellationHint')}
              </p>
            )}
            {line.overCeiling && <p className='text-sm text-warning'>{flow('overCeiling')}</p>}
            {line.note && (
              <dl className='space-y-1.5 text-sm'>
                <dt className='text-xs text-muted-foreground'>{translate('note')}</dt>
                <dd className='leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]'>{line.note}</dd>
              </dl>
            )}
            {line.zbb && (
              <details className='group rounded-md border border-border/60 bg-surface-subtle/40'>
                <summary className='flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden'>
                  {flow('zbb')}
                  <ChevronDown
                    aria-hidden
                    strokeWidth={1.5}
                    className='size-4 shrink-0 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none'
                  />
                </summary>
                <dl className='space-y-4 border-t border-border/60 p-3 text-sm'>
                  {(['purpose', 'alternatives', 'consequenceIfNot', 'usageIndicator'] as const).map((field) => (
                    <div key={field} className='space-y-1.5'>
                      <dt className='text-xs text-muted-foreground'>{flow(field)}</dt>
                      <dd className='leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]'>
                        {line.zbb?.[field] || translate('budgetHistory.notRecorded')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </li>
        ))}
      </ol>
      <ManagerPagination pagination={page?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </section>
  )
}
