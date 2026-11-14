import { ArrowRight, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestDraftList } from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'
import type { EmployeeTabKey } from '../../enums'

export function EmployeeOverviewWork({
  selfServiceOnly,
  onSelectTab
}: {
  selfServiceOnly: boolean
  onSelectTab: (tab: EmployeeTabKey) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatNumber } = useDashboardFormat()
  const drafts = useAccessRequestDraftList({ page: 1, pageSize: 1 }, { query: { enabled: !selfServiceOnly } })
  if (selfServiceOnly) return null
  const cards = [{ key: 'drafts', label: 'savedDrafts', query: drafts, icon: FileText, tab: 'my-requests' }] as const
  return (
    <div className='space-y-5'>
      <section className='grid gap-4 sm:grid-cols-2' aria-label={translate('redesign.tasks')}>
        {cards.map(({ key, label, query, icon: Icon, tab }) => (
          <article
            key={key}
            aria-label={translate(`redesign.${label}`)}
            className='min-w-0 rounded-lg border border-border/60 bg-surface p-4 shadow-sm sm:p-5'
          >
            <div className='flex items-start justify-between gap-3'>
              <p className='text-sm text-muted-foreground'>{translate(`redesign.${label}`)}</p>
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
                <p className='self-center text-sm text-muted-foreground'>{translate('noValue')}</p>
              ) : (
                <p className='font-mono text-3xl font-semibold tracking-tight tabular-nums'>
                  {formatNumber(query.data.data.pagination.totalItems)}
                </p>
              )}
            </div>
            {!query.isPending && <EmployeeQueryState query={query} />}
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
    </div>
  )
}
