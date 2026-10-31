import { ArrowRight, FileText, Handshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestDraftList } from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { useHandoverDutyList } from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import { HandoverDutyListStatus } from '~/shared/api/generated/model/handover-duties/handoverDutyListStatus'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  EmployeeButton,
  EmployeeSection,
  EmployeeQueryState,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import type { EmployeeTabKey } from '../../enums'

export function EmployeeOverviewWork({
  selfServiceOnly,
  onSelectTab
}: {
  selfServiceOnly: boolean
  onSelectTab: (tab: EmployeeTabKey) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatNumber, formatDate } = useDashboardFormat()
  const drafts = useAccessRequestDraftList({ page: 1, pageSize: 1 }, { query: { enabled: !selfServiceOnly } })
  const duties = useHandoverDutyList({ scope: 'mine', status: HandoverDutyListStatus.OPEN, page: 1, pageSize: 4 })
  const cards = [
    { key: 'duties', label: 'openHandovers', query: duties, icon: Handshake, tab: 'handovers' },
    ...(!selfServiceOnly
      ? [{ key: 'drafts', label: 'savedDrafts', query: drafts, icon: FileText, tab: 'my-requests' } as const]
      : [])
  ] as const
  return (
    <div className='space-y-5'>
      <section
        className={`grid gap-4 ${selfServiceOnly ? '' : 'sm:grid-cols-2'}`}
        aria-label={translate('redesign.tasks')}
      >
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
      <EmployeeSection
        title={translate('redesign.tasks')}
        action={
          <EmployeeButton onClick={() => onSelectTab('handovers')}>
            {translate('redesign.viewAll')}
            <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
          </EmployeeButton>
        }
      >
        <EmployeeQueryState
          query={duties}
          empty={!duties.data?.data?.items.length}
          emptyTitle={translate('redesign.noHandovers')}
          emptyDescription={translate('redesign.noHandoversHint')}
        />
        {!duties.isError && (
          <EmployeeDataTable
            label={translate('redesign.tasks')}
            items={duties.data?.data?.items ?? []}
            rowKey={(item) => item.id}
            columns={[
              {
                key: 'software',
                label: translate('redesign.application'),
                render: (item) => (
                  <div>
                    <p className='max-w-56 truncate font-medium' title={item.application.name}>
                      {item.application.name}
                    </p>
                    <p className='mt-1 max-w-56 truncate text-xs text-muted-foreground' title={item.plan.name}>
                      {item.plan.name}
                    </p>
                  </div>
                )
              },
              { key: 'due', label: translate('dueOn'), align: 'right', render: (item) => formatDate(item.dueOn) },
              { key: 'status', label: translate('state'), render: (item) => <EmployeeStatus value={item.status} /> }
            ]}
          />
        )}
      </EmployeeSection>
    </div>
  )
}
